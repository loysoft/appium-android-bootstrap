import UiAutomator from 'appium-uiautomator';
import ADB from 'appium-adb';
import net from 'net';
import path from 'path';
import _ from 'lodash';
import { errorFromCode } from 'mobile-json-wire-protocol';
import B from 'bluebird';
import { getLogger } from 'appium-logger';


const log = getLogger('AndroidBootstrap');
const COMMAND_TYPES = {
  ACTION: 'action',
  SHUTDOWN: 'shutdown'
};

class AndroidBootstrap {
  constructor (systemPort = 4724, webSocket = undefined, cmdTimeout = 10000) {
    this.systemPort = systemPort;
    this.webSocket = webSocket;
    this.cmdTimeout = cmdTimeout;
    this.onUnexpectedShutdown = new B(() => {}).cancellable();
  }

  async start (appPackage, disableAndroidWatchers = false, acceptSslCerts = false) {
    try {
      const rootDir = path.resolve(__dirname, '..', '..');
      const startDetector = (s) => { return /Appium Socket Server Ready/.test(s); };
      const bootstrapJar = path.resolve(rootDir, 'bootstrap', 'bin', 'AppiumBootstrap.jar');

      await this.init();
      this.adb.forwardPort(this.systemPort, this.systemPort);
      this.process = await this.uiAutomator.start(
                       bootstrapJar, 'io.appium.android.bootstrap.Bootstrap',
                       startDetector, '-e', 'pkg', appPackage,
                       '-e', 'disableAndroidWatchers', disableAndroidWatchers,
                       '-e', 'acceptSslCerts', acceptSslCerts);

      // process the output
      this.process.on('output', (stdout, stderr) => {
        const alertRe = /Emitting system alert message/;
        if (alertRe.test(stdout)) {
          log.debug("Emitting alert message...");
          if (this.webSocket) {
            this.webSocket.sockets.emit('alert', {message: stdout});
          }
        }

        let stdoutLines = (stdout || "").split("\n");
        const uiautoLog = /\[APPIUM-UIAUTO\](.+)\[\/APPIUM-UIAUTO\]/;
        for (let line of stdoutLines) {
          if (line.trim()) {
            if (uiautoLog.test(line)) {
              log.info(`[BOOTSTRAP LOG] ${uiautoLog.exec(line)[1].trim()}`);
            } else {
              log.debug(`[UIAUTO STDOUT] ${line}`);
            }
          }
        }

        let stderrLines = (stderr || "").split("\n");
        for (let line of stderrLines) {
          if (line.trim()) {
            log.debug(`[UIAUTO STDERR] ${line}`);
          }
        }
      });

      // Handle unexpected UiAutomator shutdown
      this.uiAutomator.on(UiAutomator.EVENT_CHANGED, async (msg) => {
        if (msg.state === UiAutomator.STATE_STOPPED) {
          this.uiAutomator = null;
          this.onUnexpectedShutdown.cancel(new Error("UiAUtomator shut down unexpectedly"));
        }
      });

      // only return when the socket client has connected
      return await new Promise ((resolve, reject) => {
        try {
          this.socketClient = net.connect(this.systemPort);
          this.socketClient.once('connect', () => {
            log.info("Android bootstrap socket is now connected");
            resolve();
          });
        } catch (err) {
          reject(err);
        }
      });
    } catch (err) {
      log.errorAndThrow(`Error occured while starting AndroidBootstrap. Original error: ${err}`);
    }
  }

  async sendCommand (type, extra = {}, cmdTimeout = 0) {
    if (!this.socketClient) {
      throw new Error('Socket connection closed unexpectedly');
    }

    return await new Promise ((resolve, reject) => {
      // set up timeout
      cmdTimeout = cmdTimeout || this.cmdTimeout;
      setTimeout(() => {
        reject(new Error(`Bootstrap server did not respond in ${cmdTimeout} ms`));
      }, cmdTimeout);

      let cmd = Object.assign({cmd: type}, extra);
      let cmdJson = `${JSON.stringify(cmd)} \n`;
      log.debug(`Sending command to android: ${_.trunc(cmdJson, 1000).trim()}`);
      this.socketClient.write(cmdJson);
      this.socketClient.setEncoding('utf8');
      let streamData = '';
      this.socketClient.on('data', (data) => {
        log.debug("Received command result from bootstrap");
        try {
          streamData = JSON.parse(streamData + data);
          if (streamData.status === 0) {
            resolve(streamData.value);
          }
          reject(errorFromCode(streamData.status));
        } catch (ign) {
          log.debug("Stream still not complete, waiting");
          streamData += data;
        }
      });
    });
  }

  async sendAction (action, params = {}, cmdTimeout = 0) {
    let extra = {action, params};
    return await this.sendCommand(COMMAND_TYPES.ACTION, extra, cmdTimeout);
  }

  async shutdown () {
    if (!this.uiAutomator) {
      log.warn("Cannot shut down Android bootstrap; it has already shut down");
      return;
    }

    // remove listners so we don't trigger unexpected shutdown
    this.uiAutomator.removeAllListeners(UiAutomator.EVENT_CHANGED);
    if (this.socketClient) {
      await this.sendCommand(COMMAND_TYPES.SHUTDOWN);
    }
    await this.uiAutomator.shutdown();
    this.uiAutomator = null;
  }

  // this helper function makes unit testing easier.
  async init () {
    this.adb = await ADB.createADB();
    this.uiAutomator = new UiAutomator(this.adb);
  }
}

export { AndroidBootstrap, COMMAND_TYPES };
export default AndroidBootstrap;

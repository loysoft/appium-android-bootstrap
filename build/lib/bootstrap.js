'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _appiumUiautomator = require('appium-uiautomator');

var _appiumUiautomator2 = _interopRequireDefault(_appiumUiautomator);

var _appiumAdb = require('appium-adb');

var _appiumAdb2 = _interopRequireDefault(_appiumAdb);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mobileJsonWireProtocol = require('mobile-json-wire-protocol');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _appiumLogger = require('appium-logger');

var log = (0, _appiumLogger.getLogger)('AndroidBootstrap');
var COMMAND_TYPES = {
  ACTION: 'action',
  SHUTDOWN: 'shutdown'
};

var AndroidBootstrap = (function () {
  function AndroidBootstrap() {
    var systemPort = arguments.length <= 0 || arguments[0] === undefined ? 4724 : arguments[0];
    var webSocket = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
    var cmdTimeout = arguments.length <= 2 || arguments[2] === undefined ? 10000 : arguments[2];

    _classCallCheck(this, AndroidBootstrap);

    this.systemPort = systemPort;
    this.webSocket = webSocket;
    this.cmdTimeout = cmdTimeout;
    this.onUnexpectedShutdown = new _bluebird2['default'](function () {}).cancellable();
  }

  _createClass(AndroidBootstrap, [{
    key: 'start',
    value: function start(appPackage) {
      var disableAndroidWatchers = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var acceptSslCerts = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
      var rootDir, startDetector, bootstrapJar;
      return _regeneratorRuntime.async(function start$(context$2$0) {
        var _this = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.prev = 0;
            rootDir = _path2['default'].resolve(__dirname, '..', '..');

            startDetector = function startDetector(s) {
              return (/Appium Socket Server Ready/.test(s)
              );
            };

            bootstrapJar = _path2['default'].resolve(rootDir, 'bootstrap', 'bin', 'AppiumBootstrap.jar');
            context$2$0.next = 6;
            return _regeneratorRuntime.awrap(this.init());

          case 6:
            this.adb.forwardPort(this.systemPort, this.systemPort);
            context$2$0.next = 9;
            return _regeneratorRuntime.awrap(this.uiAutomator.start(bootstrapJar, 'io.appium.android.bootstrap.Bootstrap', startDetector, '-e', 'pkg', appPackage, '-e', 'disableAndroidWatchers', disableAndroidWatchers, '-e', 'acceptSslCerts', acceptSslCerts));

          case 9:
            this.process = context$2$0.sent;

            // process the output
            this.process.on('output', function (stdout, stderr) {
              var alertRe = /Emitting system alert message/;
              if (alertRe.test(stdout)) {
                log.debug("Emitting alert message...");
                if (_this.webSocket) {
                  _this.webSocket.sockets.emit('alert', { message: stdout });
                }
              }

              var stdoutLines = (stdout || "").split("\n");
              var uiautoLog = /\[APPIUM-UIAUTO\](.+)\[\/APPIUM-UIAUTO\]/;
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = _getIterator(stdoutLines), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var line = _step.value;

                  if (line.trim()) {
                    if (uiautoLog.test(line)) {
                      log.info('[BOOTSTRAP LOG] ' + uiautoLog.exec(line)[1].trim());
                    } else {
                      log.debug('[UIAUTO STDOUT] ' + line);
                    }
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              var stderrLines = (stderr || "").split("\n");
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = _getIterator(stderrLines), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var line = _step2.value;

                  if (line.trim()) {
                    log.debug('[UIAUTO STDERR] ' + line);
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                    _iterator2['return']();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }
            });

            // Handle unexpected UiAutomator shutdown
            this.uiAutomator.on(_appiumUiautomator2['default'].EVENT_CHANGED, function callee$2$0(msg) {
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    if (msg.state === _appiumUiautomator2['default'].STATE_STOPPED) {
                      this.uiAutomator = null;
                      this.onUnexpectedShutdown.cancel(new Error("UiAUtomator shut down unexpectedly"));
                    }

                  case 1:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this);
            });

            // only return when the socket client has connected
            context$2$0.next = 14;
            return _regeneratorRuntime.awrap(new _Promise(function (resolve, reject) {
              try {
                _this.socketClient = _net2['default'].connect(_this.systemPort);
                _this.socketClient.once('connect', function () {
                  log.info("Android bootstrap socket is now connected");
                  resolve();
                });
              } catch (err) {
                reject(err);
              }
            }));

          case 14:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 17:
            context$2$0.prev = 17;
            context$2$0.t0 = context$2$0['catch'](0);

            log.errorAndThrow('Error occured while starting AndroidBootstrap. Original error: ' + context$2$0.t0);

          case 20:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[0, 17]]);
    }
  }, {
    key: 'sendCommand',
    value: function sendCommand(type) {
      var extra = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var cmdTimeout = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      return _regeneratorRuntime.async(function sendCommand$(context$2$0) {
        var _this2 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (this.socketClient) {
              context$2$0.next = 2;
              break;
            }

            throw new Error('Socket connection closed unexpectedly');

          case 2:
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap(new _Promise(function (resolve, reject) {
              // set up timeout
              cmdTimeout = cmdTimeout || _this2.cmdTimeout;
              setTimeout(function () {
                reject(new Error('Bootstrap server did not respond in ' + cmdTimeout + ' ms'));
              }, cmdTimeout);

              var cmd = _Object$assign({ cmd: type }, extra);
              var cmdJson = JSON.stringify(cmd) + ' \n';
              log.debug('Sending command to android: ' + _lodash2['default'].trunc(cmdJson, 1000).trim());
              _this2.socketClient.write(cmdJson);
              _this2.socketClient.setEncoding('utf8');
              var streamData = '';
              _this2.socketClient.on('data', function (data) {
                log.debug("Received command result from bootstrap");
                try {
                  streamData = JSON.parse(streamData + data);
                  if (streamData.status === 0) {
                    resolve(streamData.value);
                  }
                  reject((0, _mobileJsonWireProtocol.errorFromCode)(streamData.status));
                } catch (ign) {
                  log.debug("Stream still not complete, waiting");
                  streamData += data;
                }
              });
            }));

          case 4:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'sendAction',
    value: function sendAction(action) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var cmdTimeout = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var extra;
      return _regeneratorRuntime.async(function sendAction$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            extra = { action: action, params: params };
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(this.sendCommand(COMMAND_TYPES.ACTION, extra, cmdTimeout));

          case 3:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'shutdown',
    value: function shutdown() {
      return _regeneratorRuntime.async(function shutdown$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (this.uiAutomator) {
              context$2$0.next = 3;
              break;
            }

            log.warn("Cannot shut down Android bootstrap; it has already shut down");
            return context$2$0.abrupt('return');

          case 3:

            // remove listners so we don't trigger unexpected shutdown
            this.uiAutomator.removeAllListeners(_appiumUiautomator2['default'].EVENT_CHANGED);

            if (!this.socketClient) {
              context$2$0.next = 7;
              break;
            }

            context$2$0.next = 7;
            return _regeneratorRuntime.awrap(this.sendCommand(COMMAND_TYPES.SHUTDOWN));

          case 7:
            context$2$0.next = 9;
            return _regeneratorRuntime.awrap(this.uiAutomator.shutdown());

          case 9:
            this.uiAutomator = null;

          case 10:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }

    // this helper function makes unit testing easier.
  }, {
    key: 'init',
    value: function init() {
      return _regeneratorRuntime.async(function init$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(_appiumAdb2['default'].createADB());

          case 2:
            this.adb = context$2$0.sent;

            this.uiAutomator = new _appiumUiautomator2['default'](this.adb);

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return AndroidBootstrap;
})();

exports.AndroidBootstrap = AndroidBootstrap;
exports.COMMAND_TYPES = COMMAND_TYPES;
exports['default'] = AndroidBootstrap;
//# sourceMappingURL=data:application/json;base64,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SSxDQUFDOzs7Ozs7O0tBQ3pCOzs7OztXQUdVOzs7Ozs2Q0FDUSx1QkFBSSxTQUFTLEVBQUU7OztBQUFoQyxnQkFBSSxDQUFDLEdBQUc7O0FBQ1IsZ0JBQUksQ0FBQyxXQUFXLEdBQUcsbUNBQWdCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Ozs7OztLQUM5Qzs7O1NBdklHLGdCQUFnQjs7O1FBMEliLGdCQUFnQixHQUFoQixnQkFBZ0I7UUFBRSxhQUFhLEdBQWIsYUFBYTtxQkFDekIsZ0JBQWdCIiwiZmlsZSI6ImxpYi9ib290c3RyYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVWlBdXRvbWF0b3IgZnJvbSAnYXBwaXVtLXVpYXV0b21hdG9yJztcbmltcG9ydCBBREIgZnJvbSAnYXBwaXVtLWFkYic7XG5pbXBvcnQgbmV0IGZyb20gJ25ldCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBlcnJvckZyb21Db2RlIH0gZnJvbSAnbW9iaWxlLWpzb24td2lyZS1wcm90b2NvbCc7XG5pbXBvcnQgQiBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgeyBnZXRMb2dnZXIgfSBmcm9tICdhcHBpdW0tbG9nZ2VyJztcblxuXG5jb25zdCBsb2cgPSBnZXRMb2dnZXIoJ0FuZHJvaWRCb290c3RyYXAnKTtcbmNvbnN0IENPTU1BTkRfVFlQRVMgPSB7XG4gIEFDVElPTjogJ2FjdGlvbicsXG4gIFNIVVRET1dOOiAnc2h1dGRvd24nXG59O1xuXG5jbGFzcyBBbmRyb2lkQm9vdHN0cmFwIHtcbiAgY29uc3RydWN0b3IgKHN5c3RlbVBvcnQgPSA0NzI0LCB3ZWJTb2NrZXQgPSB1bmRlZmluZWQsIGNtZFRpbWVvdXQgPSAxMDAwMCkge1xuICAgIHRoaXMuc3lzdGVtUG9ydCA9IHN5c3RlbVBvcnQ7XG4gICAgdGhpcy53ZWJTb2NrZXQgPSB3ZWJTb2NrZXQ7XG4gICAgdGhpcy5jbWRUaW1lb3V0ID0gY21kVGltZW91dDtcbiAgICB0aGlzLm9uVW5leHBlY3RlZFNodXRkb3duID0gbmV3IEIoKCkgPT4ge30pLmNhbmNlbGxhYmxlKCk7XG4gIH1cblxuICBhc3luYyBzdGFydCAoYXBwUGFja2FnZSwgZGlzYWJsZUFuZHJvaWRXYXRjaGVycyA9IGZhbHNlLCBhY2NlcHRTc2xDZXJ0cyA9IGZhbHNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJvb3REaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nKTtcbiAgICAgIGNvbnN0IHN0YXJ0RGV0ZWN0b3IgPSAocykgPT4geyByZXR1cm4gL0FwcGl1bSBTb2NrZXQgU2VydmVyIFJlYWR5Ly50ZXN0KHMpOyB9O1xuICAgICAgY29uc3QgYm9vdHN0cmFwSmFyID0gcGF0aC5yZXNvbHZlKHJvb3REaXIsICdib290c3RyYXAnLCAnYmluJywgJ0FwcGl1bUJvb3RzdHJhcC5qYXInKTtcblxuICAgICAgYXdhaXQgdGhpcy5pbml0KCk7XG4gICAgICB0aGlzLmFkYi5mb3J3YXJkUG9ydCh0aGlzLnN5c3RlbVBvcnQsIHRoaXMuc3lzdGVtUG9ydCk7XG4gICAgICB0aGlzLnByb2Nlc3MgPSBhd2FpdCB0aGlzLnVpQXV0b21hdG9yLnN0YXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICBib290c3RyYXBKYXIsICdpby5hcHBpdW0uYW5kcm9pZC5ib290c3RyYXAuQm9vdHN0cmFwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgc3RhcnREZXRlY3RvciwgJy1lJywgJ3BrZycsIGFwcFBhY2thZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICctZScsICdkaXNhYmxlQW5kcm9pZFdhdGNoZXJzJywgZGlzYWJsZUFuZHJvaWRXYXRjaGVycyxcbiAgICAgICAgICAgICAgICAgICAgICAgJy1lJywgJ2FjY2VwdFNzbENlcnRzJywgYWNjZXB0U3NsQ2VydHMpO1xuXG4gICAgICAvLyBwcm9jZXNzIHRoZSBvdXRwdXRcbiAgICAgIHRoaXMucHJvY2Vzcy5vbignb3V0cHV0JywgKHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgIGNvbnN0IGFsZXJ0UmUgPSAvRW1pdHRpbmcgc3lzdGVtIGFsZXJ0IG1lc3NhZ2UvO1xuICAgICAgICBpZiAoYWxlcnRSZS50ZXN0KHN0ZG91dCkpIHtcbiAgICAgICAgICBsb2cuZGVidWcoXCJFbWl0dGluZyBhbGVydCBtZXNzYWdlLi4uXCIpO1xuICAgICAgICAgIGlmICh0aGlzLndlYlNvY2tldCkge1xuICAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQuc29ja2V0cy5lbWl0KCdhbGVydCcsIHttZXNzYWdlOiBzdGRvdXR9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc3Rkb3V0TGluZXMgPSAoc3Rkb3V0IHx8IFwiXCIpLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICBjb25zdCB1aWF1dG9Mb2cgPSAvXFxbQVBQSVVNLVVJQVVUT1xcXSguKylcXFtcXC9BUFBJVU0tVUlBVVRPXFxdLztcbiAgICAgICAgZm9yIChsZXQgbGluZSBvZiBzdGRvdXRMaW5lcykge1xuICAgICAgICAgIGlmIChsaW5lLnRyaW0oKSkge1xuICAgICAgICAgICAgaWYgKHVpYXV0b0xvZy50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgICAgIGxvZy5pbmZvKGBbQk9PVFNUUkFQIExPR10gJHt1aWF1dG9Mb2cuZXhlYyhsaW5lKVsxXS50cmltKCl9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsb2cuZGVidWcoYFtVSUFVVE8gU1RET1VUXSAke2xpbmV9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHN0ZGVyckxpbmVzID0gKHN0ZGVyciB8fCBcIlwiKS5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgZm9yIChsZXQgbGluZSBvZiBzdGRlcnJMaW5lcykge1xuICAgICAgICAgIGlmIChsaW5lLnRyaW0oKSkge1xuICAgICAgICAgICAgbG9nLmRlYnVnKGBbVUlBVVRPIFNUREVSUl0gJHtsaW5lfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIEhhbmRsZSB1bmV4cGVjdGVkIFVpQXV0b21hdG9yIHNodXRkb3duXG4gICAgICB0aGlzLnVpQXV0b21hdG9yLm9uKFVpQXV0b21hdG9yLkVWRU5UX0NIQU5HRUQsIGFzeW5jIChtc2cpID0+IHtcbiAgICAgICAgaWYgKG1zZy5zdGF0ZSA9PT0gVWlBdXRvbWF0b3IuU1RBVEVfU1RPUFBFRCkge1xuICAgICAgICAgIHRoaXMudWlBdXRvbWF0b3IgPSBudWxsO1xuICAgICAgICAgIHRoaXMub25VbmV4cGVjdGVkU2h1dGRvd24uY2FuY2VsKG5ldyBFcnJvcihcIlVpQVV0b21hdG9yIHNodXQgZG93biB1bmV4cGVjdGVkbHlcIikpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gb25seSByZXR1cm4gd2hlbiB0aGUgc29ja2V0IGNsaWVudCBoYXMgY29ubmVjdGVkXG4gICAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UgKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLnNvY2tldENsaWVudCA9IG5ldC5jb25uZWN0KHRoaXMuc3lzdGVtUG9ydCk7XG4gICAgICAgICAgdGhpcy5zb2NrZXRDbGllbnQub25jZSgnY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgIGxvZy5pbmZvKFwiQW5kcm9pZCBib290c3RyYXAgc29ja2V0IGlzIG5vdyBjb25uZWN0ZWRcIik7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxvZy5lcnJvckFuZFRocm93KGBFcnJvciBvY2N1cmVkIHdoaWxlIHN0YXJ0aW5nIEFuZHJvaWRCb290c3RyYXAuIE9yaWdpbmFsIGVycm9yOiAke2Vycn1gKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzZW5kQ29tbWFuZCAodHlwZSwgZXh0cmEgPSB7fSwgY21kVGltZW91dCA9IDApIHtcbiAgICBpZiAoIXRoaXMuc29ja2V0Q2xpZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvY2tldCBjb25uZWN0aW9uIGNsb3NlZCB1bmV4cGVjdGVkbHknKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UgKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIHNldCB1cCB0aW1lb3V0XG4gICAgICBjbWRUaW1lb3V0ID0gY21kVGltZW91dCB8fCB0aGlzLmNtZFRpbWVvdXQ7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgQm9vdHN0cmFwIHNlcnZlciBkaWQgbm90IHJlc3BvbmQgaW4gJHtjbWRUaW1lb3V0fSBtc2ApKTtcbiAgICAgIH0sIGNtZFRpbWVvdXQpO1xuXG4gICAgICBsZXQgY21kID0gT2JqZWN0LmFzc2lnbih7Y21kOiB0eXBlfSwgZXh0cmEpO1xuICAgICAgbGV0IGNtZEpzb24gPSBgJHtKU09OLnN0cmluZ2lmeShjbWQpfSBcXG5gO1xuICAgICAgbG9nLmRlYnVnKGBTZW5kaW5nIGNvbW1hbmQgdG8gYW5kcm9pZDogJHtfLnRydW5jKGNtZEpzb24sIDEwMDApLnRyaW0oKX1gKTtcbiAgICAgIHRoaXMuc29ja2V0Q2xpZW50LndyaXRlKGNtZEpzb24pO1xuICAgICAgdGhpcy5zb2NrZXRDbGllbnQuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgICAgIGxldCBzdHJlYW1EYXRhID0gJyc7XG4gICAgICB0aGlzLnNvY2tldENsaWVudC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGxvZy5kZWJ1ZyhcIlJlY2VpdmVkIGNvbW1hbmQgcmVzdWx0IGZyb20gYm9vdHN0cmFwXCIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHN0cmVhbURhdGEgPSBKU09OLnBhcnNlKHN0cmVhbURhdGEgKyBkYXRhKTtcbiAgICAgICAgICBpZiAoc3RyZWFtRGF0YS5zdGF0dXMgPT09IDApIHtcbiAgICAgICAgICAgIHJlc29sdmUoc3RyZWFtRGF0YS52YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlamVjdChlcnJvckZyb21Db2RlKHN0cmVhbURhdGEuc3RhdHVzKSk7XG4gICAgICAgIH0gY2F0Y2ggKGlnbikge1xuICAgICAgICAgIGxvZy5kZWJ1ZyhcIlN0cmVhbSBzdGlsbCBub3QgY29tcGxldGUsIHdhaXRpbmdcIik7XG4gICAgICAgICAgc3RyZWFtRGF0YSArPSBkYXRhO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNlbmRBY3Rpb24gKGFjdGlvbiwgcGFyYW1zID0ge30sIGNtZFRpbWVvdXQgPSAwKSB7XG4gICAgbGV0IGV4dHJhID0ge2FjdGlvbiwgcGFyYW1zfTtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5zZW5kQ29tbWFuZChDT01NQU5EX1RZUEVTLkFDVElPTiwgZXh0cmEsIGNtZFRpbWVvdXQpO1xuICB9XG5cbiAgYXN5bmMgc2h1dGRvd24gKCkge1xuICAgIGlmICghdGhpcy51aUF1dG9tYXRvcikge1xuICAgICAgbG9nLndhcm4oXCJDYW5ub3Qgc2h1dCBkb3duIEFuZHJvaWQgYm9vdHN0cmFwOyBpdCBoYXMgYWxyZWFkeSBzaHV0IGRvd25cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGxpc3RuZXJzIHNvIHdlIGRvbid0IHRyaWdnZXIgdW5leHBlY3RlZCBzaHV0ZG93blxuICAgIHRoaXMudWlBdXRvbWF0b3IucmVtb3ZlQWxsTGlzdGVuZXJzKFVpQXV0b21hdG9yLkVWRU5UX0NIQU5HRUQpO1xuICAgIGlmICh0aGlzLnNvY2tldENsaWVudCkge1xuICAgICAgYXdhaXQgdGhpcy5zZW5kQ29tbWFuZChDT01NQU5EX1RZUEVTLlNIVVRET1dOKTtcbiAgICB9XG4gICAgYXdhaXQgdGhpcy51aUF1dG9tYXRvci5zaHV0ZG93bigpO1xuICAgIHRoaXMudWlBdXRvbWF0b3IgPSBudWxsO1xuICB9XG5cbiAgLy8gdGhpcyBoZWxwZXIgZnVuY3Rpb24gbWFrZXMgdW5pdCB0ZXN0aW5nIGVhc2llci5cbiAgYXN5bmMgaW5pdCAoKSB7XG4gICAgdGhpcy5hZGIgPSBhd2FpdCBBREIuY3JlYXRlQURCKCk7XG4gICAgdGhpcy51aUF1dG9tYXRvciA9IG5ldyBVaUF1dG9tYXRvcih0aGlzLmFkYik7XG4gIH1cbn1cblxuZXhwb3J0IHsgQW5kcm9pZEJvb3RzdHJhcCwgQ09NTUFORF9UWVBFUyB9O1xuZXhwb3J0IGRlZmF1bHQgQW5kcm9pZEJvb3RzdHJhcDtcbiJdfQ==
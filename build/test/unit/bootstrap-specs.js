// transpile :mocha

'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _2 = require('../..');

var _appiumAdb = require('appium-adb');

var _appiumAdb2 = _interopRequireDefault(_appiumAdb);

var _appiumTestSupport = require('appium-test-support');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _appiumUiautomator = require('appium-uiautomator');

var _appiumUiautomator2 = _interopRequireDefault(_appiumUiautomator);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _mobileJsonWireProtocol = require('mobile-json-wire-protocol');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

_chai2['default'].should();
_chai2['default'].use(_chaiAsPromised2['default']);

describe('AndroidBootstrap', function () {
  var systemPort = 4724;
  var androidBootstrap = new _2.AndroidBootstrap(systemPort),
      adb = new _appiumAdb2['default'](),
      uiAutomator = new _appiumUiautomator2['default'](adb);

  describe("start", (0, _appiumTestSupport.withSandbox)({ mocks: { adb: adb, uiAutomator: uiAutomator, net: _net2['default'], androidBootstrap: androidBootstrap } }, function (S) {
    it("should return a subProcess", function callee$2$0() {
      var conn, appPackage, disableAndroidWatchers;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            conn = new _events2['default'].EventEmitter();
            appPackage = 'com.example.android.apis', disableAndroidWatchers = false;

            androidBootstrap.adb = adb;
            androidBootstrap.uiAutomator = uiAutomator;
            S.mocks.androidBootstrap.expects('init').once().returns('');
            S.mocks.adb.expects('forwardPort').once().withExactArgs(systemPort, systemPort).returns('');
            S.mocks.uiAutomator.expects("start").once().returns(conn);
            S.mocks.net.expects('connect').once().returns(conn);
            setTimeout(function () {
              conn.emit("connect");
            }, 1);
            context$3$0.next = 11;
            return _regeneratorRuntime.awrap(androidBootstrap.start(appPackage, disableAndroidWatchers));

          case 11:
            S.verify();

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  }));
  describe("sendCommand", function () {
    it("should timeout", function callee$2$0() {
      var conn;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            conn = new _events2['default'].EventEmitter();

            conn.write = _lodash2['default'].noop;
            conn.setEncoding = _lodash2['default'].noop;
            androidBootstrap.socketClient = conn;
            context$3$0.next = 6;
            return _regeneratorRuntime.awrap(androidBootstrap.sendCommand(_2.COMMAND_TYPES.ACTION, { action: 'getDataDir' }, 1000).should.eventually.be.rejectedWith("Bootstrap"));

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
    it("should successfully return after receiving data from bootstrap in parts", function callee$2$0() {
      var conn;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            conn = new _events2['default'].EventEmitter();

            conn.write = _lodash2['default'].noop;
            conn.setEncoding = _lodash2['default'].noop;
            androidBootstrap.socketClient = conn;
            setTimeout(function () {
              conn.emit("data", '{"status":0, ');
              conn.emit("data", '"value": "hello"}');
            }, 1);
            context$3$0.next = 7;
            return _regeneratorRuntime.awrap(androidBootstrap.sendCommand(_2.COMMAND_TYPES.ACTION, { action: 'getDataDir' }, 1000));

          case 7:
            context$3$0.sent.should.equal("hello");

          case 8:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
    it("should successfully return after receiving data from bootstrap", function callee$2$0() {
      var conn;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            conn = new _events2['default'].EventEmitter();

            conn.write = _lodash2['default'].noop;
            conn.setEncoding = _lodash2['default'].noop;
            androidBootstrap.socketClient = conn;
            setTimeout(function () {
              conn.emit("data", '{"status":0, "value": "hello"}');
            }, 0);
            context$3$0.next = 7;
            return _regeneratorRuntime.awrap(androidBootstrap.sendCommand(_2.COMMAND_TYPES.ACTION, { action: 'getDataDir' }, 1000));

          case 7:
            context$3$0.sent.should.equal("hello");

          case 8:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
    it("should throw correct error if status is not zero", function callee$2$0() {
      var conn;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            conn = new _events2['default'].EventEmitter();

            conn.write = _lodash2['default'].noop;
            conn.setEncoding = _lodash2['default'].noop;
            androidBootstrap.socketClient = conn;
            setTimeout(function () {
              conn.emit("data", '{"status":7, "value": "not found"}');
            }, 0);
            context$3$0.next = 7;
            return _regeneratorRuntime.awrap(androidBootstrap.sendCommand(_2.COMMAND_TYPES.ACTION, { action: 'getDataDir' }, 1000).should.eventually.be.rejectedWith(_mobileJsonWireProtocol.errors.NoSuchElementError));

          case 7:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  });
  describe("sendAction", (0, _appiumTestSupport.withSandbox)({ mocks: { androidBootstrap: androidBootstrap } }, function (S) {
    it("should call sendCommand", function callee$2$0() {
      var extra;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            extra = { action: 'wake', params: {} };

            S.mocks.androidBootstrap.expects('sendCommand').once().withExactArgs('action', extra, 0).returns('');
            context$3$0.next = 4;
            return _regeneratorRuntime.awrap(androidBootstrap.sendAction('wake'));

          case 4:
            S.verify();

          case 5:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  }));
  describe("shutdown", (0, _appiumTestSupport.withSandbox)({ mocks: { androidBootstrap: androidBootstrap, uiAutomator: uiAutomator } }, function (S) {
    it("should call sendCommand", function callee$2$0() {
      var conn;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            conn = new _events2['default'].EventEmitter();

            androidBootstrap.socketClient = conn;
            S.mocks.androidBootstrap.expects('sendCommand').once().withExactArgs('shutdown').returns('');
            S.mocks.uiAutomator.expects("shutdown").once().returns("");
            context$3$0.next = 6;
            return _regeneratorRuntime.awrap(androidBootstrap.shutdown());

          case 6:
            S.verify();

          case 7:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvdW5pdC9ib290c3RyYXAtc3BlY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7OEJBQ0ksa0JBQWtCOzs7O2lCQUNHLE9BQU87O3lCQUN2QyxZQUFZOzs7O2lDQUNBLHFCQUFxQjs7c0JBQzlCLFFBQVE7Ozs7aUNBQ0gsb0JBQW9COzs7O21CQUM1QixLQUFLOzs7O3NDQUNFLDJCQUEyQjs7c0JBQ3BDLFFBQVE7Ozs7QUFHdEIsa0JBQUssTUFBTSxFQUFFLENBQUM7QUFDZCxrQkFBSyxHQUFHLDZCQUFnQixDQUFDOztBQUV6QixRQUFRLENBQUMsa0JBQWtCLEVBQUUsWUFBWTtBQUN2QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDeEIsTUFBSSxnQkFBZ0IsR0FBRyx3QkFBcUIsVUFBVSxDQUFDO01BQ25ELEdBQUcsR0FBRyw0QkFBUztNQUNmLFdBQVcsR0FBRyxtQ0FBZ0IsR0FBRyxDQUFDLENBQUM7O0FBRXZDLFVBQVEsQ0FBQyxPQUFPLEVBQUUsb0NBQVksRUFBQyxLQUFLLEVBQUUsRUFBQyxHQUFHLEVBQUgsR0FBRyxFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUUsR0FBRyxrQkFBQSxFQUFFLGdCQUFnQixFQUFoQixnQkFBZ0IsRUFBQyxFQUFDLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDdkYsTUFBRSxDQUFDLDRCQUE0QixFQUFFO1VBQzNCLElBQUksRUFDRixVQUFVLEVBQ1Ysc0JBQXNCOzs7O0FBRnhCLGdCQUFJLEdBQUcsSUFBSSxvQkFBTyxZQUFZLEVBQUU7QUFDOUIsc0JBQVUsR0FBRywwQkFBMEIsRUFDdkMsc0JBQXNCLEdBQUcsS0FBSzs7QUFDcEMsNEJBQWdCLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUMzQiw0QkFBZ0IsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQzNDLGFBQUMsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFD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RSxDQUNuRCxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FDakMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs2Q0FDVCxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDOzs7QUFDekMsYUFBQyxDQUFDLE1BQU0sRUFBRSxDQUFDOzs7Ozs7O0tBQ1osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDLENBQUM7QUFDSixVQUFRLENBQUMsVUFBVSxFQUFFLG9DQUFZLEVBQUMsS0FBSyxFQUFFLEVBQUMsZ0JBQWdCLEVBQWhCLGdCQUFnQixFQUFFLFdBQVcsRUFBWCxXQUFXLEVBQUMsRUFBQyxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQ2hGLE1BQUUsQ0FBQyx5QkFBeUIsRUFBRTtVQUN4QixJQUFJOzs7O0FBQUosZ0JBQUksR0FBRyxJQUFJLG9CQUFPLFlBQVksRUFBRTs7QUFDcEMsNEJBQWdCLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztBQUNyQyxhQUFDLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FDbkQsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUN6QixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDZixhQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQ3BDLElBQUksRUFBRSxDQUNOLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7NkNBQ1QsZ0JBQWdCLENBQUMsUUFBUSxFQUFFOzs7QUFDakMsYUFBQyxDQUFDLE1BQU0sRUFBRSxDQUFDOzs7Ozs7O0tBQ1osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDLENBQUM7Q0FDTCxDQUFDLENBQUMiLCJmaWxlIjoidGVzdC91bml0L2Jvb3RzdHJhcC1zcGVjcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRyYW5zcGlsZSA6bW9jaGFcblxuaW1wb3J0IGNoYWkgZnJvbSAnY2hhaSc7XG5pbXBvcnQgY2hhaUFzUHJvbWlzZWQgZnJvbSAnY2hhaS1hcy1wcm9taXNlZCc7XG5pbXBvcnQgeyBBbmRyb2lkQm9vdHN0cmFwLCBDT01NQU5EX1RZUEVTIH0gZnJvbSAnLi4vLi4nO1xuaW1wb3J0IEFEQiBmcm9tICdhcHBpdW0tYWRiJztcbmltcG9ydCB7IHdpdGhTYW5kYm94IH0gZnJvbSAnYXBwaXVtLXRlc3Qtc3VwcG9ydCc7XG5pbXBvcnQgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgVWlBdXRvbWF0b3IgZnJvbSAnYXBwaXVtLXVpYXV0b21hdG9yJztcbmltcG9ydCBuZXQgZnJvbSAnbmV0JztcbmltcG9ydCB7IGVycm9ycyB9IGZyb20gJ21vYmlsZS1qc29uLXdpcmUtcHJvdG9jb2wnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuXG5jaGFpLnNob3VsZCgpO1xuY2hhaS51c2UoY2hhaUFzUHJvbWlzZWQpO1xuXG5kZXNjcmliZSgnQW5kcm9pZEJvb3RzdHJhcCcsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3Qgc3lzdGVtUG9ydCA9IDQ3MjQ7XG4gIGxldCBhbmRyb2lkQm9vdHN0cmFwID0gbmV3IEFuZHJvaWRCb290c3RyYXAoc3lzdGVtUG9ydCksXG4gICAgICBhZGIgPSBuZXcgQURCKCksXG4gICAgICB1aUF1dG9tYXRvciA9IG5ldyBVaUF1dG9tYXRvcihhZGIpO1xuXG4gIGRlc2NyaWJlKFwic3RhcnRcIiwgd2l0aFNhbmRib3goe21vY2tzOiB7YWRiLCB1aUF1dG9tYXRvciwgbmV0LCBhbmRyb2lkQm9vdHN0cmFwfX0sIChTKSA9PiB7XG4gICAgaXQoXCJzaG91bGQgcmV0dXJuIGEgc3ViUHJvY2Vzc1wiLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY29ubiA9IG5ldyBldmVudHMuRXZlbnRFbWl0dGVyKCk7XG4gICAgICBjb25zdCBhcHBQYWNrYWdlID0gJ2NvbS5leGFtcGxlLmFuZHJvaWQuYXBpcycsXG4gICAgICAgICAgICBkaXNhYmxlQW5kcm9pZFdhdGNoZXJzID0gZmFsc2U7XG4gICAgICBhbmRyb2lkQm9vdHN0cmFwLmFkYiA9IGFkYjtcbiAgICAgIGFuZHJvaWRCb290c3RyYXAudWlBdXRvbWF0b3IgPSB1aUF1dG9tYXRvcjtcbiAgICAgIFMubW9ja3MuYW5kcm9pZEJvb3RzdHJhcC5leHBlY3RzKCdpbml0Jykub25jZSgpXG4gICAgICAgIC5yZXR1cm5zKCcnKTtcbiAgICAgIFMubW9ja3MuYWRiLmV4cGVjdHMoJ2ZvcndhcmRQb3J0Jykub25jZSgpXG4gICAgICAgIC53aXRoRXhhY3RBcmdzKHN5c3RlbVBvcnQsIHN5c3RlbVBvcnQpXG4gICAgICAgIC5yZXR1cm5zKCcnKTtcbiAgICAgIFMubW9ja3MudWlBdXRvbWF0b3IuZXhwZWN0cyhcInN0YXJ0XCIpXG4gICAgICAgIC5vbmNlKClcbiAgICAgICAgLnJldHVybnMoY29ubik7XG4gICAgICBTLm1vY2tzLm5ldC5leHBlY3RzKCdjb25uZWN0Jykub25jZSgpLnJldHVybnMoY29ubik7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29ubi5lbWl0KFwiY29ubmVjdFwiKTtcbiAgICAgIH0sIDEpO1xuICAgICAgYXdhaXQgYW5kcm9pZEJvb3RzdHJhcC5zdGFydChhcHBQYWNrYWdlLCBkaXNhYmxlQW5kcm9pZFdhdGNoZXJzKTtcbiAgICAgIFMudmVyaWZ5KCk7XG4gICAgfSk7XG4gIH0pKTtcbiAgZGVzY3JpYmUoXCJzZW5kQ29tbWFuZFwiLCAoKSA9PiB7XG4gICAgaXQoXCJzaG91bGQgdGltZW91dFwiLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY29ubiA9IG5ldyBldmVudHMuRXZlbnRFbWl0dGVyKCk7XG4gICAgICBjb25uLndyaXRlID0gXy5ub29wO1xuICAgICAgY29ubi5zZXRFbmNvZGluZyA9IF8ubm9vcDtcbiAgICAgIGFuZHJvaWRCb290c3RyYXAuc29ja2V0Q2xpZW50ID0gY29ubjtcbiAgICAgIGF3YWl0IGFuZHJvaWRCb290c3RyYXAuc2VuZENvbW1hbmQoQ09NTUFORF9UWVBFUy5BQ1RJT04sIHthY3Rpb246ICdnZXREYXRhRGlyJ30sIDEwMDApXG4gICAgICAgIC5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoXCJCb290c3RyYXBcIik7XG4gICAgfSk7XG4gICAgaXQoXCJzaG91bGQgc3VjY2Vzc2Z1bGx5IHJldHVybiBhZnRlciByZWNlaXZpbmcgZGF0YSBmcm9tIGJvb3RzdHJhcCBpbiBwYXJ0c1wiLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY29ubiA9IG5ldyBldmVudHMuRXZlbnRFbWl0dGVyKCk7XG4gICAgICBjb25uLndyaXRlID0gXy5ub29wO1xuICAgICAgY29ubi5zZXRFbmNvZGluZyA9IF8ubm9vcDtcbiAgICAgIGFuZHJvaWRCb290c3RyYXAuc29ja2V0Q2xpZW50ID0gY29ubjtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25uLmVtaXQoXCJkYXRhXCIsICd7XCJzdGF0dXNcIjowLCAnKTtcbiAgICAgICAgY29ubi5lbWl0KFwiZGF0YVwiLCAnXCJ2YWx1ZVwiOiBcImhlbGxvXCJ9Jyk7XG4gICAgICB9LCAxKTtcbiAgICAgIChhd2FpdCBhbmRyb2lkQm9vdHN0cmFwLnNlbmRDb21tYW5kKENPTU1BTkRfVFlQRVMuQUNUSU9OLCB7YWN0aW9uOiAnZ2V0RGF0YURpcid9LCAxMDAwKSlcbiAgICAgICAgLnNob3VsZC5lcXVhbChcImhlbGxvXCIpO1xuICAgIH0pO1xuICAgIGl0KFwic2hvdWxkIHN1Y2Nlc3NmdWxseSByZXR1cm4gYWZ0ZXIgcmVjZWl2aW5nIGRhdGEgZnJvbSBib290c3RyYXBcIiwgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGNvbm4gPSBuZXcgZXZlbnRzLkV2ZW50RW1pdHRlcigpO1xuICAgICAgY29ubi53cml0ZSA9IF8ubm9vcDtcbiAgICAgIGNvbm4uc2V0RW5jb2RpbmcgPSBfLm5vb3A7XG4gICAgICBhbmRyb2lkQm9vdHN0cmFwLnNvY2tldENsaWVudCA9IGNvbm47XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29ubi5lbWl0KFwiZGF0YVwiLCAne1wic3RhdHVzXCI6MCwgXCJ2YWx1ZVwiOiBcImhlbGxvXCJ9Jyk7XG4gICAgICB9LCAwKTtcbiAgICAgIChhd2FpdCBhbmRyb2lkQm9vdHN0cmFwLnNlbmRDb21tYW5kKENPTU1BTkRfVFlQRVMuQUNUSU9OLCB7YWN0aW9uOiAnZ2V0RGF0YURpcid9LCAxMDAwKSlcbiAgICAgICAgLnNob3VsZC5lcXVhbChcImhlbGxvXCIpO1xuICAgIH0pO1xuICAgIGl0KFwic2hvdWxkIHRocm93IGNvcnJlY3QgZXJyb3IgaWYgc3RhdHVzIGlzIG5vdCB6ZXJvXCIsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBjb25uID0gbmV3IGV2ZW50cy5FdmVudEVtaXR0ZXIoKTtcbiAgICAgIGNvbm4ud3JpdGUgPSBfLm5vb3A7XG4gICAgICBjb25uLnNldEVuY29kaW5nID0gXy5ub29wO1xuICAgICAgYW5kcm9pZEJvb3RzdHJhcC5zb2NrZXRDbGllbnQgPSBjb25uO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbm4uZW1pdChcImRhdGFcIiwgJ3tcInN0YXR1c1wiOjcsIFwidmFsdWVcIjogXCJub3QgZm91bmRcIn0nKTtcbiAgICAgIH0sIDApO1xuICAgICAgYXdhaXQgYW5kcm9pZEJvb3RzdHJhcC5zZW5kQ29tbWFuZChDT01NQU5EX1RZUEVTLkFDVElPTiwge2FjdGlvbjogJ2dldERhdGFEaXInfSwgMTAwMClcbiAgICAgICAgLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkV2l0aChlcnJvcnMuTm9TdWNoRWxlbWVudEVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKFwic2VuZEFjdGlvblwiLCB3aXRoU2FuZGJveCh7bW9ja3M6IHthbmRyb2lkQm9vdHN0cmFwfX0sIChTKSA9PiB7XG4gICAgaXQoXCJzaG91bGQgY2FsbCBzZW5kQ29tbWFuZFwiLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgZXh0cmEgPSB7YWN0aW9uOiAnd2FrZScsIHBhcmFtczoge319O1xuICAgICAgUy5tb2Nrcy5hbmRyb2lkQm9vdHN0cmFwLmV4cGVjdHMoJ3NlbmRDb21tYW5kJykub25jZSgpXG4gICAgICAgIC53aXRoRXhhY3RBcmdzKCdhY3Rpb24nLCBleHRyYSwgMClcbiAgICAgICAgLnJldHVybnMoJycpO1xuICAgICAgYXdhaXQgYW5kcm9pZEJvb3RzdHJhcC5zZW5kQWN0aW9uKCd3YWtlJyk7XG4gICAgICBTLnZlcmlmeSgpO1xuICAgIH0pO1xuICB9KSk7XG4gIGRlc2NyaWJlKFwic2h1dGRvd25cIiwgd2l0aFNhbmRib3goe21vY2tzOiB7YW5kcm9pZEJvb3RzdHJhcCwgdWlBdXRvbWF0b3J9fSwgKFMpID0+IHtcbiAgICBpdChcInNob3VsZCBjYWxsIHNlbmRDb21tYW5kXCIsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBjb25uID0gbmV3IGV2ZW50cy5FdmVudEVtaXR0ZXIoKTtcbiAgICAgIGFuZHJvaWRCb290c3RyYXAuc29ja2V0Q2xpZW50ID0gY29ubjtcbiAgICAgIFMubW9ja3MuYW5kcm9pZEJvb3RzdHJhcC5leHBlY3RzKCdzZW5kQ29tbWFuZCcpLm9uY2UoKVxuICAgICAgICAud2l0aEV4YWN0QXJncygnc2h1dGRvd24nKVxuICAgICAgICAucmV0dXJucygnJyk7XG4gICAgICBTLm1vY2tzLnVpQXV0b21hdG9yLmV4cGVjdHMoXCJzaHV0ZG93blwiKVxuICAgICAgICAub25jZSgpXG4gICAgICAgIC5yZXR1cm5zKFwiXCIpO1xuICAgICAgYXdhaXQgYW5kcm9pZEJvb3RzdHJhcC5zaHV0ZG93bigpO1xuICAgICAgUy52ZXJpZnkoKTtcbiAgICB9KTtcbiAgfSkpO1xufSk7XG4iXX0=
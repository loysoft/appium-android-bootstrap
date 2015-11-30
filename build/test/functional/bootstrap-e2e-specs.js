// transpile :mocha

'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ = require('../..');

var _appiumAdb = require('appium-adb');

var _appiumAdb2 = _interopRequireDefault(_appiumAdb);

var _mobileJsonWireProtocol = require('mobile-json-wire-protocol');

_chai2['default'].should();
_chai2['default'].use(_chaiAsPromised2['default']);

describe('Android Bootstrap', function () {
  var _this = this;

  this.timeout(60000);
  var adb = undefined,
      androidBootstrap = undefined;
  var rootDir = _path2['default'].resolve(__dirname, process.env.NO_PRECOMPILE ? '../..' : '../../..');
  var apiDemos = _path2['default'].resolve(rootDir, 'test', 'fixtures', 'ApiDemos-debug.apk');
  var systemPort = 4724;
  before(function callee$1$0() {
    var packageName, activityName;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(_appiumAdb2['default'].createADB());

        case 2:
          adb = context$2$0.sent;
          packageName = 'com.example.android.apis', activityName = '.ApiDemos';
          context$2$0.next = 6;
          return _regeneratorRuntime.awrap(adb.install(apiDemos));

        case 6:
          context$2$0.next = 8;
          return _regeneratorRuntime.awrap(adb.startApp({ pkg: packageName,
            activity: activityName }));

        case 8:
          androidBootstrap = new _.AndroidBootstrap(systemPort);
          context$2$0.next = 11;
          return _regeneratorRuntime.awrap(androidBootstrap.start('com.example.android.apis', false));

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });
  after(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(androidBootstrap.shutdown());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it("sendAction should work", function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(androidBootstrap.sendAction('wake'));

        case 2:
          context$2$0.sent.should.equal(true);

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it("sendCommand should work", function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(androidBootstrap.sendCommand(_.COMMAND_TYPES.ACTION, { action: 'getDataDir' }));

        case 2:
          context$2$0.sent.should.equal("/data");

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it("sendCommand should correctly throw error", function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(androidBootstrap.sendCommand(_.COMMAND_TYPES.ACTION, { action: 'unknown' }).should.eventually.be.rejectedWith(_mobileJsonWireProtocol.errors.UnknownCommandError));

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it("should cancel onUnexpectedShutdown promise on unexpected uiAutomator shutdown", function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(androidBootstrap.sendCommand(_.COMMAND_TYPES.SHUTDOWN));

        case 2:
          context$2$0.next = 4;
          return _regeneratorRuntime.awrap(androidBootstrap.onUnexpectedShutdown.should.eventually.be.rejectedWith("Error: UiAUtomator shut down unexpectedly"));

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZnVuY3Rpb25hbC9ib290c3RyYXAtZTJlLXNwZWNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVpQixNQUFNOzs7OzhCQUNJLGtCQUFrQjs7OztvQkFDNUIsTUFBTTs7OztnQkFDeUIsT0FBTzs7eUJBQ3ZDLFlBQVk7Ozs7c0NBQ0wsMkJBQTJCOztBQUdsRCxrQkFBSyxNQUFNLEVBQUUsQ0FBQztBQUNkLGtCQUFLLEdBQUcsNkJBQWdCLENBQUM7O0FBRXpCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxZQUFZOzs7QUFDeEMsTUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwQixNQUFJLEdBQUcsWUFBQTtNQUFFLGdCQUFnQixZQUFBLENBQUM7QUFDMUIsTUFBSSxPQUFPLEdBQUcsa0JBQUssT0FBTyxDQUFDLFNBQVMsRUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUM7QUFDN0UsTUFBTSxRQUFRLEdBQUcsa0JBQUssT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDakYsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFFBQU0sQ0FBQztRQUVDLFdBQVcsRUFDWCxZQUFZOzs7OzsyQ0FGTix1QkFBSSxTQUFTLEVBQUU7OztBQUEzQixhQUFHO0FBQ0cscUJBQVcsR0FBRywwQkFBMEIsRUFDeEMsWUFBWSxHQUFHLFdBQVc7OzJDQUMxQixHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7OzsyQ0FDckIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFDLEdBQUcsRUFBRSxXQUFXO0FBQ2hCLG9CQUFRLEVBQUUsWUFBWSxFQUFDLENBQUM7OztBQUM1QywwQkFBZ0IsR0FBRyx1QkFBcUIsVUFBVSxDQUFDLENBQUM7OzJDQUM5QyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxDQUFDOzs7Ozs7O0dBQ2hFLENBQUMsQ0FBQztBQUNILE9BQUssQ0FBQzs7Ozs7MkNBQ0UsZ0JBQWdCLENBQUMsUUFBUSxFQUFFOzs7Ozs7O0dBQ2xDLENBQUMsQ0FBQztBQUNILElBQUUsQ0FBQyx3QkFBd0IsRUFBRTs7Ozs7MkNBQ3BCLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7OzsyQkFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUk7Ozs7Ozs7R0FDOUQsQ0FBQyxDQUFDO0FBQ0gsSUFBRSxDQUFDLHlCQUF5QixFQUFFOzs7OzsyQ0FDdEIsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLGdCQUFjLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQzs7OzJCQUFFLE1BQU0sQ0FDdEYsS0FBSyxDQUFDLE9BQU87Ozs7Ozs7R0FDaEIsQ0FBQyxDQUFDO0FBQ0gsSUFBRSxDQUFDLDBDQUEwQyxFQUFFOzs7OzsyQ0FDeEMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLGdCQUFjLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FDakYsVUFBVSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsK0JBQU8sbUJBQW1CLENBQUM7Ozs7Ozs7R0FDekQsQ0FBQyxDQUFDO0FBQ0gsSUFBRSxDQUFDLCtFQUErRSxFQUFFOzs7OzsyQ0FDNUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLGdCQUFjLFFBQVEsQ0FBQzs7OzsyQ0FDcEQsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FDMUQsRUFBRSxDQUFDLFlBQVksQ0FBQywyQ0FBMkMsQ0FBQzs7Ozs7OztHQUNoRSxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoidGVzdC9mdW5jdGlvbmFsL2Jvb3RzdHJhcC1lMmUtc3BlY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0cmFuc3BpbGUgOm1vY2hhXG5cbmltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xuaW1wb3J0IGNoYWlBc1Byb21pc2VkIGZyb20gJ2NoYWktYXMtcHJvbWlzZWQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBbmRyb2lkQm9vdHN0cmFwLCBDT01NQU5EX1RZUEVTIH0gZnJvbSAnLi4vLi4nO1xuaW1wb3J0IEFEQiBmcm9tICdhcHBpdW0tYWRiJztcbmltcG9ydCB7IGVycm9ycyB9IGZyb20gJ21vYmlsZS1qc29uLXdpcmUtcHJvdG9jb2wnO1xuXG5cbmNoYWkuc2hvdWxkKCk7XG5jaGFpLnVzZShjaGFpQXNQcm9taXNlZCk7XG5cbmRlc2NyaWJlKCdBbmRyb2lkIEJvb3RzdHJhcCcsIGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50aW1lb3V0KDYwMDAwKTtcbiAgbGV0IGFkYiwgYW5kcm9pZEJvb3RzdHJhcDtcbiAgbGV0IHJvb3REaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT19QUkVDT01QSUxFID8gJy4uLy4uJyA6ICcuLi8uLi8uLicpO1xuICBjb25zdCBhcGlEZW1vcyA9IHBhdGgucmVzb2x2ZShyb290RGlyLCAndGVzdCcsICdmaXh0dXJlcycsICdBcGlEZW1vcy1kZWJ1Zy5hcGsnKTtcbiAgY29uc3Qgc3lzdGVtUG9ydCA9IDQ3MjQ7XG4gIGJlZm9yZShhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgYWRiID0gYXdhaXQgQURCLmNyZWF0ZUFEQigpO1xuICAgIGNvbnN0IHBhY2thZ2VOYW1lID0gJ2NvbS5leGFtcGxlLmFuZHJvaWQuYXBpcycsXG4gICAgICAgICAgYWN0aXZpdHlOYW1lID0gJy5BcGlEZW1vcyc7XG4gICAgYXdhaXQgYWRiLmluc3RhbGwoYXBpRGVtb3MpO1xuICAgIGF3YWl0IGFkYi5zdGFydEFwcCh7cGtnOiBwYWNrYWdlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2aXR5OiBhY3Rpdml0eU5hbWV9KTtcbiAgICBhbmRyb2lkQm9vdHN0cmFwID0gbmV3IEFuZHJvaWRCb290c3RyYXAoc3lzdGVtUG9ydCk7XG4gICAgYXdhaXQgYW5kcm9pZEJvb3RzdHJhcC5zdGFydCgnY29tLmV4YW1wbGUuYW5kcm9pZC5hcGlzJywgZmFsc2UpO1xuICB9KTtcbiAgYWZ0ZXIoYXN5bmMgKCk9PiB7XG4gICAgYXdhaXQgYW5kcm9pZEJvb3RzdHJhcC5zaHV0ZG93bigpO1xuICB9KTtcbiAgaXQoXCJzZW5kQWN0aW9uIHNob3VsZCB3b3JrXCIsIGFzeW5jICgpID0+IHtcbiAgICAoYXdhaXQgYW5kcm9pZEJvb3RzdHJhcC5zZW5kQWN0aW9uKCd3YWtlJykpLnNob3VsZC5lcXVhbCh0cnVlKTtcbiAgfSk7XG4gIGl0KFwic2VuZENvbW1hbmQgc2hvdWxkIHdvcmtcIiwgYXN5bmMgKCkgPT4ge1xuICAgKGF3YWl0IGFuZHJvaWRCb290c3RyYXAuc2VuZENvbW1hbmQoQ09NTUFORF9UWVBFUy5BQ1RJT04sIHthY3Rpb246ICdnZXREYXRhRGlyJ30pKS5zaG91bGRcbiAgICAgLmVxdWFsKFwiL2RhdGFcIik7XG4gIH0pO1xuICBpdChcInNlbmRDb21tYW5kIHNob3VsZCBjb3JyZWN0bHkgdGhyb3cgZXJyb3JcIiwgYXN5bmMgKCkgPT4ge1xuICAgYXdhaXQgYW5kcm9pZEJvb3RzdHJhcC5zZW5kQ29tbWFuZChDT01NQU5EX1RZUEVTLkFDVElPTiwge2FjdGlvbjogJ3Vua25vd24nfSkuc2hvdWxkXG4gICAgIC5ldmVudHVhbGx5LmJlLnJlamVjdGVkV2l0aChlcnJvcnMuVW5rbm93bkNvbW1hbmRFcnJvcik7XG4gIH0pO1xuICBpdChcInNob3VsZCBjYW5jZWwgb25VbmV4cGVjdGVkU2h1dGRvd24gcHJvbWlzZSBvbiB1bmV4cGVjdGVkIHVpQXV0b21hdG9yIHNodXRkb3duXCIsIGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBhbmRyb2lkQm9vdHN0cmFwLnNlbmRDb21tYW5kKENPTU1BTkRfVFlQRVMuU0hVVERPV04pO1xuICAgIGF3YWl0IGFuZHJvaWRCb290c3RyYXAub25VbmV4cGVjdGVkU2h1dGRvd24uc2hvdWxkLmV2ZW50dWFsbHlcbiAgICAgIC5iZS5yZWplY3RlZFdpdGgoXCJFcnJvcjogVWlBVXRvbWF0b3Igc2h1dCBkb3duIHVuZXhwZWN0ZWRseVwiKTtcbiAgfSk7XG59KTtcbiJdfQ==
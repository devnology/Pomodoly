(function (Ti, pomodoly) {
	"use strict";

	pomodoly.Timer = function Timer(minutes) {
		var self = this
			, timerId
			, onstartCallback
			, onerrorCallback
			, onfinishCallback;

		this.start = function () {
			if (timerId) {
				return onerrorCallback && onerrorCallback(new Error("Timer already started!"));
			}

			timerId = setTimeout(function () {
				self.isStarted = false;
				timerId = undefined;
				onfinishCallback && onfinishCallback();
			}, minutes * 60 * 1000);

			self.isStarted = true;

			onstartCallback && onstartCallback();
		};
		this.stop = function () {
			if (!self.isStarted) { return; }
			self.isStarted = false;
			timerId = clearTimeout(timerId);
			onfinishCallback && onfinishCallback();
		};

		this.isStarted = false;

		this.onstart = function (callback) {
			onstartCallback = callback;
		};
		this.onerror = function (callback) {
			onerrorCallback = callback;
		};
		this.onfinish = function (callback) {
			onfinishCallback = callback;
		};

	};

}(window.Titanium, window.pomodoly = window.pomodoly || {}));

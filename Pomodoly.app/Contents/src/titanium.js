/*global window*/

window.Ti = window.Titanium = (function (window, titanium) {

	if (!titanium) {
		titanium = { isBrowser: true };

		titanium.addEventListener = function (name, callback) {
			if (name === "focused") {
				window.onfocus = callback;
			} else if (name === "unfocused") {
				window.onblur = callback;
			} else {
				throw new Error("Uknown event listener " + name);
			}
		};

		titanium.notify = function (title, message) {
			console.log(title, message);
		};

		titanium.UI = {};

		titanium.UI.createMenu = function () {
			return { appendItem: function () {
			} };
		};
		titanium.UI.createMenuItem = function () {

		};
		titanium.UI.addTray = function () {
			return { setMenu: function () {
			} };
		};
		titanium.UI.openFileChooserDialog = function () {
			
		};
	}

	titanium.isBrowser |= false;

	if (!titanium.isBrowser) {

		titanium.notify = function (title, message) {
			var notification = titanium.Notification.createNotification();
			notification.setTitle(title);
			notification.setMessage(message);
			notification.show();
		};

		(window.console = window.console || {}).log = function () {
			titanium.notify("Console", JSON.stringify(Array.prototype.slice.call(arguments)));
		};

	}

	return titanium;

}(window, window.Titanium));

/*global window*/

window.Ti = window.Titanium = (function (window, titanium) {
	"use strict";

	if (!titanium) {
		titanium = { isBrowser: true };
	} else {
		titanium.isBrowser |= false;
	}

	if (titanium.isBrowser) {
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
	} else {
		titanium.notify = function (title, message) {
			var notification = titanium.Notification.createNotification();
			notification.setTitle(title);
			notification.setMessage(message);
			notification.show();
		};

		(window.console = window.console || {}).log = function () {
			titanium.notify(titanium.App.getName(), Array.prototype.slice.call(arguments).join(" "));
		};
	}

	(function TitaniumFilesystem(filesystem) {
		if (titanium.isBrowser) {
			filesystem.getDataUrl = function (file) {
				return (window.URL || window.webkitURL).createObjectURL(file);
			};
		} else {
			titanium.Filesystem.getDataUrl = function (file) {
				var fileStream = titanium.Filesystem.getFileStream(file);
				fileStream.open();
				return "data:;base64," + titanium.Codec.encodeBase64(fileStream.read());
			};
		}
	}(titanium.Filesystem = titanium.Filesystem || {}));

	(function TitaniumLocalStorage(localStorage, window) {

		localStorage.keys = function () {
			var keys = [];
			for (var i = 0; i < window.localStorage.length; i += 1) {
				keys.push(window.localStorage.key(i));
			}
			return keys;
		};
		
		localStorage.getItem = function (names) {
			var name, item;
			
			for (var i = 0; i < arguments.length; i += 1) {
				name = arguments[i];
				item = JSON.parse(i === 0 ? window.localStorage.getItem(name) || null : item[name] || null);
			}
			
			return item;
		};
		
		localStorage.setItem = function (names, value) {
			var name, item;
			
			for (var i = 0; i < arguments.length; i += 1) {
				name = arguments[i];
				i < arguments.length				
				item = JSON.parse(i === 0 ? window.localStorage.getItem(name) || null : item[name] || null);
			}
			
			return item;
		};

	}(titanium.localStorage = titanium.localStorage || {}, window));

	(function TitaniumUI(ui) {
		if (titanium.isBrowser) {
			ui.createMenu = function () {
				return { appendItem: function () {
				} };
			};
			ui.createMenuItem = function () {

			};
			ui.addTray = function () {
				return { setMenu: function () {
				} };
			};
			ui.currentWindow = {};
			ui.currentWindow.getX = function () {
				return 200;
			};
			ui.currentWindow.setX = function () {
			};
			ui.currentWindow.getY = function () {
				return 200;
			};
			ui.currentWindow.setY = function () {
			};
			ui.openFileChooserDialog = (function () {

				var listener
					, input$ = $("<input type='file' name='dragupload[]' multiple='multiple'/>")
					.appendTo(window.document.body)
					.change(function (e) {
						return listener(Array.prototype.slice.call(e.target.files));
					});
				return function (callback, options) {
					listener = callback;
					setTimeout(function () {
						input$.click();
					}, 0);
				};
			}());
		}
		ui.popup = function () {
			$("#dialog").toggleClass("show");
		};
	}(titanium.UI = titanium.UI || {}));

	(function detectFocusAndUnfocus() {

		titanium.addEventListener('focused', function () {
			window.document.documentElement.setAttribute("class", "active");
		});

		titanium.addEventListener('unfocused', function () {
			window.document.documentElement.setAttribute("class", "inactive");
		});

	}());

	(function addDragAndDropFunctionality() {
		var dndTargets = []
			, enableDragAndDrop;

		enableDragAndDrop = function () {
			enableDragAndDrop = function () {
			};

			if (window.location.origin === "file://") {
				throw new Error("Drag and Drop is not supported from file://");
			}

			window.document.body.ondragenter = document.body.ondragover = function (e) {
				e.stopPropagation();
				e.preventDefault();
				dndTargets.forEach(function (target) {
					if (e.target !== target.element) {
						e.dataTransfer.dropEffect = 'none';
					} else {
						e.dataTransfer.dropEffect = 'copy';
					}
				});
				e.preventDefault();
				return false;
			};
			window.document.body.ondrop = function (e) {
				e.stopPropagation();
				e.preventDefault();

				dndTargets.forEach(function (target) {
					if (e.target !== target.element) { return; }

					try {
						var files = []
							, imageType = /image.*/;
						Array.prototype.slice.call(e.dataTransfer.files).forEach(function (file) {

							if (!file.type.match(imageType)) {
								return;
							}

							if (!titanium.isBrowser) {
								var f = titanium.Filesystem.getFile(file.path);
								file.url = "data:;base64," + titanium.Codec.encodeBase64(f.read());
							}

							if (window.URL || window.webkitURL) {
								file.url = (window.URL || window.webkitURL).createObjectURL(file);
							}

							files.push(file);
						});

						target.callback(null, files);

					} catch (err) {
						target.callback(err);
					}

				});

				return false;
			};
		};

		titanium.UI.dragAndDrop = function (element, type, callback) {
			try {
				dndTargets.push({ element: element, type: type, callback: callback });
				enableDragAndDrop();
			} catch (err) {
				callback(err);
			}
		};

	}());

	(function enableMovingOfWindow() {
		var dragging = false, xstart, ystart, xoffset, yoffset, timeout;

		document.onmousemove = function () {
			if (!dragging || timeout) return;

			timeout = setTimeout(function () {
				timeout = null;
			}, 20);

			Titanium.UI.currentWindow.setX(xstart + (event.screenX - xoffset));
			Titanium.UI.currentWindow.setY(ystart + (event.screenY - yoffset));
		};

		$(document.body).delegate(".dragwindow", "mousedown", function () {
			dragging = true;
			xstart = Titanium.UI.currentWindow.getX();
			ystart = Titanium.UI.currentWindow.getY();
			xoffset = event.screenX;
			yoffset = event.screenY;
		});

		$(document.body).mouseup(function () {
			dragging = false;
		});
	}());

	return titanium;

}(window, window.Titanium));

//var win = Titanium.UI.createWindow({
//	id: "propertyWindow",
//	title: "My New Window",
//	contents: "<html>foo!</html>",
//	baseURL: "app://page_url",
//	x: 300,
//	y: 400,
//	width: 500,
//	minWidth: 200,
//	maxWidth: 900,
//	height: 500,
//	minHeight: 200,
//	maxHeight: 900,
//	maximizable: true,
//	minimizable: true,
//	closeable: true,
//	resizable: true,
//	fullscreen: false,
//	maximized: false,
//	minimized: false,
//	usingChrome: false,
//	topMost: false,
//	visible: true,
//	transparentBackground: false,
//	transparency: true
//}).open();
//console.log("win", win);

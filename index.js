document.onreadystatechange = function(){
	if(document.readyState != "complete") return;

	if(!["https:", "file:"].includes(location.protocol)) location.protocol = "https:";

	const originalConsoleLog = console.log;
	const originalConsoleInfo = console.info;
	const originalConsoleDebug = console.debug;
	const originalConsoleWarn = console.warn;
	const originalConsoleError = console.error;

	const logElement = document.querySelector("#log");

	console.log = function(...args){
		originalConsoleLog.apply(console, args);
		logElement.innerHTML += `<p><span>${new Date().toTimeString().split(' ')[0]}</span> <span style="color:white;">${args.join(' ')}</p>`;
		logElement.scrollTop = logElement.scrollHeight;
	};

	console.info = function(...args){
		originalConsoleInfo.apply(console, args);
		logElement.innerHTML += `<p><span>${new Date().toTimeString().split(' ')[0]}</span> <span style="color:blue;">${args.join(' ')}</p>`;
		logElement.scrollTop = logElement.scrollHeight;
	};

	console.debug = function(...args){
		originalConsoleDebug.apply(console, args);
		logElement.innerHTML += `<p><span>${new Date().toTimeString().split(' ')[0]}</span> <span style="color:gray;">${args.join(' ')}</p>`;
		logElement.scrollTop = logElement.scrollHeight;
	};

	console.warn = function(...args){
		originalConsoleWarn.apply(console, args);
		logElement.innerHTML += `<p><span>${new Date().toTimeString().split(' ')[0]}</span> <span style="color:orange;">${args.join(' ')}</p>`;
		logElement.scrollTop = logElement.scrollHeight;
	};

	console.error = function(...args){
		originalConsoleError.apply(console, args);
		logElement.innerHTML += `<p><span>${new Date().toTimeString().split(' ')[0]}</span> <span style="color:red;">${args.join(' ')}</p>`;
		logElement.scrollTop = logElement.scrollHeight;
	};

	function requestPermission(){
		try {
			Notification.requestPermission().then(permission => {
				console.log("Notification permission: ", permission);
			});
		} catch(e){
			try {
				Notification.requestPermission(function(permission){
					console.log("Notification permission: ", permission);
				});
			} catch(e){
				console.error("Notification not supported.");
			}
		}
	}

	var support;

	if(navigator.serviceWorker && ServiceWorkerRegistration.prototype.showNotification){
		requestPermission();
		navigator.serviceWorker.register("sw.js").then(function(registration){
			console.log("ServiceWorker registration successful with scope: ", registration.scope);
		}, function(err){
			console.error("ServiceWorker registration failed: ", err);
		});
		support = true;
	} else {
		console.error("Service workers not supported.");
		support = false;
	}

	document.querySelector("input[name=permission]").addEventListener("click", function(){
		requestPermission();
	});

	document.querySelector("form[name=notify]").addEventListener("submit", function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		if(!support){
			console.error("Service workers not supported.");
			return false;
		}

		let title = this.title.value.trim();
		let options = {};
		
		let badge = this.badge.value.trim(); if(badge) options.badge = badge;

		let actions = []; let action_1 = {}; let action_2 = {};
		let action_action_1 = this.action_action_1.value.trim(); if(action_action_1) action_1.action = action_action_1;
		let action_title_1 = this.action_title_1.value.trim(); if(action_title_1) action_1.title = action_title_1;
		let action_icon_1 = this.action_icon_1.value.trim(); if(action_icon_1) action_1.icon = action_icon_1;
		if(Object.keys(action_1).length) actions.push(action_1);
		let action_action_2 = this.action_action_2.value.trim(); if(action_action_2) action_2.action = action_action_2;
		let action_title_2 = this.action_title_2.value.trim(); if(action_title_2) action_2.title = action_title_2;
		let action_icon_2 = this.action_icon_2.value.trim(); if(action_icon_2) action_2.icon = action_icon_2;
		if(Object.keys(action_2).length) actions.push(action_2);
		if(actions.length) options.actions = actions;

		let body = this.body.value.trim(); if(body) options.body = body;
		let dir = this.dir.value.trim(); if(dir) options.dir = dir;
		let icon = this.icon.value.trim(); if(icon) options.icon = icon;
		let image = this.image.value.trim(); if(image) options.image = image;
		let lang = this.lang.value.trim(); if(lang) options.lang = lang;
		let renotify = this.renotify.value.trim(); if(renotify) options.renotify = ['true', 'false'].includes(renotify) ? eval(renotify) : renotify;
		let requireInteraction = this.requireInteraction.value.trim(); if(requireInteraction) options.requireInteraction = ['true', 'false'].includes(requireInteraction) ? eval(requireInteraction) : requireInteraction;
		let silent = this.silent.value.trim(); if(silent) options.silent = ['true', 'false'].includes(silent) ? eval(silent) : silent;
		let tag = this.tag.value.trim(); if(tag) options.tag = tag;
		let timestamp = this.timestamp.value.trim(); if(timestamp) options.timestamp = timestamp;
		let vibrate = this.vibrate.value.trim(); if(vibrate) options.vibrate = vibrate.split(',');

		navigator.serviceWorker.ready.then(function(registration){
			console.log("Sending notification...");
			registration.showNotification(title, options).then(function(){
				console.log("Notification sent.");
			}).catch(function(e) {
				console.error("Error:", e);
			});
		}).catch(function(error) {
			console.error("Error:", e);
		});
	});
}
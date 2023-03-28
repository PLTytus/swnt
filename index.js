
document.onreadystatechange = function(){
	if(document.readyState != "complete") return;

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
				onsole.log("Notification not supported.");
			}
		}
	}

	var support;

	if("serviceWorker" in navigator){
		requestPermission();
		navigator.serviceWorker.register("sw.js").then(function(registration){
			console.log("ServiceWorker registration successful with scope: ", registration.scope);
		}, function(err){
			console.log("ServiceWorker registration failed: ", err);
		});
		support = true;
	} else {
		console.log("Service workers not supported.");
		support = false;
	}

	document.querySelector("input[name=permission]").addEventListener("click", function(){
		requestPermission();
	});

	document.querySelector("form[name=notify").addEventListener("submit", function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		if(!support){
			console.log("Service workers not supported.");
			return false;
		}

		let title = this.title.value.trim();
		let options = {};
		
		let badge = this.badge.value.trim(); if(badge) options.badge = badge;
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
			registration.showNotification(title, options);
		});
	});
}
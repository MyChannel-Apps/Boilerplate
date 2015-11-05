/**
	The MIT License (MIT)

	Copyright (c) 2014 MyChannel-Apps.de

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

require('classes/KFramework.min.js');
require('classes/Exception.js');

var Globals	= this;

/**
 * Der AppContainer, so wie dieser in jeder User-App ist.
 *
 * @author Adrian Preuß, Bizarrus
 * @class App
 * @since 0.0.1
 * @static
*/
var App		= (new function AppContainer() {
	var _instance		= this;
	var _instances		= {};
	var _commands		= [
		'system/Execute',
		'system/Restart',
		'system/Newsletter',
		'system/Broadcast',
		'system/AppBot'
	];
	
	/**
	 * Liefert den AppName aus der `app.config`
	 *
	 * @method getName
	 * @return {String}
	*/
	this.getName = function getName() {
		return KnuddelsServer.getAppInfo().getAppName();
	};
	
	/**
	 * Liefert eine Instanz
	 *
	 * @method get
	 * @param {String} name Klassenname
	 * @return {Instance}
	*/
	this.get = function get(name) {
		try {
			return _instances[name];
		} catch(e) {
			/* Do Nothing */
		}
	};
	
	/**
	 * Führt JavaScript-Code in einem speziellen Context aus
	 *
	 * @method exec
	 * @param {String} js JavaScript-Code
	 * @param {Object} context Der Context
	 * @return {Object}
	 * @private
	*/
	this.exec = function exec(js, context) {
		return function EvalContext() {
			return eval(js);
		}.call(context);
	};

	/**
	 * Erstellt eine Instanz anhand des Namens und bindet diese an der App
	 *
	 * @method createInstance
	 * @param {String} name Klassenname
	 * @private
	*/
	this.createInstance = function createInstance(name) {
		if(name.contains('/')) {
			var split = name.split('/');

			App.exec('_instances[\'' + name + '\'] = new ' + split[split.size() - 1] + '();');
			App.exec(split[split.size() - 1] + ' = _instances[\'' + name + '\'];', App);
		} else {
			App.exec('_instances[\'' + name + '\'] = new ' + name + '();');
			App.exec(name + ' = _instances[\'' + name + '\'];', Globals);
		}
	};

	/**
	 * Diese Methode wird aufgerufen, wenn die App gestartet wird
	 *
	 * @method onAppStart
	*/
	this.onAppStart = function onAppStart() {
		KFramework.startUp();
		
		_commands.each(function CommandsEach(name) {
			require('commands/' + name + '.js');
			App.createInstance(name);
		});
		
		_instances.each(function(class, name) {
			if(typeof(class.onStart) != 'undefined') {
				class.onStart();
			}
		});
		
		setTimeout(function StartTimeout() {
			KnuddelsServer.getChannel().getOnlineUsers(UserType.Human).each(function UsersEach(user, index) {
				App.onUserJoined(user);
			});
		}, 2500);
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn ein Nutzer den Channel betritt
	 *
	 * @method onUserJoined
	 * @param {User} user Das Benutzer-Objekt
	*/
	this.onUserJoined = function onUserJoined(user) {
		_instances.each(function(class, name) {
			if(typeof(class.onJoin) != 'undefined') {
				class.onJoin(user);
			}
		});
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn ein Nutzer den Channel verlässt
	 *
	 * @method onUserLeft
	 * @param {User} user Das Benutzer-Objekt
	*/
	this.onUserLeft = function onUserLeft(user) {
		_instances.each(function(class, name) {
			if(typeof(class.onLeave) != 'undefined') {
				class.onLeave(user);
			}
		});
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn ein Nutzer den AppBot privat anschreibt
	 *
	 * @method onPrivateMessage
	 * @param {PrivateMessage} message Das Nachrichten-Objekt
	*/
	this.onPrivateMessage = function onPrivateMessage(message) {
		_instances.each(function(class, name) {
			if(typeof(class.onMessage) != 'undefined') {
				class.onMessage(message, true);
			}
		});
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn ein Nutzer würfelt
	 *
	 * @method onUserDiced
	 * @param {DiceEvent} event Das Würfel-Objekt
	*/
	this.onUserDiced = function onUserDiced(event) {
		_instances.each(function(class, name) {
			if(typeof(class.onDice) != 'undefined') {
				class.onDice(event);
			}
		});
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn die App Beendet wurde
	 *
	 * @method onShutdown
	*/
	this.onShutdown = function onShutdown() {
		_instances.each(function(class, name) {
			if(typeof(class.onStop) != 'undefined') {
				class.onStop();
			}
		});
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn die App Beendet wird
	 *
	 * @method onPrepareShutdown
	 * @param {Number} seconds Sekunden bis die App gestoppt wird
	 * @param {Property} reason Der Grund, warum die App heruntergefahren wird
	*/
	this.onPrepareShutdown = function onPrepareShutdown(seconds, reason) {
		_instances.each(function(class, name) {
			if(typeof(class.onShutdown) != 'undefined') {
				class.onShutdown(seconds, reason);
			}
		});
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn ein Nutzer öffentlich schreibt. Diese Methode kann genutzt werden um Nachrichten zu unterbinden.
	 *
	 * @method mayShowPublicMessage
	 * @param {Message} message Das Nachrichten-Objekt
	*/
	this.mayShowPublicMessage = function mayShowPublicMessage(message) {
		var show = true;
		
		_instances.each(function(class, name) {
			if(typeof(class.showMessage) != 'undefined') {
				if(!class.showMessage(message)) {
					show = false;
					return false;
				}
			}
		});
		
		if(!show) {
			return false;
		}
		
		return message;
	};
	
	/**
	 * Alle registrierten Chatbefehle der App
	 *
	 * @property chatCommands
	 * @type Object
	*/
	this.chatCommands = {
		Bot: function(user, params) {
			App.get('system/AppBot').handle(user, params);
		},
		System: function System(user, params) {
			if(!user.isAppManager() && !user.isChannelModerator()) {
				user.private('Dir fehlen die notwendigen Rechte um diese Aktion auszuführen!');
				return;
			}

			var action	= params;
			var tokens	= [];

			if(action.contains(':')) {
				tokens		= action.split(':');
				var index	= 0;
				action		= tokens[index++];
				params		= '';

				while(index < tokens.length) {
					params += tokens[index++];

					if(index + 1 <= tokens.length) {
						params += ':';
					}
				}
			} else {
				params = '';
			}

			switch(action.toLowerCase()) {
				case 'eval':
					App.get('system/Execute').exec(user, params);
				break;
				case 'restart':
					var all_instances = true;
					
					if(params.substr(0, 1) == '*') {
						all_instances	= false;
						params			= params.substr(1);
					}
					
					App.get('system/Restart').handle(user, params, false, all_instances);
				break;
				case '+restart':
					var all_instances = true;
					
					if(params.substr(0, 1) == '*') {
						all_instances	= false;
						params			= params.substr(1);
					}
					
					App.get('system/Restart').handle(user, params, true, all_instances);
				break;
				case 'invite':
					App.get('system/Newsletter').invite(user, params);
				break;
				case 'newsletter':
					App.get('system/Newsletter').newsletter(user, params);
				break;
				case 'users':
					App.get('system/Newsletter').users(user, params);
				break;
				case 'broadcast':
					App.get('system/Broadcast').send(user, params);
				break;
				case 'payout':
					App.get('system/AppBot').payout(user, params);
				break;
				default:
					user.private('Die Funktion /system ' + action.escapeKCode() + ' gibt\'s hier leider nicht.');
				break;
			}
		}
	};
	
	/**
		@method toJSON
		@return Object
		@private
	*/
	this.toJSON = function toJSON() {
		return {};
	};
	
	/**
		@method toString
		@return String
		@private
	*/
	this.toString = function() {
		return 'AppContainer';
	};
});
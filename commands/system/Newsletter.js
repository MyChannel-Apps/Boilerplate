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

/**
 * Repräsentiert Methoden um Nutzer in den Channel einzuladen.
 *
 * Weitere Informationen und Befehle können aus den einzelnen Methoden entnommen werden.
 *
 * @author Adrian Preuß, Bizarrus
 * @class Newsletter
 * @since 0.0.1
*/
function Newsletter() {
	/**
	 * Lädt Nutzer per `/p` ein
	 * 
	 * **Befehl:** `/system invite[Message]`
	 *
	 * @method invite
	 * @since 0.0.1
	 * @param {User} user
	 * @param {String} message
	*/
	this.invite = function invite(user, params) {
		var count	= 0;
		params		= params.replace(/#/g, '°#°');
		
		KnuddelsServer.getUserAccess().eachAccessibleUser(function(user) {
			if(user.isChannelModerator() || user.isChannelOwner() || user.isOnlineInChannel()) {
				return;
			}
			
			user.private(params);
			++count;
		}, {
			onEnd: function() {
				user.private('Der Newsletter wurde an _' + count + ' Nutzer_ versandt.');
			}
		});	
	};
	
	/**
	 * Zeigt an, wie viele Nutzer bereits den Channel besucht haben.
	 * 
	 * **Befehl:** `/system users`
	 *
	 * @method users
	 * @since 0.0.1
	 * @param {User} user
	*/
	this.users = function users(user) {
		var count = 0;
		
		KnuddelsServer.getUserAccess().eachAccessibleUser(function(user) {
			++count;
		}, {
			onEnd: function() {
				user.private('Es haben bisher _' + count + ' Nutzer_ den Channel besucht.');
			}
		});
	};
	
	/**
	 * Versendet einen Newsletter per `/m` an alle Nutzer.
	 *
	 * **Befehl:** `/system newsletter:(*)[Message]`
	 * 
	 * **Info:** Wird ein `*` Am Anfang von `[Message]` gesetzt, wird der Newsletter nur am auszuführenden Nutzer zu Testzwecken versandt.
	 *
	 * @method newsletter
	 * @since 0.0.1
	 * @param {User} user
	 * @param {String} message
	*/
	this.newsletter = function newsletter(user, params) {
		var send	= 0;
		var subject	= 'Newsletter';
		params		= params.replace(/#/g, '°#°');
		
		if(params.indexOf('§') > -1) {
			var split	= params.split('§');
			subject		= split[0];
			params		= split[1];
		}
		
		if(params.substr(0, 1) == '*') {
			user.post('°BB°' + KnuddelsServer.getAppName() + '°r°: ' + subject, params.substr(1));
			++send;
			user.private('Newsletter an _' + send + ' Nutzer_ versand!');
		} else {
			var users		= [];
			var started		= new Date();
			var sended_stat = 0;
			
			KnuddelsServer.getUserAccess().eachAccessibleUser(function(user) {
				users.push(user);
				++send;
			}, {
				onEnd: function() {
					user.private('Newsletter wird so schnell wie möglich an _' + send + ' Nutzer_ versand!');
					
					var watcher = setInterval(function() {
						var u = users.shift();
						
						if(users.size() == 0 || typeof(u) == 'undefined') {
							user.private('Newsletter-Versandt beendet. _' + sended_stat + ' / ' + send + ' Nutzer_, Zeit: ' + new Date(new Date() - started).toString());
							clearInterval(watcher);
							return;
						}
						
						++sended_stat;
						u.post('°BB°' + KnuddelsServer.getAppName() + '°r°: ' + subject, params.formater({
							NICKNAME: u.getNick().escapeKCode()
						}));
					}, 500);
				}
			});
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
		return 'Newsletter';
	};
}
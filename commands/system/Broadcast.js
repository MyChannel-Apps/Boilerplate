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
 * Repräsentiert den Chatbefehl `/system broadcast:[Subject§][Message]`
 *
 * Weitere Informationen und Befehle können aus den einzelnen Methoden entnommen werden.
 *
 * @author Adrian Preuß, Bizarrus
 * @class Broadcast
 * @since 0.0.2
*/
function Broadcast() {
	/**
	 * Sendet eine Rundmail an alle Channelmoderatoren, AppManager und Channelbesitzer
	 * 
	 * **Befehl:** `/system broadcast:[Subject§][Message]`
	 *
	 * @method send
	 * @since 0.0.2
	 * @param {User} user Benutzer-Objekt
	 * @param {String} message Nachricht
	*/
	this.send = function send(user, message) {
		if(message.length == 0) {
			user.private('Bitte gebe eine Nachricht für den Broadcast ein!');
			return;
		}
		
		var users	= {};
		var send	= 0;
		var subject	= 'Rundmail von ' + user.getNick();
		message		= message.replace(/#/g, '°#°');
		
		if(message.indexOf('§') > -1) {
			var split	= message.split('§');
			subject		= split[0];
			message		= split[1];
		}
		
		Channel.getModerators().each(function(user) {
			if(!users.exists(user.getID())) {
				users[user.getID()] = user;
			}
		});
		
		Channel.getOwners().each(function(user) {
			if(!users.exists(user.getID())) {
				users[user.getID()] = user;
			}
		});
		
		KnuddelsServer.getAppManagers().each(function(user) {
			if(!users.exists(user.getID())) {
				users[user.getID()] = user;
			}
		});
		
		user.private('Broadcast an _' + users.size() + ' Nutzer_ versandt.');
		
		users.each(function(user, id) {
			user.post(subject, params.formater({
				NICKNAME:	user.getProfileLink()
			}));
		});
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
		return 'Broadcast';
	};
}
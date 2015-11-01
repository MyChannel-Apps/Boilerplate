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
 * Repräsentiert diverse Funktionen um mit den AppBot zu inteagieren.
 *
 * Weitere Informationen und Befehle können aus den einzelnen Methoden entnommen werden.
 *
 * @author Adrian Preuß, Bizarrus
 * @class AppBot
 * @since 0.0.3
*/
function AppBot() {
	var _receiver = {};
	
	/**
	 * Führt einen angegebenen Befehl aus. Achtung, Privatgespräche werden weitergeleitet, die mit `start` oder `stop` aktiviert/deaktiviert können.
	 * 
	 * **Befehl:** `/bot say:[Message]`
	 *
	 *             `/bot psay:[Nickname]:[Message]`
	 *
	 *             `/bot stop`
	 *
	 *             `/bot start`
	 *
	 * @method handle
	 * @since 0.0.3
	 * @param {User} user Benutzer-Objekt
	 * @param {String} params Weitere Befehlsinformationen
	*/
	this.handle = function handle(user, params) {
		if(!user.isAppDeveloper() || !user.isAppManager()) {
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
		}
		
		switch(action.toLowerCase()) {
			case 'psay':
				var nickname	= Users.get(tokens[1]);
					
				if(nickname == undefined || (nickname.virtual != undefined && nickname.virtual)) {
					user.private(params == undefined ? 'Bitte gebe einen Nicknamen an!' : 'Tut mir leid, aber _' + params.escapeKCode() + '_ existiert leider nicht.');
					return;
				}
				
				params = params.substring(nickname.getNick().length + 1);
				params = this.parseMessage(params);
				user.private('°RR°_(an ' + nickname.getProfileLink() + '):_°r° ' + params);
				nickname.private(params);
				_receiver[user.getID()] = user;
			break;
			case 'say':
				Bot.public(this.parseMessage(params));
			break;
			case 'stop':
				user.private('Du erhälst nun keine Weiterleitung mehr.');
				delete _receiver[user.getID()];
			break;
			case 'start':
				user.private('Du erhälst nun Weiterleitung vom Bot.');
				_receiver[user.getID()] = user;
			break;
		}
	};
	
	/**
	 * Die Nachrichten, die weitergeleitet werden sollen
	 *
	 * @method onMessage
	 * @since 0.0.3
	 * @param {String} message Nachricht
	 * @param {boolean} private Privatgespräch (ja|nein)
	 * @private
	*/
	this.onMessage = function onMessage(message, private) {
		if(!private) {
			return;
		}
		
		for(var id in _receiver) {
			var user = _receiver[id];
			
			if(user == undefined || user == null) {
				continue;
			}
			
			user.private('°RR°_(von ' + message.getAuthor().getProfileLink() + '):_°r° ' + message.getText());
		}
	};
	
	/**
	 * Ersetzt eine Nachricht (zum Beispiel mit Mentor-Smileys)
	 *
	 * @method parseMessage
	 * @since 0.0.3
	 * @param {String} message Nachricht
	 * @private
	*/
	this.parseMessage = function parseMessage(message) {
		var smileys = {
			':-)':	'sm_00.gif',
			':-(':	'sm_03.gif',
			':-|':	'sm_13.gif',
			':-D':	'sm_10.gif',
			':-O':	'sm_06.gif',
			';-)':	'sm_01.gif',
			':o)':	'sm_12.gif',
			':-]':	'sm_08.gif',
			'O:)':	'sm_07.gif',
			':((':	'sm_04.gif',
			'X-)':	'sm_05.gif',
			'(-:':	'sm_09.gif',
			':-P':	'sm_02.gif',
			'8-)':	'sm_11.gif',
			';-*':	'sm_16.gif'
		};
		
		for(var code in smileys) {
			var image	= smileys[code];
            var escaped = code.replace(/(\[|\]|\||\(|\)|\*)/g, '\\$1');
            var search	= new RegExp(escaped, 'g');
			message		= message.replace(search, '°>' + image + '<°');
		}
		
		return message;
	};
	
	/**
	 * Zahlt einen Betrag an dem Nutzer aus (Systemabbuchung!)
	 *
	 * @method payout
	 * @since 0.0.3
	 * @param {User} user Benutzer-Objekt
	 * @param {String} params Anzahl der Knuddel
	 * @private
	*/
	this.payout = function payout(user, params) {
		if(!user.isChannelOwner() && !user.isAppDeveloper()) {
			user.private('Dir fehlen die notwendigen Rechte um diese Aktion auszuführen!');
			return;
		}
		
		var knuddel = parseFloat(params);
		
		if(isNaN(knuddel)) {
			user.private('Wieviele _°>sm_classic_00.gif<r° Knuddel_ möchtest du denn vom System abbuchen?');
			return;
		}
		
		if(knuddel <= 0.00) {
			user.private('Du kannst nur mindestens _°>sm_classic_00.gif<r° 0,01 Knuddel_ abheben.');
			return;
		}
		
		if(knuddel > Bot.getKnuddels()) {
			user.private('So viele Knuddel habe ich derzeit leider nicht!');
			return;
		}
		
		KnuddelsServer.getAppDeveloper().post('°BB°' + KnuddelsServer.getAppName() + '°r°: Abbuchung', '°r°$NICKNAME hat _°>sm_classic_00.gif<r° $KNUDDEL Knuddel_ vom System abgebucht.'.formater({
			NICKNAME:	user.getNick().escapeKCode(),
			KNUDDEL:	knuddel
		}));
		
		Bot.knuddel(user, new KnuddelAmount(knuddel), 'Systemabbuchung', false);
	};
}
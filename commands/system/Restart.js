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
 * Repräsentiert Methoden um die App über Chatbefehle neuzustarten
 *
 * Weitere Informationen und Befehle können aus den einzelnen Methoden entnommen werden.
 *
 * @author Adrian Preuß, Bizarrus
 * @class Restart
 * @since 0.0.1
*/
function Restart() {
	var _instance = this;
	
	/**
	 * Startet die App neu
	 * 
	 * **Befehl:** `/system (+)restart[:Time]`
	 *
	 * @method handle
	 * @since 0.0.1
	 * @param {User} user
	 * @param {boolean} seconds
	 * @param {boolean} broadcast
	*/
	this.handle = function(user, seconds, broadcast) {
		seconds		= (typeof(seconds) == 'undefined' ? 0 : parseInt(seconds, 10));
		broadcast	= (typeof(broadcast) == 'undefined' ? false : broadcast);
		
		if(isNaN(seconds)) {
			seconds = 0;
		}
		
		if(broadcast) {
			var text		= new KCode();
			text.append('Die App wird nun neugestartet.');
			text.newLine();
			text.newLine();
			text.append('°BB°Durchsage von °>_h' + user.getNick().escapeKCode() + '|/serverpp "|/w "<°: °20°_In ' + seconds + ' Sekunde' + (seconds == 1 ? '' : 'n') + ' gibt es aufgrund eines Updates einen Neustart der App.');
			Bot.public(text);
		}
		
		if(seconds <= 0) {
			_instance.reboot();
			return;
		}
		
		setTimeout(function() {
			KnuddelsServer.getAppInfo().updateApp();
		}, seconds * 1000);
	};
	
	/**
	 * Weist der `RootInstance` der App an, diese zu updaten
	 * 
	 * @method reboot
	 * @since 0.0.1
	 * @private
	*/
	this.reboot = function() {
		KnuddelsServer.getAppAccess().getOwnInstance().getRootInstance().updateApp();		
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
	this.toString = function toString() {
		return 'Restart';
	};
}
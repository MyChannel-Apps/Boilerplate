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
 * Repräsentiert den Chatbefehl `/system eval:[Code]`
 *
 * Weitere Informationen und Befehle können aus den einzelnen Methoden entnommen werden.
 *
 * @author Adrian Preuß, Bizarrus
 * @class Execute
 * @since 0.0.1
*/
function Execute() {
	/**
	 * Führt den angegebenen JavaScript-Code aus
	 * 
	 * **Befehl:** `/system eval:[JavaScript]`
	 *
	 * @method exec
	 * @since 0.0.1
	 * @param {User} user Benutzer-Objekt
	 * @param {String} data Der auszuführende JavaScript-Code
	*/
	this.exec = function exec(user, data) {
		if(!user.isAppDeveloper() && !user.isAppManager()) {
			user.private('Dir fehlen die notwendigen Rechte um diese Aktion auszuführen!');
			return;
		}
		
		eval('try { ' + data + ' } catch(e) { user.private(\'_Evaluating Exception:_ \' + e.message + \'°#+0010°\' + e.stack.replace(/\\n/g, \'°#+0010°\')); }');
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
		return 'Execute';
	};
}
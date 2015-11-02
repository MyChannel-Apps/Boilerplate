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
 * Dies ist eine **Beispielklasse**, die für `/commands/` genutzt werden kann.
 *
 * In der Klasse existieren alle Methoden, die in der App aufgerufen werden können. Nicht jede Methode ist Pflicht: Wird diese nicht benötigt, kann diese entfernt werden.
 *
 * @author Adrian Preuß, Bizarrus
 * @class SampleClass
 * @since 0.0.4
*/
function SampleClass() {
	/**
	 * Diese Methode wird aufgerufen, wenn die App gestartet wird
	 *
	 * @method onStart
	*/
	this.onStart = function onStart() {
		// @ToDo Wenn die App gestartet wurde
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn die App Beendet wurde
	 *
	 * @method onStop
	*/
	this.onStop = function onStop() {
		// @ToDo Wenn die App gestoppt wurde
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn die App Beendet wird
	 *
	 * @method onShutdown
	 * @param {Number} seconds Sekunden bis die App gestoppt wird
	 * @param {Property} reason Der Grund, warum die App heruntergefahren wird
	*/
	this.onShutdown = function onShutdown(seconds, reason) {
		// @ToDo Wenn die App heruntergefahren wurde
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn ein Nutzer den Channel betritt
	 *
	 * @method onJoin
	 * @param {User} user Das Benutzer-Objekt
	*/
	this.onJoin = function onJoin(user) {
		// @ToDo Wenn ein Nutzer den Channel betritt
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn ein Nutzer den Channel verlässt
	 *
	 * @method onLeave
	 * @param {User} user Das Benutzer-Objekt
	*/
	this.onLeave = function onLeave(user) {
		// @ToDo Wenn ein Nutzer den Channel verlässt
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn ein Nutzer öffentlich oder den AppBot privat anschreibt
	 *
	 * @method onMessage
	 * @param {Message} message Das Nachrichten-Objekt
	 * @param {boolean} private Handelt es sich hier um eine private oder öffentliche Nachricht?
	*/
	this.onMessage = function onMessage(message, private) {	
		if(private) {
			// @ToDo Wenn ein Nutzer eine private Nachricht schreibt
			return;
		}
		
		// @ToDo Wenn ein Nutzer eine öffentliche Nachricht schreibt
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn ein Nutzer öffentlich schreibt. Diese Methode kann genutzt werden um Nachrichten zu unterbinden.
	 *
	 * @method showMessage
	 * @param {Message} message Das Nachrichten-Objekt
	 * @return {boolean} Darf die Nachricht angezeigt werden?
	*/
	this.showMessage = function showMessage(message) {
		// @ToDo Prüfen ob eine Nachricht geschrieben werden darf
		return true;
	};
	
	/**
	 * Diese Methode wird aufgerufen, wenn ein Nutzer würfelt
	 *
	 * @method onDice
	 * @param {DiceEvent} event Das Würfel-Objekt
	*/
	this.onDice = function onDice(event) {
		// @ToDo Wenn der Nutzer würfelt...
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
		return 'SampleClass';
	};
}
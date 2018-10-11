/* global Module */

/* Magic Mirror
 * Module: MMM-Facial-Recognition
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */



Module.register('smartmirror-MaryTTS',{

	defaults: {

	},

	start: function() {
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	},

	notificationReceived: function(notification, payload, sender) {
		if(notification === 'smartmirror-TTS-en') {
			this.sendSocketNotification('TTS-en', payload);
        }else if(notification === 'smartmirror-TTS-ger') {
			this.sendSocketNotification('TTS-ger', payload);
        }
	},

});

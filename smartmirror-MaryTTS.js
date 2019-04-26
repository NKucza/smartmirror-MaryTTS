/**
 * @file smartmirror-MaryTTS.js
 *
 * @author nkucza
 * @license MIT
 *
 * @see  https://github.com/NKucza/smartmirror-MaryTTS
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
			//this.sendSocketNotification('TTS-en', "f");
			this.sendSocketNotification('TTS-en', payload);
        }else if(notification === 'smartmirror-TTS-ger') {
			//this.sendSocketNotification('TTS-ger', "f");
			this.sendSocketNotification('TTS-ger', payload);
        }
	},

});

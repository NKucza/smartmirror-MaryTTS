'use strict';
const NodeHelper = require('node_helper');

const PythonShell = require('python-shell');
var pythonStarted = false;

module.exports = NodeHelper.create({

 	python_start: function () {
		const self = this;
    		self.pyshell = new PythonShell('modules/' + this.name + '/pythonscripts/stringToTTS.py', { mode: 'json', args: [JSON.stringify(this.config)]});

    		self.pyshell.on('message', function (message) {
				//console.log("[MSG " + self.name + "] " + message);
      			if (message.hasOwnProperty('status')){
      				console.log("[" + self.name + "] " + message.status);
      			}
    		});
			
  	},

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
 		const self = this;
 		if(notification === 'TTS-en') {
			if(pythonStarted) {
				var data = {"en": payload}
                this.pyshell.send(data,{mode: 'json'});
            }
        }else if(notification === 'TTS-ger') {
			if(pythonStarted) {
				var data = {"ger": payload}
                this.pyshell.send(data,{mode: 'json'});
            }
        }else if(notification === 'CONFIG') {
			console.log("[" + self.name + "] starting");
			this.python_start();
			pythonStarted = true;
        };;
  }
});

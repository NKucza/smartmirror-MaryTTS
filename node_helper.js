'use strict';
const NodeHelper = require('node_helper');

const {PythonShell} = require('python-shell');
var pythonStarted = false;

module.exports = NodeHelper.create({

 	python_start: function () {
		const self = this;
    		self.pyshell = new PythonShell('modules/' + this.name + '/pythonscripts/stringToTTS.py', { pythonPath: 'python', args: [JSON.stringify(this.config)]});

    		self.pyshell.on('message', function (message) {
			try{
				var parsed_message = JSON.parse(message)
				//console.log("[MSG " + self.name + "] " + message);
      				if (parsed_message.hasOwnProperty('status')){
      					console.log("[" + self.name + "] " + parsed_message.status);
      				}
			}
			catch(err) {
				//console.log(err)
			}
    		});
			
  	},

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
 		const self = this;
 		if(notification === 'TTS-en') {
			if(pythonStarted) {
				var data = {"en": payload}
                self.pyshell.send(JSON.stringify(data));
            }
        }else if(notification === 'TTS-ger') {
			if(pythonStarted) {
				var data = {"ger": payload}
                self.pyshell.send(JSON.stringify(data));
            }
        }else if(notification === 'CONFIG') {
			console.log("[" + self.name + "] starting");
			this.python_start();
			pythonStarted = true;
        };;
  },

	stop: function() {
		const self = this;
		self.pyshell.childProcess.kill('SIGKILL');
		self.pyshell.end(function (err) {
           	if (err){
        		//throw err;
    		};
    		console.log('finished');
		});
	}
});

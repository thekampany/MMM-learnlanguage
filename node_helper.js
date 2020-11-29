'use strict';

/* Magic Mirror
 * Module: MMM-learnlanguage
 */

const NodeHelper = require('node_helper');
var request = require('request');
var moment = require('moment');

module.exports = NodeHelper.create({

	start: function() {
		this.started = false;
		this.config = null;
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
                if (notification === 'TO-AND-FROM') {
                   self.config  = payload;
                   var wordpair = self.config.text + " - " + self.config.translatedtext;
                   self.sendSocketNotification("BOTH", wordpair);
                }
		if (notification === 'TO-OR-FROM') {
			self.config = payload;
			//console.log(self.config);
			var d = new Date();
			var n = d.getSeconds();
			if (n > 30) {
			   self.sendSocketNotification("RIGHT", self.config.text);
			   self.started = true;
			   //console.log(self.name + ": rightconfigured");
			} else {
                           self.sendSocketNotification("LEFT", self.config.translatedtext);
                           self.started = true;
                           //console.log(self.name + ": leftconfigured");
			}
		}
	}
});

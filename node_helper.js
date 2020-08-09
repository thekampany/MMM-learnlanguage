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

	getData: function() {
		var self = this;

		var rainintensityUrl = this.config.api + "?lat=" + this.config.lat + "&lon="+ this.config.lon;
                console.log(self.name + rainintensityUrl);
		request({
			url: rainintensityUrl,
			method: 'GET',
		}, function (error, response, body) {
       		        //body=   "077|17:05\n034|17:10\n101|17:15\n087|17:20\n"+
				"077|17:25\n020|17:30\n000|17:35\n000|17:40\n"+
				"077|17:45\n087|17:50\n087|17:55\n127|18:00\n"+
				"137|18:05\n034|18:10\n170|18:15\n000|18:20\n"+
				"000|18:25\n000|18:30\n000|18:35\n000|18:40\n"+
				"010|18:45\n020|18:50\n030|18:55\n043|19:00\n";

			if (!error && response.statusCode == 200) {
				if (!body || body=="") console.log(self.name + body + response.headers);
				self.sendSocketNotification("DATA", body);
			} else {
				error = "No data at the moment, will retry";
				console.log(self.name + error);
				self.sendSocketNotification("ERROR", error);
			}
		});

		setTimeout(function() { self.getData(); }, this.config.refreshInterval);
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

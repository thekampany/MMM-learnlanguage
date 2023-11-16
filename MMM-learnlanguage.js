


//MMM-learnlanguage.js:

Module.register("MMM-learnlanguage",{
	// Default module config.
	defaults: {
                nextWordInterval: 90000, //interval to fetch a new wordpair
		language : "swedish", //name of csv file without extension
                text: "vertalen",
                translatedtext : "translate",
                showpair: "alternating", //alternating or showboth
                wordpaircssclassname: "bright xlarge",
	},

      	// Define required translations.
	//getTranslations: function() {
       	//	return {
        //    		en: "translations/en.json",
        //    		nl: "translations/nl.json",
        //	};
	//},


	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		this.scheduleUpdate();

       	},

	toOrFrom: function() {
		this.sendSocketNotification('TO-OR-FROM', this.config);
	},

        toAndFrom: function() {
                this.sendSocketNotification('TO-AND-FROM', this.config);
        },

	// Process Data that was read from the file.
	processData: function(data) {
		// convert our data from the file into an array
                var datautf8 = JSON.parse( JSON.stringify( data ) )
		var lines = datautf8.replace(/\n+$/, "").split("\n");
		var numLines = lines.length-1;
		this.foreignl = [];
		this.ownl = [];

                for (i=0;i<numLines; i++) {
                    var line = lines[i];
	            var semicolonIndex = line.indexOf(';');
	            f = line.substring(0, semicolonIndex);
	            o = line.substring(semicolonIndex+1, line.length);

                    this.foreignl.push(f);
                    this.ownl.push(o);
                }


		this.loaded = true;
		x = Math.floor(Math.random() * numLines);
		this.config.text = this.ownl[x];
		this.config.translatedtext = this.foreignl[x];
		var self = this;

                if (this.config.showpair === "showboth") {
                      setInterval(function(){
                        self.toAndFrom()
                        }, 3000);
                }
                else {
		      setInterval(function(){
			self.toOrFrom()
			}, 3000);
                }
	},

	// getWord from the file
  getWord: async function () {
    const response = await fetch(
      this.file(`languagefiles/${this.config.language}.csv`)
    );

    if (response.status === 200) {
      const data = await response.text();
      let self = this;
      self.processData(data);
    } else {
      throw new Error("Failed to fetch language file.");
    }
  },

	scheduleUpdate: function(delay) {
		var nextWord = this.config.nextWordInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextWord = delay;
		}

		var self = this;
		self.getWord();
		setTimeout(function(){
			self.scheduleUpdate()
			},nextWord);
	},

        // Override dom generator.
        getDom: function() {
                var wrapper = document.getElementById('wordpair');
                if (!wrapper) {
		    wrapper = document.createElement("div");
		    wrapper.className = this.config.wordpaircssclassname;
		    wrapper.id = "wordpair";
                }
                return wrapper;
        },

        getHeader: function() {
	        return this.translate("LEARN " + this.config.language);
        },
	/* socketNotificationReceive(notification)
	 * used to get communication from the nodehelper
	 *
	 * argument notification object - status label from nodehelper.
	 */
       	socketNotificationReceived: function(notification, payload) {

                tofrom = document.getElementById('wordpair');

		if(notification === "LEFT") {
			tofrom.innerHTML = "<span style='visibility:visible'>"+ payload + "</span>";
                        tofrom.innerHTML += "<span style='visibility:hidden'>"+ payload + "</span>";
              	}
		if(notification === "RIGHT"){
                        tofrom.innerHTML = "<span style='visibility:hidden'>"+ payload + "</span>";
                        tofrom.innerHTML += "<span style='visibility:visible'>"+ payload + "</span>";
                }

                if(notification === "BOTH"){
                        tofrom.innerHTML = payload;
                }

		this.updateDom();

    	}

});

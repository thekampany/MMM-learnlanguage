/* MagicMirror²
 * Module: MMM-learnlanguage
 */

Module.register("MMM-learnlanguage", {
  // Default module config.
  defaults: {
    nextWordInterval: 90000, // interval to fetch a new wordpair
    language: "swedish", // name of CSV file without extension
    text: "vertalen",
    translatedtext: "translate",
    showpair: "alternating", // alternating or showboth
    wordpaircssclassname: "bright xlarge"
  },

  // Define required translations.
  // getTranslations: function() {
  //	return {
  //    		en: "translations/en.json",
  //    		nl: "translations/nl.json",
  //	};
  // },

  // Define start sequence.
  start() {
    Log.info(`Starting module: ${this.name}`);
    this.scheduleUpdate();
  },

  toOrFrom() {
    this.sendSocketNotification("TO-OR-FROM", this.config);
  },

  toAndFrom() {
    this.sendSocketNotification("TO-AND-FROM", this.config);
  },

  // Process Data that was read from the file.
  processData(data) {
    // Split the data into lines
    const lines = data.replace(/\n+$/, "").split("\n");

    this.foreignl = [];
    this.ownl = [];

    for (const line of lines) {
      const semicolonIndex = line.indexOf(";");
      const foreignWord = line.substring(0, semicolonIndex);
      const ownWord = line.substring(semicolonIndex + 1, line.length);

      this.foreignl.push(foreignWord);
      this.ownl.push(ownWord);
    }

    this.loaded = true;
    const x = Math.floor(Math.random() * lines.length);
    this.config.text = this.ownl[x];
    this.config.translatedtext = this.foreignl[x];

    if (this.config.showpair === "showboth") {
      setInterval(() => {
        this.toAndFrom();
      }, 3000);
    } else {
      setInterval(() => {
        this.toOrFrom();
      }, 3000);
    }
  },

  // getWord from the file
  async getWord() {
    const response = await fetch(
      this.file(`languagefiles/${this.config.language}.csv`)
    );

    if (response.status === 200) {
      const data = await response.text();
      this.processData(data);
    } else {
      throw new Error("Failed to fetch language file.");
    }
  },

  scheduleUpdate(delay) {
    let nextWord = this.config.nextWordInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextWord = delay;
    }

    const self = this;
    self.getWord();
    setTimeout(function () {
      self.scheduleUpdate();
    }, nextWord);
  },

  // Override dom generator.
  getDom() {
    let wrapper = document.getElementById("wordpair");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = this.config.wordpaircssclassname;
      wrapper.id = "wordpair";
    }
    return wrapper;
  },

  getHeader() {
    return this.translate(`LEARN ${this.config.language}`);
  },
  /* socketNotificationReceive(notification)
   * used to get communication from the nodehelper
   *
   * argument notification object - status label from nodehelper.
   */
  socketNotificationReceived(notification, payload) {
    const tofrom = document.getElementById("wordpair");

    if (notification === "LEFT") {
      tofrom.innerHTML = `<span style='visibility:visible'>${payload}</span>
                          <span style='visibility:hidden'>${payload}</span>`;
    } else if (notification === "RIGHT") {
      tofrom.innerHTML = `<span style='visibility:hidden'>${payload}</span>
                          <span style='visibility:visible'>${payload}</span>`;
    } else if (notification === "BOTH") {
      tofrom.innerHTML = payload;
    }
  }
});

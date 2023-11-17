/* MagicMirror²
 * Module: MMM-learnlanguage
 */

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start() {
    this.started = false;
    this.config = null;
  },

  socketNotificationReceived(notification, payload) {
    const self = this;
    if (notification === "TO-AND-FROM") {
      self.config = payload;
      const wordpair = `${self.config.text} - ${self.config.translatedtext}`;
      self.sendSocketNotification("BOTH", wordpair);
    }
    if (notification === "TO-OR-FROM") {
      self.config = payload;
      // console.log(self.config);
      const d = new Date();
      const n = d.getSeconds();
      self.started = true;
      if (n > 30) {
        self.sendSocketNotification("RIGHT", self.config.text);
        // console.log(self.name + ": rightconfigured");
      } else {
        self.sendSocketNotification("LEFT", self.config.translatedtext);
        // console.log(self.name + ": leftconfigured");
      }
    }
  }
});

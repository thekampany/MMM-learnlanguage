/* MagicMirror²
 * Module: MMM-learnlanguage
 */

Module.register("MMM-learnlanguage", {
  // Default module config.
  defaults: {
    language: "swedish", // name of CSV file without extension
    nextWordInterval: 12 * 60 * 60 * 1000, // interval to switch to wordpair
    showpair: "alternating", // alternating or showboth
    toggleInterval: 10 * 1000, // if "alternating" toggle time between own language word and foreign language word
    wordpaircssclassname: "bright large",
    showHeader: true
  },

  // Define required translations.
  getTranslations() {
    return {
      de: "translations/de.json",
      en: "translations/en.json",
      nl: "translations/nl.json"
    };
  },

  // Define start sequence.
  async start() {
    Log.info(
      `Starting module: ${this.name} with identifier: ${this.identifier}`
    );

    // Read all words
    await this.getWords();

    // Set new word every x (nextWordInterval) milliseconds
    setInterval(() => {
      this.setNewWordpair();
    }, this.config.nextWordInterval);

    // If "alternating": Switch every 30 seconds between own language word and foreign language word
    if (this.config.showpair === "alternating") {
      this.showOwnWord = true;
      setInterval(() => {
        this.toogleOwnForeignWord();
      }, this.config.toggleInterval);
    }
  },

  toogleOwnForeignWord() {
    this.showOwnWord = !this.showOwnWord;
    if (this.showOwnWord) {
      this.text = `<span style='visibility:hidden'>${this.ownLanguageWord}</span>
                   <span style='visibility:visible'>${this.ownLanguageWord}</span>`;
    } else {
      this.text = `<span style='visibility:visible'>${this.foreignLanguageWord}</span>
                   <span style='visibility:hidden'>${this.foreignLanguageWord}</span>`;
    }

    this.updateDom();
  },

  // Process Data that was read from the file.
  setNewWordpair() {
    const randomNumber = Math.floor(
      Math.random() * this.ownLanguageArray.length
    );
    this.ownLanguageWord = this.ownLanguageArray[randomNumber];
    this.foreignLanguageWord = this.foreignLanguageArray[randomNumber];

    if (this.config.showpair === "showboth") {
      const wordpair = `${this.ownLanguageWord} - ${this.foreignLanguageWord}`;
      this.text = wordpair;
      this.updateDom();
    }
  },

  // getWords from the file
  async getWords() {
    const response = await fetch(
      this.file(`languagefiles/${this.config.language}.csv`)
    );

    if (response.status === 200) {
      const data = await response.text();
      const words = data.replace(/\n+$/, "").replaceAll(/\r/g, "").split("\n");

      this.foreignLanguageArray = [];
      this.ownLanguageArray = [];

      words.forEach((line) => {
        const semicolonIndex = line.indexOf(";");
        const foreignWord = line.substring(0, semicolonIndex);
        const ownWord = line.substring(semicolonIndex + 1);

        this.foreignLanguageArray.push(foreignWord);
        this.ownLanguageArray.push(ownWord);
      });

      this.setNewWordpair();
    } else {
      throw new Error("Failed to fetch language file.");
    }
  },

  // Override dom generator.
  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = this.config.wordpaircssclassname;
    if (this.text) {
      wrapper.innerHTML = this.text;
    }
    wrapper.id = "wordpair";

    return wrapper;
  },

  getHeader() {
    if (this.config.showHeader) {
      return this.translate(
        `${this.translate("LEARN")} ${this.translate(this.config.language)}`
      );
    }
  }
});

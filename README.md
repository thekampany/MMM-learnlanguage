# MMM-learnlanguage

[MagicMirror²](https://magicmirror.builders/) module for learning a word every time you look in the mirror.

![screenshot 1](screenshot-MMM-learnlanguage-1.png)
![screenshot 2](screenshot-MMM-learnlanguage-2.png)

## Installation

Navigate into your MagicMirror's modules folder and execute

```sh
git clone https://github.com/thekampany/MMM-learnlanguage
```

## Using the module

This module shows a word of a language you want to learn, alternating with the meaning in english. Train yourself.
You will have to learn the grammar of the language somewhere else. This just helps in getting to know a set of commonly used words.
The set of commonly used words is stored in a csv file per language.

## Config options

| option                 | description                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `language`             | `"danish"`, `"frisian"`, `"german"`, `"italian"`, `"japanese"`, `"spanish"` or `"swedish"`. Has to match the name of the CSV file that contains the wordpairs. |
| `nextWordInterval`     | In miliseconds. The interval between wordpairs. One word per day = `24*3600*1000`. Two words per day is `12*3600*1000`.                                        |
| `showpair`             | `"showboth"` or `"alternating"`                                                                                                                                |
| `wordpaircssclassname` | Influences the fontsize, uses the CSS from main CSS.                                                                                                           |

## Example configuration to put in config.js

```js
  {
    module: "MMM-learnlanguage",
    position: "top_right",
    config: {
      language: "spanish",
      nextWordInterval: 90000,
      showpair: "showboth",
      wordpaircssclassname: "bright medium"
    }
  },
```

## ToDo

- Use a translation API in order to be able to translate from any to any language.
- Influence the interval showing foreignlanguage vs ownlanguage (english).

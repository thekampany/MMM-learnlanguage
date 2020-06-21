# MMM-learnlanguage

Magic Mirror Module for learning a word every time you look in the mirror.

![screenshot 1](https://github.com/thekampany/MMM-learnlanguage/blob/master/screenshot-MMM-learnlanguage-1.png)
![screenshot 2](https://github.com/thekampany/MMM-learnlanguage/blob/master/screenshot-MMM-learnlanguage-2.png)

## Installation
Navigate into your MagicMirror's modules folder and execute 'git clone https://github.com/thekampany/MMM-learnlanguage'

## Using the module
This module shows a word of a language you want to learn, alternating with the meaning in english. Train yourself.
You will have to learn the grammar of the language somewhere else. This just helps in getting to know a set of commonly used words.
The set of commonly used words is stored in a csv file per language. 
  
## Config options
<table>
<tr><td>option</td><td>description</td></tr>
<tr><td>language</td><td>language: spanish, swedish. has to match the name of the csv file that contains the wordpairs.</td></tr>
<tr><td>nextWordInterval</td><td>In miliseconds. The interval between wordpairs. One word per day = 24*3600*1000. Two words per day is 12*3600*1000</td></tr>
</table>

## Example configuration to put in config.js
    {
		module: "MMM-learnlanguage",
		position: "top_right",
		config: {
			language: "spanish",
			nextWordInterval: 90000, 
	  	}
  	},

## ToDo
Use a translation api in order to be able to translate from any to any language.
Influence the interval showing foreignlanguage vs ownlanguage (english).

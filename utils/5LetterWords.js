const fs = require('fs');
const _ = require('lodash');
const words = fs.readFileSync('./persian-words.txt', 'utf8').split('\n');

// select only words with 5 letters
const fiveLetterWords = _.uniq(words.filter(word => word.length === 5));

fs.writeFileSync('./five-letter-words.txt', fiveLetterWords.join('\n'));
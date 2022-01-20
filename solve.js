const axios = require('axios');
const fs = require('fs');
const _ = require('lodash');

const day = process.argv[2] || Math.floor(((new Date()) - ((new Date(new Date() - 1000 * 60 * 60 * 24 * 12)).setHours(0, 0, 0, 0))) / (1000 * 60 * 60 * 24));
let selectedWords = [];
let lastRegexArray = ['[\u0600-\u06FF]', '[\u0600-\u06FF]', '[\u0600-\u06FF]', '[\u0600-\u06FF]', '[\u0600-\u06FF]'];
let r = [];
let y = {};
const g = {};

let tries = 0;

let words = fs.readFileSync('./five-letter-words.txt', 'utf8').split('\n');

const newWord = () => {
    const selectedWordsFiltered = words.filter(word => {
        return !selectedWords.includes(word);
    });

    // filter words have letters in r variable
    const redFiltered = selectedWordsFiltered.filter(w => {
        for (let i = 0; i < w.length; i++) {
            if (r.includes(w[i])) {
                return false;
            }
        }
        return true;
    });
    // console.log(y);
    if (Object.keys(g).length + Object.keys(y).length == 5) {
        let newRegex;
        Object.keys(y).forEach(key => {
            let codePoint = ('0000' + key.codePointAt().toString(16)).slice(-4);
            newRegex = newRegex ? newRegex + ',\\u' + codePoint : '\\u' + codePoint;
        });
        lastRegexArray.forEach((regex, index) => {
            if (regex == '[\u0600-\u06FF]') {
                lastRegexArray[index] = '[' + newRegex + ']';
            }
        });
        // filter words match last regex array
        const greenFiltered = redFiltered.filter(w => {
            return w.match(new RegExp(lastRegexArray.join('')));
        });

        if (greenFiltered.length == 0) {
            console.log('no more words');
            process.exit(1);
        }
        words = greenFiltered;
        return _.sample(greenFiltered);
    } else {
        // filter words match last regex array
        const greenFiltered = redFiltered.filter(w => {
            return w.match(new RegExp(lastRegexArray.join('')));
        });
        // filter words have letters in y variable with another index
        const yellowFiltered = greenFiltered.filter(w => {
            for (let i = 0; i < w.length; i++) {
                if (y[w[i]] && y[w[i]].includes(i)) {
                    return false;
                }
            }
            return true;
        });

        if (yellowFiltered.length == 0) {
            console.log('no more words after ' + tries + ' tries');
            process.exit(1);
        }
        words = yellowFiltered;
        return _.sample(yellowFiltered);
    }

}

const solve = async (word) => {
    try {
        tries++;
        selectedWords.push(word);
        // console.log(word);
        const url = 'https://www.vaajoor.ir/api/check?word=' + encodeURI(word) + '&g=' + day;
        const response = await axios.get(url);
        const {
            data
        } = response;
        if (data.rLetters.length > 0) {
            r.push(data.rLetters);
            r = _.flattenDeep(r);
            r = _.uniq(r);
        }
        // data.match should be ['g','g', 'g', 'g', 'g']
        console.log(data.match);
        if (JSON.stringify(data.match) == JSON.stringify(["g", "g", "g", "g", "g"])) {
            console.log(word);
            console.log('tries: ' + tries);
            return word;
        }
        // g indexes in match
        data.match.forEach((letter, i) => {
            if (letter == 'g') {
                g[word[i]] = i;
                // remove letter from y
                delete y[word[i]];
                lastRegexArray[i] = word[i];
            } else if (letter == 'y') {
                if (!y[word[i]]) {
                    y[word[i]] = [];
                }
                y[word[i]].push(i);
            }
        });
        throw new Error('another word');
    } catch (error) {
        solve(newWord());
    }
}

// words with non repeating letters
const wordsWithNonRepeatingLetters = words.filter(word => {
    const letters = word.split('');
    const uniqueLetters = new Set(letters);
    return uniqueLetters.size === letters.length;
});

// select random word from wordsWithNonRepeatingLetters
const randomWord = wordsWithNonRepeatingLetters[Math.floor(Math.random() * wordsWithNonRepeatingLetters.length)];

solve(randomWord);
# vaajoor solver
### What is Vaajoor?
[Vaajoor ](https://www.vaajoor.ir/) is a persian daily word game like [Wordle](https://www.powerlanguage.co.uk/wordle/)

### Vaajoor solver
Vaajoor solver is a JS applcation that can find the solution of Vaajoor game.

### How it works?
First, I need to find best persian words list. (I have downloaded it from [here](https://github.com/shahind/Persian-Words-Database))
Then we need to filter 5 letters words from the list. (I did it by ```utils/5LetterWords.js```)
Now, It's time to solve.
1- Find words with non-repeating letters. (This words are better to start because they have more chance to be found)
2- Pass one word to the solver.
3- Check from API word is valid or not.
4- If it's not valid, find another word. by removing words by red letters, and check word has green and yellow letters.

## Installation

Vaajoor solver requires [Node.js](https://nodejs.org/) to run.

```sh
git clone https://github.com/HosseinDotLink/vaajoor-solver.git
cd vaajoor-solver
npm i
node solve.js # or node solve.js [day] for specific day for example node solve.js 12
```
const letters = document.querySelectorAll('.letter')
console.log(letters);
let counter = 0;
let boxN = 0;
let attCounter = 0;


async function init() {
    let currentGuess = '';
    let res = await fetch('https://words.dev-apis.com/word-of-the-day')
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = Array.from(word);

    async function inputLetters(keybrdBttn) {
        if (currentGuess.length < 5) {
            currentGuess = currentGuess + keybrdBttn;
            counter += 1;
            letters[counter - 1].innerText = keybrdBttn;
        }
    };
    console.log(word)
    async function validateWord(word) {
        const res = await fetch('https://words.dev-apis.com/validate-word', {
            method: 'POST',
            body: JSON.stringify({ word: word })
        });
        const resObj = await res.json();
        const validWord = resObj.validWord;
        if (!validWord) {
            console.log('not a word!') //TODO 
        }
        else {
            let attempt = Array.from(currentGuess.toUpperCase());
            currentGuess = '';
            compareWords(wordParts, attempt);
        }

    }
    async function commitWord() {
        validateWord(currentGuess);

    };
    async function bckspace() {
        if (counter > 0 && currentGuess.length > 0) {
            counter -= 1;
        }
        currentGuess = currentGuess.slice(0, currentGuess.length - 1)
        letters[counter].innerText = '';
    };
    document.addEventListener('keydown', function kbrdHandle(event) {
        if (event.key === 'Enter') {
            if (currentGuess.length === 5) {
                commitWord(event.key);
            }
        }
        else if (event.key === 'Backspace') {
            bckspace(event.key);
        }
        else if (event.key.match(/^[\p{Letter}\p{Mark}]+$/u)) {
            inputLetters(event.key);
        }
    })
    async function compareWords(wordOTD, myWord) {
        let correct = 0;
        let testArr = [];
        let testArr1 = [];
        let temp = []
        for (i = 0; i < 5; i++) {
            if (myWord[i] === wordOTD[i]) {
                letters[boxN].style.backgroundColor = 'green';
                correct++;
                testArr.push('-');
                testArr1.push('+')
                if (correct === 5) {
                    alert('you won!')//TODO
                }
            }
            else if (myWord[i] != wordOTD[i]) {
                testArr.push(myWord[i]);
                testArr1.push(wordOTD[i])
            };
            boxN++;
        }
        const matchesYell = testArr1.filter(element => testArr.includes(element));
        let x = []
        for (i = 0; i < matchesYell.length; i++) {
            let y = testArr.indexOf(matchesYell[i]);
            delete testArr[y];
            x.push(y);
        }
        for (i = 0; i < x.length; i++) {
            let y = x[i];
            letters[y + attCounter].style.backgroundColor = 'yellow';
        }
        attCounter += 5;
    }
}
init();
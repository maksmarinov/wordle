
const letters = document.querySelectorAll('.letter');
const onScrnKbrd = document.getElementById('kbrd');

async function init() {

    let counter = 0;
    let boxN = 0;
    let attCounter = 0;
    let currentGuess = '';

    let res = await fetch('https://words.dev-apis.com/word-of-the-day?random=1')
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = Array.from(word);
    onScrnKbrd.addEventListener('touchstart', onScrnKbrd => {
        let x = onScrnKbrd.target.innerHTML;
        console.log(x)
    })
    onScrnKbrd.addEventListener('click', onScrnKbrd => {
        if (onScrnKbrd.target.innerHTML === 'Enter') {
            if (currentGuess.length === 5) {
                commitWord();
            }
        }
        else if (onScrnKbrd.target.innerHTML === '⇐') {
            bckspace();
        }
        else if (onScrnKbrd.target.innerHTML.match(/^[\p{Letter}\p{Mark}]+$/u)) {
            inputLetters(onScrnKbrd.target.innerHTML);
        }

    })

    // ___________________________________________
    async function inputLetters(keybrdBttn) {
        if (currentGuess.length < 5) {
            currentGuess = currentGuess + keybrdBttn;
            counter += 1;
            letters[counter - 1].innerText = keybrdBttn;
        }
    };
    async function bckspace() {
        if (counter > 0 && currentGuess.length > 0) {
            counter -= 1;
        }
        currentGuess = currentGuess.slice(0, currentGuess.length - 1)
        letters[counter].innerText = '';
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

    // document.addEventListener('click', function kbrdHandle(event) {
    //     if (event.target.innerText === 'Enter') {
    //         if (currentGuess.length === 5) {
    //             commitWord(event.target.innerText);
    //         }
    //     }
    //     else if (event.target.innerText === 'Backspace') {
    //         bckspace(event.target.innerText);
    //     }
    //     else if (event.target.innerText.match(/^[\p{Letter}\p{Mark}]+$/u)) {
    //         inputLetters(event.key);
    //     }
    // });
    async function compareWords(wordOTD, myWord) {
        let correct = 0;
        let testArr = [];
        let testArr1 = [];
        for (i = 0; i < 5; i++) {
            if (myWord[i] === wordOTD[i]) {
                letters[boxN].style.backgroundColor = '#30411f';
                correct++;
                testArr.push('-');
                testArr1.push('+');
                if (correct === 5) {
                    alert('you won!')//TODO
                }
            }
            else if (myWord[i] != wordOTD[i]) {
                testArr.push(myWord[i]);
                testArr1.push(wordOTD[i])
                letters[boxN].style.backgroundColor = '#3a3a3a';
            };
            boxN++;
        }
        const matchesYell = testArr1.filter(element => testArr.includes(element));
        let x = []
        for (i = 0; i < matchesYell.length; i++) {
            let y = testArr.indexOf(matchesYell[i]);
            if (y >= 0) {
                x.push(y);
                delete testArr[y];
            }
        }
        for (i = 0; i < x.length; i++) {
            let y = x[i];
            letters[y + attCounter].style.backgroundColor = '#998200';
        }
        attCounter += 5;
        if (attCounter === 30 && correct != 5) {
            alert('Word was: ' + word);
        }
    }
}
init();
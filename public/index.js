async function init() {
  const letters = document.querySelectorAll(".letter");
  const onScrnKbrd = document.getElementById("kbrd");
  const warning = document.getElementById("invalidWord");
  const refreshW = document.getElementById("refresh");
  const newWordLoad = document.getElementById("new");
  const winner = document.getElementById("win");
  const lost = document.getElementById("loss");
  
  let winCond = 0;
  let counter = 0;
  let boxN = 0;
  let attCounter = 0;
  let currentGuess = "";

  const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = Array.from(word);
  console.log(word);
  refreshW.addEventListener("click", () => {
    newWordLoad.style.visibility = "visible";
    setTimeout(() => {
      newWordLoad.style.visibility = "hidden";
    }, 1000);
    setTimeout(() => {
      location.reload();
    }, 1000);
  });

  onScrnKbrd.addEventListener("click", (onScrnKbrd) => {
    if (onScrnKbrd.target.innerHTML === "Enter") {
      if (currentGuess.length === 5) {
        onScrnKbrd.target.disabled = true;
        document.getElementById("bcksSp").disabled = true;
        commitWord();
      }
      setTimeout(() => {
        onScrnKbrd.target.disabled = false;
      }, 2000);
      setTimeout(() => {
        document.getElementById("bcksSp").disabled = false;
      }, 1000);
    } else if (onScrnKbrd.target.innerHTML === "Bckspc") {
      bckspace();
    } else if (
      onScrnKbrd.target.innerHTML.match(/^[\p{Letter}]$/u) &&
      winCond != 1
    ) {
      inputLetters(onScrnKbrd.target.innerHTML);
    }
  });

  async function inputLetters(keybrdBttn) {
    if (currentGuess.length < 5) {
      currentGuess = currentGuess + keybrdBttn;
      counter += 1;
      letters[counter - 1].innerText = keybrdBttn;
    }
  }

  async function bckspace() {
    if (counter > 0 && currentGuess.length > 0) {
      counter -= 1;
    }
    currentGuess = currentGuess.slice(0, currentGuess.length - 1);
    letters[counter].innerText = "";
  }

  async function validateWord(word) {
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: word }),
    });
    const resObj = await res.json();
    const validWord = resObj.validWord;
    if (!validWord) {
      warning.style.visibility = "visible";
      setTimeout(() => {
        warning.style.visibility = "hidden";
      }, 1200);
    } else {
      let attempt = Array.from(currentGuess.toUpperCase());
      currentGuess = "";
      compareWords(wordParts, attempt);
    }
  }

  async function commitWord() {
    validateWord(currentGuess);
  }

  async function compareWords(wordOTD, myWord) {
    let correct = 0;
    let testArr = [];
    let testArr1 = [];
    let x = [];
    for (i = 0; i < 5; i++) {
      if (myWord[i] === wordOTD[i]) {
        letters[boxN].style.backgroundColor = "#115204";
        correct++;
        testArr.push("-");
        testArr1.push("+");
        if (correct === 5) {
          winner.style.visibility = "visible"; //TODO
          winCond = 1;
        }
      } else if (myWord[i] != wordOTD[i]) {
        testArr.push(myWord[i]);
        testArr1.push(wordOTD[i]);
        letters[boxN].style.backgroundColor = "#3a3a3a";
      }
      boxN++;
    }
    const matchesYell = testArr1.filter((element) => testArr.includes(element));

    for (i = 0; i < matchesYell.length; i++) {
      let y = testArr.indexOf(matchesYell[i]);
      if (y >= 0) {
        x.push(y);
        testArr[y] = "-";
      }
    }
    for (i = 0; i < x.length; i++) {
      let y = x[i];
      letters[y + attCounter].style.backgroundColor = "#998200";
    }
    for (let i = 0; i < testArr.length; i++) {
      let element = testArr[i];
      let test = wordParts.indexOf(element);
      if (element.match(/^[\p{Letter}]$/u) && test === -1) {
        let greyOut = document.getElementById(element);
        greyOut.style.backgroundColor = "#2b2b2b";
      }
    }
    attCounter += 5;
    if (attCounter === 30 && correct != 5) {
      lost.innerHTML = "WORD WAS: " + word;
      lost.style.visibility = "visible";
    }
  }
}
init();

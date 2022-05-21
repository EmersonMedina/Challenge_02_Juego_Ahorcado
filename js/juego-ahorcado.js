//Variables 
const btnStartGame = document.querySelector('.btnStartGame'); 
const btnAddWord = document.querySelector('.btnAddWord');
const keyboard = document.querySelector('#keyboard');
const keys = document.querySelectorAll('.key'); 

const imgHangMan = document.querySelector('.containerImages img'); 
const errorMessages = document.querySelector('.errorMessages'); 
const main = document.querySelector('main');
const containerButtons = document.querySelector('.containerButtons');  

let selectedWord = ''; 
let numberError = 0; 
let correctLetters = 0; 
let enableGame = false; 
let refreshImage; 
let wrongLetters = []; 
let selectedWordPosition; 

const words = []; 
words.push("JAVASCRIPT"); 
words.push("CSS");
words.push("HTML"); 
words.push("CHALLENGE"); 
words.push("LATAM"); 
words.push("HONDURAS"); 
words.push("MASCOTA");
words.push("TECLADO"); 
words.push("ALURA"); 
words.push("TESTING"); 

//Events 
document.addEventListener('keydown', (event) => {
    if (enableGame) {    
        var keyValue = event.key.toUpperCase();
        var codeValue = event.code;
        
        if (codeValue.includes('Key') || codeValue.includes('Semicolon')) {
            VerifyWord(keyValue); 
        }
    }
/*
    console.log("keyValue: " + keyValue);
    console.log("codeValue: " + codeValue);
    console.log(event);
  */
}, false);

//Eventos para las teclas del teclado
keys.forEach(key => {
    key.addEventListener('click',() => {
        if (enableGame) {    
            VerifyWord(key.value);    
        }
    }); 
}); 

btnStartGame.addEventListener('click', () => {
    clearInterval(refreshImage);
    ClearErrorMessages();
    ClearWords();

    correctLetters = 0;

    keyboard.classList.add('dp-flex'); 
    keyboard.classList.remove('dp-none');

    errorMessages.style.display = 'block';
    errorMessages.style.color = 'rgb(184, 40, 40)';
    wrongLetters = [];

    imgHangMan.src = ''; 
    imgHangMan.alt = ''; 
    
    CreateGameBoard();

    CreateMainButtons();

    console.log(words); 

})

btnAddWord.addEventListener('click', () => {
    clearInterval(refreshImage);
    CreateBtnsAddWord(); 

    const btnSaveAndStart = document.querySelector('.btnSaveAndStart'); 
    const btnCancel = document.querySelector('.btnCancel');
    const inputNewWord = document.querySelector('.inputNewWord');
     
    inputNewWord.classList.remove('dp-none');
    containerButtons.classList.add('flex-row') 

    btnSaveAndStart.classList.add('btnSameSize');
    btnCancel.classList.add('btnSameSize');

    inputNewWord.focus();

    btnSaveAndStart.addEventListener('click', () => {
        clearInterval(refreshImage);
        correctLetters = 0;

        errorMessages.style.display = 'block';
        errorMessages.style.color = 'rgb(184, 40, 40)';
        wrongLetters = [];

        errorMessages.classList.remove('dp-none');

        const checkWhiteSpaces = /\s/; 
        const checkNumbers = /[0-9]/
        const checkAccents = /[\u00C0-\u017F]/
        const checkSpecialCharacters =/[a-zA-Z]/; 
        let hasError = false; 

        ClearErrorMessages();

        if(inputNewWord.value === '') {
            const mensaje = CreateElement('p'); 
            mensaje.textContent = 'Debes ingresar una palabra'; 
            errorMessages.appendChild(mensaje);
            hasError = true;      
        }

        if (checkAccents.test(inputNewWord.value)) {
            const mensaje = CreateElement('p'); 
            mensaje.textContent = 'La palabra no puede contener acentos'; 
            errorMessages.appendChild(mensaje);
            hasError = true;  
        }

        for (let i = 0; i < inputNewWord.value.length; i++) {
            if (!checkSpecialCharacters.test(inputNewWord.value[i])) {
                const mensaje = CreateElement('p'); 
                mensaje.textContent = 'La palabra no puede contener caracteres especiales'; 
                errorMessages.appendChild(mensaje);
                hasError = true;  
                i = inputNewWord.value.length; 
            }    
        }
        
        if (checkWhiteSpaces.test(inputNewWord.value)) {
            const mensaje = CreateElement('p'); 
            mensaje.textContent = 'La palabra no puede contener espacios en blanco'; 
            errorMessages.appendChild(mensaje);
            hasError = true;  
        }
        
        if (checkNumbers.test(inputNewWord.value)) {
            const mensaje = CreateElement('p'); 
            mensaje.textContent = 'La palabra solo puede contener letras'; 
            errorMessages.appendChild(mensaje); 
            hasError = true;  
        }

        if (hasError) {
            return; 
        } else {
            enableGame = true; 
            numberError = 0; 

            inputNewWord.classList.add('dp-none');
            keyboard.classList.add('dp-flex'); 
            keyboard.classList.remove('dp-none');
            
            let inputNewWordToUpper = inputNewWord.value.toUpperCase();
            console.log(words);

            SaveAndStart(inputNewWordToUpper); 
            inputNewWord.value = '';
        }

    }); 

    btnCancel.addEventListener('click', ()=> {
        numberError = 0; 
        correctLetters = 0;
        enableGame = false;
        ClearErrorMessages();
        CreateMainView();
    }); 
    
}); 

//Functions 

function RandomNumber(max, min = 0) {
    let number =  Math.floor((Math.random() * (max - min + 1)) + min);

    return number; 
}

function ShowMainSections() {
    const sectGameBoard = document.querySelector('.gameBoard'); 
    const sectErrorMessages = document.querySelector('.errorMessages'); 

    sectGameBoard.classList.remove('dp-none'); 
    sectErrorMessages.classList.remove('dp-none'); 
}

function VerifyWord(word) {
    console.log(word);
    console.log(selectedWord);

    while (selectedWord.includes(word)){ 
        for (let i = 0; i<selectedWord.length; i++) {
            if (selectedWord[i] === word) {
                correctLetters++; 
                selectedWord = selectedWord.replaceAt(i, '0'); 
                console.log('La letra SI está en la palabra');
                InsertWord(i, word);   
            } 
        }            
    }
    
    if (correctLetters == words[selectedWordPosition].length ) {
        Winner(); 
    }

    if (words[selectedWordPosition].includes(word)){ 
        return; 
    }

    if (!wrongLetters.includes(word)){ 
        wrongLetters.push(word);
    } else {
        alert(`La letra ${word} ya ha sido ingresada`);
        return;
    }

    ClearErrorMessages(); 
    wrongLetters.forEach(letter => {
        let span = CreateElement('span'); 
        span.textContent = letter; 
        errorMessages.appendChild(span); 
    }); 

    numberError++; 
    ErrorInWord(numberError); 
    console.log('La letra NO está en la palabra'); 
}

function Winner() {
    enableGame = false;
    correctLetters = 0; 
    ClearErrorMessages(); 
    errorMessages.style.display = 'flex';

    const imgWin = CreateElement('img'); 
    imgWin.src = 'images/win.png'; 
    imgWin.alt = 'imagen ganador'; 

    const winMessage = CreateElement('p'); 
    winMessage.textContent = `Ganaste, Felicidades!`; 

    errorMessages.style.color = '#73C118';
    errorMessages.appendChild(imgWin);
    errorMessages.appendChild(winMessage); 
}


function InsertWord(position, word) {
    let words = document.querySelectorAll('.words span');
    
    words[position].textContent = word;     
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function SaveAndStart(inputNewWord) {
   words.push(inputNewWord);  

   imgHangMan.src = ''; 
   imgHangMan.alt = ''; 

   console.log(words);
   CreateGameBoard();
   CreateMainButtons();
}; 

function resizeImage(){ 
    imgHangMan.style.width = '37%';
}

/* Creates */
function CreateMainView() {
    const sectGameBoard = document.querySelector('.gameBoard'); 
    const sectErrorMessages = document.querySelector('.errorMessages'); 
    
    const inputNewWord = document.querySelector('.inputNewWord');
    inputNewWord.classList.add('dp-none');

    sectGameBoard.classList.add('dp-none'); 
    sectErrorMessages.classList.add('dp-none');

    ClearContainerButtons();
    

    containerButtons.classList.remove('flex-row');
    containerButtons.classList.add('flex-column');

    containerButtons.appendChild(btnStartGame); 
    containerButtons.appendChild(btnAddWord); 

}

function CreateElement(itemType) {
    let element = document.createElement(itemType);
    return element; 
}

function CreateMainButtons() {
    const btnNewGame = CreateElement('button'); 
    const btnDesist = CreateElement('button'); 

    btnNewGame.textContent = 'Nuevo Juego'; 
    btnDesist.textContent = 'Desistir'

    btnNewGame.classList.add('btn', 'btnPrincipal', 'btnNewGame', 'btnSameSize');
    btnDesist.classList.add('btn', 'btnSecondary', 'btnDesist', 'btnSameSize');

    containerButtons.classList.add('flex-row');
    containerButtons.appendChild(btnNewGame); 
    containerButtons.appendChild(btnDesist);

    const buttonNewGame = document.querySelector('.btnNewGame');
    const buttonDesist = document.querySelector('.btnDesist'); 

    buttonNewGame.addEventListener('click', () => {
        enableGame = true;
        correctLetters = 0;
        resizeImage();
        ClearErrorMessages();
        clearInterval(refreshImage);
        numberError = 0; 

        keyboard.classList.add('dp-flex'); 
        keyboard.classList.remove('dp-none');
    
        errorMessages.style.display = 'block';
        errorMessages.style.color = 'rgb(184, 40, 40)';
        wrongLetters = []; 

        imgHangMan.src = ''; 
        imgHangMan.alt = ''; 
        
        ClearWords();
        
        const divWord = document.querySelector('.words'); 
        divWord.classList.add('txt-center'); 
    
        let position = RandomNumber(words.length - 1 ); 
    
        selectedWordPosition = position;
        selectedWord = words[position];
        console.log(words);
        let selectedWordArray = Array.from(selectedWord); 

        for (word of selectedWordArray) {
            let span = CreateElement('span');
    
            span.textContent = "_";
            divWord.appendChild(span);
        }
    }); 

    buttonDesist.addEventListener('click', () => {
        resizeImage();
        ClearErrorMessages();
        clearInterval(refreshImage);

        keyboard.classList.add('dp-none'); 
        keyboard.classList.remove('dp-flex');
    
        numberError = 0; 
        correctLetters = 0;
        enableGame = false;
        CreateMainView();
    }); 
}

function CreateBtnsAddWord() {
    ClearContainerButtons(); 
    const btnSaveAndStart = CreateElement('button'); 
    const btnCancel = CreateElement('button'); 

    btnSaveAndStart.textContent = 'Guardar y empezar';
    btnCancel.textContent = 'Cancelar';  

    btnSaveAndStart.classList.add('btn', 'btnPrincipal', 'btnSaveAndStart'); 
    btnCancel.classList.add('btn', 'btnSecondary', 'btnCancel'); 

    containerButtons.appendChild(btnSaveAndStart); 
    containerButtons.appendChild(btnCancel); 
}

function CreateGameBoard ()  {
    enableGame = true; 
    ClearWords();
    ClearContainerButtons();
    ShowMainSections(); 

    const divWord = document.querySelector('.words'); 
    divWord.classList.add('txt-center'); 

    selectedWordPosition = RandomNumber(words.length - 1); 

    selectedWord = words[selectedWordPosition];
    console.log(selectedWordPosition);
    console.log(selectedWord); 
    let selectedWordArray = Array.from(selectedWord); 

    for (word of selectedWordArray) {
        let span = CreateElement('span');

        span.textContent = "_";
        divWord.appendChild(span);
    }
}

/*Clears*/ 

function ClearContainerButtons() {
    while (containerButtons.firstChild) {
        containerButtons.removeChild(containerButtons.firstChild); 
    }
}

function ClearMain() {
   sectGameBoard
}

function ClearWords() { 
    const divWord = document.querySelector('.words');
    while (divWord.firstChild) {
        divWord.removeChild(divWord.firstChild);
    } 
}

function ClearButtonsMain() {
   btnStartGame.remove();
   btnAddWord.remove();  
}   

/*Hangman drawing and mistakes*/

function ShowVerticalPole() {
    imgHangMan.alt = 'Imagen del personaje'; 
    imgHangMan.src = 'images/static-hangman-01.png'; 
}; 

function ShowHorizontalPole() {
    imgHangMan.src = 'images/static-hangman-02.png';
}; 

function ShowHead() {
    imgHangMan.src = 'images/static-hangman-03.png';
};

function ShowTrunk() {
    imgHangMan.src = 'images/static-hangman-04.png';
};

function ShowLeftHand() {
    imgHangMan.src = 'images/static-hangman-05.png';
};

function ShowRightHand() {
    imgHangMan.src = 'images/static-hangman-06.png';
};

function ShowLeftLeg() {
    imgHangMan.src = 'images/static-hangman-07.png';
};

function ShowRightLeg() {
    imgHangMan.src = '';
    imgHangMan.style.width = '100%';
    imgHangMan.src = 'images/hangman-final.gif';
    refreshImage = setInterval(function () {
        imgHangMan.src = 'images/hangman-final.gif';
    }, 4470);
};


function ErrorInWord(numberError){ 
    switch(numberError) {
        case 1:
            ShowVerticalPole(); 
            break; 
        case 2: 
            ShowHorizontalPole(); 
            break; 
        case 3: 
            ShowHead(); 
            break; 
        case 4: 
            ShowTrunk(); 
            break;
        case 5: 
            ShowLeftHand(); 
            break;
        case 6: 
            ShowRightHand(); 
            break;
        case 7: 
            ShowLeftLeg(); 
            break;
        case 8: 
            ShowRightLeg();
            GameOver();  
            break;  
    }
}; 

function ClearErrorMessages () {
    while (errorMessages.firstChild) {
        errorMessages.removeChild(errorMessages.firstChild); 
    }
}

function GameOver() {
    enableGame = false;
    correctLetters = 0;
    ClearErrorMessages(); 
    errorMessages.style.display = 'flex';

    const imgGameOver = CreateElement('img'); 
    imgGameOver.src = 'images/game-over.png'; 
    imgGameOver.alt = 'imagen game over'; 

    const gameOverMessage = CreateElement('p'); 
    gameOverMessage.textContent = `Intentalo de nuevo, la palabra correcta era: ${words[selectedWordPosition]}`; 

    errorMessages.appendChild(imgGameOver);
    errorMessages.appendChild(gameOverMessage); 
}

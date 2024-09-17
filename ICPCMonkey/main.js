import { words as INITIAL_WORDS } from './data.js'

const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('input');
const $game = document.querySelector('#game')
const $results = document.querySelector('#results')
const $wpm = $results.querySelector('#results-wpm')
const $accuracy = $results.querySelector('#results-accuracy')
const $button = document.querySelector('#play-again-button')

const INITIAL_TIME = 30;
//const TEXT = 'void dfs(int s){ if(visited[s]==true) return; visited[s] = true; vector<int> ::iterator i; for(i = adj[s].begin(); i<adj[s].end();++i){ if(!visited[*i]){ dfs(*i); }}';
    
let words = [];
let currentTime = INITIAL_TIME;

initGame()
initEvents()


// Note: Functions are load in memory at the 
// beginning of the script

function initGame(){
    $game.style.display = 'flex'
    $results.style.display = 'none'
    $input.value = ''

    words = INITIAL_WORDS.toSorted(() => Math.random()-0.5).slice(0,32)
    currentTime = INITIAL_TIME
    $time.textContent = currentTime
    //$paragraph.textContent = words.map(word => word + ' ').join('')
    $paragraph.innerHTML = words.map((word, index) =>{
        const letters = word.split('')

        return `<word>
        ${letters.map(letter => `<letter>${letter}</letter>`).join('')}
        </word>
        `
    }).join('')

    const $firstWord = $paragraph.querySelector('word')
    
    $firstWord.classList.add('active')
    $firstWord.querySelector('letter').classList.add('active')


    const intervalId = setInterval(()=>{
        currentTime--
        $time.textContent = currentTime
        if(currentTime === 0){
            clearInterval(intervalId)
            gameOver()
        }
    }, 1000)
}
function initEvents(){
    document.addEventListener('keydown', ()=>{
        $input.focus()
    })

    $input.addEventListener('keydown',onKeyDown)
    $input.addEventListener('keyup', onKeyUp)
    $button.addEventListener('click',initGame)

}

function onKeyDown(event){
    const {key} = event
    const $currentWord = $paragraph.querySelector('word.active')
    const $currentLetter = $currentWord.querySelector('letter.active')

    if(key === ' '){
        event.preventDefault()

        const $nextWord = $currentWord.nextElementSibling
        const $nextLetter = $nextWord.querySelector('letter')

        $currentWord.classList.remove('active','marked')
        $currentLetter.classList.remove('active')

        $nextWord.classList.add('active')
        $nextLetter.classList.add('active')

        $input.value = ''
        const isWordCorrect = $currentWord.querySelectorAll('letter:not(.correct)').length > 0
        
        const classToAdd = isWordCorrect ? 'marked' : 'correct'
        $currentWord.classList.add(classToAdd)
        return
    }

    if(key === 'Backspace'){
        const $prevWord = $currentWord.previousElementSibling
        const $prevLetter = $currentLetter.previousElementSibling
        if(!$prevWord && !$prevLetter){
            event.preventDefault()
            return
        }

        const $wordMarked = $paragraph.querySelector('word.marked')
        if($wordMarked && !$prevLetter){
            event.preventDefault()
            $prevWord.classList.remove('marked')
            $prevWord.classList.add('active')

            const $toGo = $prevWord.querySelector('letter:last-child')
            $currentLetter.classList.remove('active')
            $toGo.classList.add('active')

            $input.value = [... $prevWord.querySelectorAll('letter.correct','letter.incorrect')].map($el => {return $el.classList.contains('correct')? $el.innerText : 'ñ'}).join('')
        }
    }
}

function onKeyUp(){
    // recover current elements
    const $currentWord = $paragraph.querySelector('word.active')
    const $currentLetter = $currentWord.querySelector('letter.active')

    const currentWord = $currentWord.innerText.trim()
    $input.maxLength = currentWord.length
    console.log({currentWord})

    const $allLetters = $currentWord.querySelectorAll('letter')
    $allLetters.forEach($letter => $letter.classList.remove('correct','incorrect'))
    
    $input.value.split('').forEach((char,i) =>{
        const $letter = $allLetters[i]
        const letterToCheck = currentWord[i]

        const isCorrect = char === letterToCheck
        const letterClass = isCorrect ? 'correct' : 'incorrect'
        $letter.classList.add(letterClass)
    })

    $currentLetter.classList.remove('active','last')

    const inputLength = $input.value.length
    const $nextActLetter = $allLetters[inputLength]

    if($nextActLetter){
        $nextActLetter.classList.add('active')
    }else{
        $currentLetter.classList.add('active','last')
    }
}

function gameOver(){
    $game.style.display = 'none'
    $results.style.display = 'flex'

    const correctWords = $paragraph.querySelectorAll('word.correct').length
    const correctLetters = $paragraph.querySelectorAll('letter.correct').length
    const incorrectLetters = $paragraph.querySelectorAll('letter.incorrect').length

    const totalLetters = correctLetters + incorrectLetters
    const accuracy = totalLetters > 0 ? (correctLetters / totalLetters)*100 : 0
    const wpm = (correctWords * 60)/INITIAL_TIME
    $wpm.textContent = wpm
    $accuracy.textContent = `${accuracy.toFixed(2)}%`
}
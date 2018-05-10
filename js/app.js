/*
 * Create a list that holds all of your cards
 */
const deck = [ {suit: "diamond"}, {suit: "diamond"}, {suit: "paper-plane-o"}, {suit: "paper-plane-o"},
               {suit: "anchor"}, {suit: "anchor"}, {suit: "bolt"}, {suit: "bolt"},
               {suit: "cube"}, {suit: "cube"}, {suit: "leaf"}, {suit: "leaf"},
               {suit: "bicycle"}, {suit: "bicycle"}, {suit: "bomb"}, {suit: "bomb"} ];

// create new array for the shuffled deck
let shuffledDeck = [];
// create new array for the 'open' cards
let openList = [];
// timer variables
let seconds = 0, minutes = 0, t, timerHasStarted = false;
// grab time tag
const timerWrap = document.querySelector('time');

// grab card table
const cardTable = document.querySelector('section.deck');
// grab restart button
const restart = document.querySelector('.restart');
// grab move counter
const moveCounter = document.querySelector('.moves');
// grab move counter label
const moveCounterLabel = document.querySelector('.moves-label');
// grab stars
const stars = document.querySelectorAll('i.fa-star');
// grab congratulations popup modal
const modal = document.querySelector(".modal");
// grab congratulations popup modal close button
const modalCloseBtn = document.querySelector(".close-button");
// grab modal 'play again' button
const playAgainBtn = document.querySelector("#playAgainBtn");


/*
 * Display the cards on the page
 */
deal(deck);



/*
 *******************************************
 * Event Listeners
 *******************************************
 */

// restart button click event listener
restart.addEventListener('click', function() {
  deal(deck);
});

// card click event listener
cardTable.addEventListener('click', function(e) {
  /* If a card is clicked: */
  if (e.target.classList.contains('card') && !e.target.classList.contains('open')) {
    if(!timerHasStarted) {
      timer();
      timerHasStarted = true;
    }
    let card = e.target;
    /* display the card's symbol (put this functionality in another function that you call from this one) */
    flip(card);
    /* add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) */
    addToOpenList(card);
    /* if the list already has another card, check to see if the two cards match */
    if (openList.length === 2) {
      disableCardClicks();
      /* increment the move counter and display it on the page (put this functionality in another function that you call from this one) */
      addMove(moveCounter);
      let cardOne = openList[0].querySelector('i').classList.item(1);
      let cardTwo = openList[1].querySelector('i').classList.item(1);
      if (cardOne === cardTwo) {
        /* if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one) */
        lockMatch(openList);
        /* if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one) */
        checkforCompleteGame();
      } else {
        /* if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) */
        endTurn(openList);
      }
    }
  }
});

// play again button click event Listener
playAgainBtn.addEventListener("click", function() {
  toggleModal();
  deal(deck);
})

// modal close button click event listener
modalCloseBtn.addEventListener("click", toggleModal);

// modal close on background screen click event listener
window.addEventListener("click", windowOnClick);



/*
 *******************************************
 * Functions
 *******************************************
 */


// function - deal deck
function deal(deck) {
  // clear out array of 'open' cards if any elements exist
  if (openList.length) {
    openList = [];
  }
  // reset timer
  resetTimer();
  // reset star rating
  for(star of stars) {
    star.classList.add('earned');
  }
  // reset move moveCounter
  moveCounter.textContent = 0;
  moveCounterLabel.textContent = "Moves";
  // shuffle the list of cards using the provided "shuffle" method below
  shuffledDeck = shuffle(deck);
  // loop through each card and create its HTML
  const fragment = document.createDocumentFragment();
  for (const card of shuffledDeck) {
    const newCard = document.createElement('div');
    const cardFront = document.createElement('div');
    const cardBack = document.createElement('div');
    const cardIcon = document.createElement('i');
    const cardFrontCls = ["card__side", "card__side--front"];
    const cardBackCls = ["card__side", "card__side--back"];
    let iconCls = ["fa", "fa-" + card.suit];
    newCard.classList.add('card');
    newCard.appendChild(cardFront);
    newCard.appendChild(cardBack);
    cardFront.classList.add(...cardFrontCls);
    cardBack.classList.add(...cardBackCls);
    cardIcon.classList.add(...iconCls);
    cardBack.appendChild(cardIcon);
    fragment.appendChild(newCard);
  }
  // clear table of old cards
  cardTable.innerHTML = "";
  // add each card's HTML to the page
  cardTable.appendChild(fragment);
}

// function - flip selected card over
function flip(card) {
  card.classList.add('open');
}

// function - add flipped card to array of 'open' cards
function addToOpenList(card) {
  openList.push(card);
}

// function - lock the matched cards into place
function lockMatch(cards) {
  for (card of cards) {
    card.classList.add('match');
  }
  openList = [];
  enableCardClicks();
}

// function - terminate player's turn
function endTurn(cards) {
  for (card of cards) {
    card.classList.add('shake');
  }
  window.setTimeout(clear, 1000, cards);
}

// function - shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// function - increment move counter
function addMove(moveCounter) {
  let moves = moveCounter.textContent;
  moves++;
  if (moves === 1) {
    moveCounterLabel.textContent = "Move";
  } else {
    moveCounterLabel.textContent = "Moves";
  }
  switch (moves) {
    case 13:
      stars[4].classList.remove('earned');
    break;
    case 15:
      stars[3].classList.remove('earned');
    break;
    case 17:
      stars[2].classList.remove('earned');
    break;
    case 19:
      stars[1].classList.remove('earned');
  }
  moveCounter.textContent = moves;
}

// function - check to see if all cards have been matched
function checkforCompleteGame() {
  // grab all cards
  const cards = document.querySelectorAll('.card');
  let i = 0;
  for (card of cards) {
    if (card.classList.contains('match')) {
      i++;
    }
  }
  if (i === 16) {
    clearTimeout(t);
    window.setTimeout(gameOver, 1000);
  }
}

// function - complete game
function gameOver() {
  let modalTime = document.querySelector(".modal-stats-time");
  let modalMoves = document.querySelector(".modal-stats-moves");
  let modalStars = document.querySelector(".modal-stats-stars");
  let modalStarsEarned = document.querySelectorAll("i.earned");
  // let modalTimeMinutes = minutes === 0 ? "" : minutes + " minutes and ";
  let modalTimeMinutes = minutes === 0 ? "" : minutes + (minutes === 1 ? " minute" : " minutes") + " and ";

  modalTime.textContent = modalTimeMinutes + seconds + " seconds";
  modalMoves.textContent = moveCounter.textContent + " moves";
  modalStars.textContent = modalStarsEarned.length + " out of 5 stars";
  toggleModal();

}

// function - signal mismatch and turn cards back over
function clear(cards) {
  for (card of cards) {
    card.classList.remove('open', 'shake');
  }
  openList = [];
  enableCardClicks();
}

// function - stop players from flipping additional cards while player's choices are being evaluated
function disableCardClicks() {
  const cards = document.querySelectorAll('.card')
  for (card of cards) {
    card.classList.add('disabled');
  }
}

// function - resume the 'clickability' of card deck
function enableCardClicks() {
  const cards = document.querySelectorAll('.card')
  for (card of cards) {
    card.classList.remove('disabled');
  }
}

// function - open/close Congratulations popup
function toggleModal() {
  modal.classList.toggle("show-modal");
}

// function - close modal if background screen is clicked
function windowOnClick(event) {
  if (event.target === modal) {
      toggleModal();
  }
}

// function - adding time to timer
function add() {
  seconds++;
  if(seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  timerWrap.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" +
                          (seconds > 9 ? seconds : "0" + seconds);
  timer();
}

// function - start timer
function timer() {
  t = setTimeout(add, 1000);
}

// function - reset timer
function resetTimer() {
  clearTimeout(t);
  timerWrap.textContent = "00:00";
  seconds = 0;
  minutes = 0;
  timerHasStarted = false;
}














/*
 *******************************************
 * Local Storage Stuff
 *******************************************
 */

if(storageAvailable('localStorage')) {
  console.log('local storage is available!!!');
} else {
  console.log('Boo, local storage is not available');
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0;
    }
}

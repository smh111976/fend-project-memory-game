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
// grab card table
const cardTable = document.querySelector('section.deck');
// grab restart button
const restart = document.querySelector('.restart');
// grab move counter
const moveCounter = document.querySelector('.moves');
// grab move counter label
const moveCounterLabel = document.querySelector('.moves-label');


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
    let card = e.target;
    /* display the card's symbol (put this functionality in another function that you call from this one) */
    flip(card);
    /* add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) */
    addToOpenList(card);
    /* if the list already has another card, check to see if the two cards match */
    if (openList.length == 2) {
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
  return openList;
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
    window.setTimeout(gameOver, 1000);
  }
}

// function - complete game
function gameOver() {
  alert('YOU WIN!!!');
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

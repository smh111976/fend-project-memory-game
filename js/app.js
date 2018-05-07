/*
 * Create a list that holds all of your cards
 */
 const deck = [
   {suit: "diamond"}, {suit: "diamond"}, {suit: "paper-plane-o"}, {suit: "paper-plane-o"},
   {suit: "anchor"}, {suit: "anchor"}, {suit: "bolt"}, {suit: "bolt"},
   {suit: "cube"}, {suit: "cube"}, {suit: "leaf"}, {suit: "leaf"},
   {suit: "bicycle"}, {suit: "bicycle"}, {suit: "bomb"}, {suit: "bomb"}
 ];
 // deck table
 const deckTable = document.querySelector('section.deck');
 // new array for the shuffled deck
 let shuffledDeck = [];
 // restart button
 const restart = document.querySelector('.restart');
 // Restart button click event listener
 restart.addEventListener('click', function(e) {
   deal(deck);
 });



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
 deal(deck);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Lay Out the Deck function
function deal(deck) {
  // shuffle deck of cards
  shuffledDeck = shuffle(deck);
  const fragment = document.createDocumentFragment();
  for(const card of shuffledDeck) {
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
  deckTable.innerHTML = "";
  deckTable.appendChild(fragment);
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 deckTable.addEventListener('click', function(e) {
   e.target.classList.add('open');
   if(e.target.classList.contains('card')) {
     e.target.classList.add('open');
     console.log('is card');
   }
 });

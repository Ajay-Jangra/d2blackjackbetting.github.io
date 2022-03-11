// challenge 5 blackjack

// authantication 

// firebase.auth().onAuthStateChanged((user) => {
//   if (!user) {
//     location.replace("../auth/index.html");
//   }  
// });

// function logout() {
//   firebase.auth().signOut();
// }
 



//side bar
function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}


function howToPlay(){
   var setDisplay = document.getElementById("howtoplay").style.display ;

   if(setDisplay==="block"){
     setDisplay="none";
   }else{
     setDisplay="block";
   }
   document.getElementById("howtoplay").style.display= setDisplay;
}

function openContacts(){
   var setContacts = document.getElementById("contacts").style.display;

   if (setContacts === "block") {
     setContacts = "none";
   } else {
     setContacts = "block";
   }
   document.getElementById("contacts").style.display = setContacts;
}





 
// this is a object which is store the ides of you and dealer
//   scoreSpan is refrence to  span tag after you

let blackjackGame = {
  // set of object   states
  you: { scoreSpan: "#your-blackjack-result", div: "#your-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isHit: false,
  isStand: true,
  turnsOver: false,


};

const YOU = blackjackGame["you"]; // it give you object
const DEALER = blackjackGame["dealer"]; // it gives dealer object
 
const hitSound = new Audio("../static/sounds/swish.mp3");
const winSound = new Audio("../static/sounds/cash.mp3");
const lossSound = new Audio("../static/sounds/aww.mp3");
const drawSound = new Audio("../static/sounds/bad.mp3");   // draw sound 
// event listener
document
  .querySelector("#blackjack-hit-button")
  .addEventListener("click", blackjackHit);

document
  .querySelector("#blackjack-stand-button")
  .addEventListener("click", blackjackStand);

document
  .querySelector("#blackjack-deal-button")
  .addEventListener("click", blackjackDeal);

// all fxns
//  on hit button click
function blackjackHit() {
  if (blackjackGame["isHit"] === false) {
    // this make disable hit button after click on stand button
    let card = randomCard();
    showCard(YOU, card);
    updateScore(YOU, card);
    showScore(YOU);
  }
}

//   sleep for one second  means  the dealer next card shows after 1 sec
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// dealer logic

async function blackjackStand() {
  if(blackjackGame['isStand']===true){
     blackjackGame["isHit"] = true;
     //  declare winner when dealer goes more then 15
     while (DEALER["score"] < 16 && blackjackGame["isHit"] === true) {
       let card = randomCard();
       showCard(DEALER, card);
       updateScore(DEALER, card);
       showScore(DEALER);
       await sleep(500);
     }
     blackjackGame["isStand"] = false;
     blackjackGame["turnsOver"] = true;
     let winner = computeWinner();
     showResult(winner); 
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame.cards[randomIndex];
}

function showCard(activePlayer, card) {
  // if the score is <= 21 only then show new card  bust case same thing will do for show score
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    //  cardImage.src = "static/images/"+card+".png";
    cardImage.src = `../static/images/${card}.png`;
    document.querySelector(activePlayer.div).appendChild(cardImage);
    hitSound.play();
  }
}

function updateScore(activePlayer, card) {
  // if adding 11 keeps me below 21 , add 11 in current score else add 1
  if (card === "A") {
    if (activePlayer["score"] + blackjackGame["cardMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardMap"][card][0];
    }
  } else activePlayer["score"] += blackjackGame["cardMap"][card];
  // console.log(activePlayer["score"]);
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
}

// deleting the all imag  means reset the game reset score and its color
function blackjackDeal() {
  if (blackjackGame["turnsOver"] === true) {
    blackjackGame["isHit"] = false;
    blackjackGame["isStand"] = true;
    blackjackGame["turnsOver"] = false;


    // console.log(blackjackGame["turnsOver"]);
    let yourImages = document
      .querySelector("#your-box")
      .querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");
    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (let i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    YOU["score"] = 0;
    DEALER["score"] = 0;
    document.querySelector(YOU["scoreSpan"]).textContent = 0;
    document.querySelector(YOU["scoreSpan"]).style.color = "rgb(0, 153, 255)";
    document.querySelector(DEALER["scoreSpan"]).textContent = 0;
    document.querySelector(DEALER["scoreSpan"]).style.color =
      "rgb(0, 153, 255)";
    //  change top span content and color after a turn
    document.querySelector("#blackjack-result").style.color =
      "rgb(0, 153, 255)";
    // content
    document.querySelector("#blackjack-result").textContent = "Try Your Luck!";
  }
}

//  compute winner and return who win
// updates the wins ,losses and draws
function computeWinner() {
  let winner;

  if (YOU["score"] <= 21) {
    // higher score than dealer or when dealer busts but you'r not
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackjackGame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      blackjackGame["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      blackjackGame["draws"]++;
    }
    //  cond : when user bust burt dealer doesn't
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    blackjackGame["losses"]++;
    winner = DEALER;

    // cont when both bust
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    blackjackGame["draws"]++;
  }

  return winner;
}

function showResult(winner) {
  if (blackjackGame["turnsOver"] === true) {
    let message, messageColor;
    if (winner === YOU) {
      document.querySelector("#wins").textContent = blackjackGame["wins"];
      message = "You Won!";
      messageColor = "green";
      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackjackGame["losses"];
      message = "You lost!";
      messageColor = "red";
      lossSound.play();
    } else {
      document.querySelector("#draws").textContent = blackjackGame["draws"];
      message = "drew !";
      messageColor = "yellow";
      drawSound.play();
    }

    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
  }
}





 
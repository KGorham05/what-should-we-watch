// update code so when user joins chat they are assigned a color

// on double click of a message, append an emoji heart
// if the heart already exists, put a x2
// on hover over the heart, show who liked the message

$(document).ready(function () {
  // Configure Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCqKTF0CNOTC5nJFuKiFaTaea4-9WRm15I",
    authDomain: "what-should-we-watch-3a9a9.firebaseapp.com",
    databaseURL: "https://what-should-we-watch-3a9a9.firebaseio.com",
    projectId: "what-should-we-watch-3a9a9",
    storageBucket: "what-should-we-watch-3a9a9.appspot.com",
    messagingSenderId: "669042740976",
    appId: "1:669042740976:web:d11bc78cd5693e2c1d7c35",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Global Variables
  const movieData = firebase.database();
  const colorArr = [
    "#FF0000",
    "#FF4000",
    "#FF8000",
    "#FFFF00",
    "#C0FF00",
    "#80FF00",
    "#40FF00",
    "#00FF00",
    "#00FF80",
    "#00FFC0",
    "#00FFFF",
    "#00C0FF",
    "#0080FF",
    "#0040FF",
    "#0000FF",
    "#4000FF",
    "#8000FF",
    "#C000FF",
    "#FF00FF",
    "#FF00C0",
    "#FF0080",
  ];
  let currentColor;
  let currentUser;
  let gif;
  let giphyResponse;
  let sendBtn;
  let shuffleBtn;
  let cancelBtn;
  let gifIterator = 0;

  // when a message is sent, send this data with it
  // when a message is appended to the page, use this value to set the color property

  const genRandomColor = function () {
    return Math.floor(Math.random() * 21);
  };

  // variable to generate a random color for the user when they join
  currentColor = colorArr[genRandomColor()];

  // make the user enter a username into a modal
  $("#un-modal").modal({ backdrop: "static" }, "show");

  $("#un-submit").click(function () {
    // make sure they input something
    const userName = $("#un-input").val().trim();
    if (userName.length) {
      currentUser = userName;
      // add global message when someone joins the chat (refactor send message into a function that takes in a message obj)
      let globalMessage = {
        name: "System",
        message: `${currentUser} has joined the chat`,
        likedBy: []
      };
      movieData.ref("chat").push(globalMessage);
    } else {
      alert("You must input a username to join the chat!");
      return;
    }

    $("#un-modal").modal("toggle");
  });

  // Chat room logic
  // listen for button click
  $("#m-send").click(function (e) {
    e.preventDefault();
    // capture the message
    const message = $("#m").val().trim();

    // check if the message starts with "/giphy"
    if (message.startsWith("/giphy")) {
      const gifToFind = message.split(" ")[1];
      handleGiphy(gifToFind);
      $("#m").val("");
      return;
    }

    // send it to the database
    let messageObj = {
      name: currentUser,
      message: message,
      tColor: currentColor,
      likedBy: [],
    };

    movieData.ref("chat").push(messageObj);
    $("#m").val("");
  });

  // listen for pressing enter
  // Get the input field
  var mInput = $("#m");

  // Execute a function when the user releases a key on the keyboard
  mInput.on("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action
      event.preventDefault();
      // Trigger the button element with a click
      $("#m-send").click();
    }
  });

  const scrollToBottom = function () {
    $(".messages-area").scrollTop($(".messages-area")[0].scrollHeight);
  };

  // listen for any changes to the database and add them to the page
  movieData.ref("chat").on("child_added", function (childSnapshot) {
    const name = childSnapshot.val().name;
    const mText = childSnapshot.val().message;
    const tColor = childSnapshot.val().tColor;
    const likedBy = childSnapshot.val().likedBy;
    const key = childSnapshot.key;
    const chatBubble = $("<div class='chat-bubble'>");
    const nameStamp = $("<p class='name-stamp'>").text(name);
    const message = $("<p class='message-text'>").text(mText);

    // add alternating colors to users who join
    nameStamp.attr("style", `color: ${tColor}`);

    // check if the message is a gif
    if (mText === "gif") {
      const img = $("<img class='gif'>").attr(
        "src",
        childSnapshot.val().gifSrc
      );

      chatBubble.attr("data-heart", "false");
      chatBubble.attr("data-key", key);
      chatBubble.append(nameStamp);
      chatBubble.append(img);
      
      // duplicate liking logic here -> refactor later

      $("#messages").append(chatBubble);
      scrollToBottom();
      return;
    };

    // check if the message is a system message
    if (name === "System") {
      nameStamp.attr("style", "color: black");
      // change the styling by adding a system-message class to it
      nameStamp.removeClass("name-stamp");
      message.removeClass("message-text");
      nameStamp.addClass("system-name");
      message.addClass("system-text");
    }

    // chatBubble.attr("data-heart", "false");
    chatBubble.attr("data-key", key);
    chatBubble.append(nameStamp);
    chatBubble.append(message);
    


    $("#messages").append(chatBubble);
    // check if anyone liked the message
    if (likedBy) {
      // if they did, append a heart + message of who liked it
      let heart = $("<p>").text(`❤️ ${likedBy} Liked this`);
      $("#messages").append(heart);
    }
    scrollToBottom();
  });

  // listen for update to a child, ie when someone likes a message
  movieData.ref("chat").on("child_changed", function (childSnapshot) {
    // locate the chat bubble being updated
    let messageToUpdate = $(".chat-bubble[data-key='" + childSnapshot.key + "']");
    let heart = $("<p>").text(`❤️ ${childSnapshot.val().likedBy} Liked this`);
    heart.insertAfter(messageToUpdate);
    
  });

  // listen for double click to chat bubble
  $("body").on("dblclick", ".chat-bubble", function () {

    // get the message key from the element clicked on
    const messageKey = $(this).data("key")
    // use it to update that child element with the currentUser TODO change update to not delete previous likes

    movieData.ref("chat").child(messageKey).update({likedBy: currentUser})

  });

  const handleGiphy = function (searchTerm) {
    const queryURL =
      "https://api.giphy.com/v1/gifs/search?q=" +
      searchTerm +
      "&limit=10&rating=pg&api_key=E4GmjIzr95bf7cgs50n05QPKhxsZ1ZZh";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // create an img to hold the gif
      gif = $("<img class='gif'>");
      giphyResponse = response;
      // set the image src = the first gif in the response array
      gif.attr("src", giphyResponse.data[gifIterator].images.fixed_width.url);
      // create Send Button
      sendBtn = $(
        "<button id='send-btn'class='btn btn-success gif-btn'>Send</button>"
      );
      // create Shuffle Button
      shuffleBtn = $(
        "<button id='suffle-btn' class='btn btn-secondary gif-btn'>Shuffle</button>"
      );
      // create Cancel Button
      cancelBtn = $(
        "<button id='cancel-btn' class='btn btn-danger gif-btn'>Cancel</button>"
      );

      $("#messages")
        .append(gif)
        .append(sendBtn)
        .append(shuffleBtn)
        .append(cancelBtn);

      scrollToBottom();
    });
  };

  // if user clicks send, send the gif as a message to the DB and remove the buttons
  $("body").on("click", "#send-btn", function () {
    console.log("Clicked send btn");
    let messageObj = {
      name: currentUser,
      tColor: currentColor,
      message: "gif",
      gifSrc: giphyResponse.data[gifIterator].images.fixed_width.url,
    };
    
    console.log(messageObj)
    movieData.ref("chat").push(messageObj);
    // hide the gif + buttons that were showing locally
    gif.hide();
    sendBtn.hide();
    shuffleBtn.hide();
    cancelBtn.hide();
  });

  // if user clicks suffleBtn, switch to next gif in response object
  $("body").on("click", "#suffle-btn", function () {
    gifIterator++;
    if (gifIterator === 10) {
      gifIterator = 0;
    }
    gif.attr("src", giphyResponse.data[gifIterator].images.fixed_width.url);
  });

  // if user clicks cancel, remove gif and buttons from the page.
  $("body").on("click", "#cancel-btn", function () {
    gif.hide();
    sendBtn.hide();
    shuffleBtn.hide();
    cancelBtn.hide();
  });

});

// update code so when user joins chat they are assigned a color

// on double click of a message, append an emoji heart
// if the heart already exists, put a x2 
// on hover over the heart, show who liked the message
// increase font weight of userNames on message send


$(document).ready(function() {
  // Configure Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCqKTF0CNOTC5nJFuKiFaTaea4-9WRm15I",
    authDomain: "what-should-we-watch-3a9a9.firebaseapp.com",
    databaseURL: "https://what-should-we-watch-3a9a9.firebaseio.com",
    projectId: "what-should-we-watch-3a9a9",
    storageBucket: "what-should-we-watch-3a9a9.appspot.com",
    messagingSenderId: "669042740976",
    appId: "1:669042740976:web:d11bc78cd5693e2c1d7c35"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Global Variables
  const movieData = firebase.database();
  let currentUser = "";
  const colorArr = ["#FF0000", "#FF4000", "#FF8000", "#FFFF00", "#C0FF00", "#80FF00", "#40FF00", "#00FF00", "#00FF80", "#00FFC0", "#00FFFF", "#00C0FF", "#0080FF", "#0040FF", "#0000FF", "#4000FF", "#8000FF", "#C000FF", "#FF00FF", "#FF00C0", "#FF0080"]
  let currentColor = 0;
  
  const genRandomColor = function() {
    return Math.floor(Math.random() * 21)
  }
   
  // make the user enter a username into a modal
  $("#un-modal").modal({ backdrop: "static" }, "show");

  $("#un-submit").click(function() {
    // make sure they input something
    const userName = $("#un-input")
      .val()
      .trim();
    if (userName.length) {
      currentUser = userName;
      // add global message when someone joins the chat (refactor send message into a function that takes in a message obj)
      


    } else {
      alert("You must input a username to join the chat!");
      return;
    }

    $("#un-modal").modal("toggle");
  });

  // Chat room logic
  // listen for button click
  $("#m-send").click(function(e) {
    e.preventDefault();
    // capture the message
    const message = $("#m")
      .val()
      .trim();
    // send it to the database
    let messageObj = {
      name: currentUser,
      message: message
    };

    movieData.ref("chat").push(messageObj);
    $("#m").val("");
  });

  // listen for pressing enter
  // Get the input field
  var mInput = $("#m");

  // Execute a function when the user releases a key on the keyboard
  mInput.on("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action
      event.preventDefault();
      // Trigger the button element with a click
      $("#m-send").click();
    }
  });

  const scrollToBottom = function() {
    $(".messages-area").scrollTop($(".messages-area")[0].scrollHeight);
  };

  // listen for any changes to the database and add them to the page
  movieData.ref("chat").on("child_added", function(childSnapshot) {
    const name = childSnapshot.val().name;
    const mText = childSnapshot.val().message;
    const chatBubble = $("<div class='chat-bubble'>");
    const nameStamp = $("<p class='name-stamp'>").text(name);
    const message = $("<p class='message-text'>").text(mText);
    // add alternating colors to users who join
    nameStamp.attr('style', `color: ${colorArr[genRandomColor()]}`)
    // increment currentColor counter so color changes with next message
    currentColor++
    // prevent counter from going over 5
    if (currentColor === 5) {
        currentColor = 0
    }

    chatBubble.append(nameStamp);
    chatBubble.append(message);

    $("#messages").append(chatBubble);

    // scroll to the bottom
    const messageDiv = $("#messages");

    scrollToBottom();
  });
});


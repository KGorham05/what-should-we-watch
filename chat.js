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
      let globalMessage = {
        name: "System",
        message: `${currentUser} has joined the chat`
      }
      movieData.ref("chat").push(globalMessage);

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

    // check if the message starts with "/giphy"
    if (message.startsWith('/giphy')) {
      // ping the giphy api for whatever word is typed after giphy
      return;
    }

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
    const key = childSnapshot.key;
    const chatBubble = $("<div class='chat-bubble'>");
    const nameStamp = $("<p class='name-stamp'>").text(name);
    const message = $("<p class='message-text'>").text(mText);
    // add alternating colors to users who join
    nameStamp.attr('style', `color: ${colorArr[genRandomColor()]}`)


    // check if the message is a system message
    if (name === "System") {
      nameStamp.attr('style', 'color: black');
      // change the styling by adding a system-message class to it
      nameStamp.removeClass('name-stamp');
      message.removeClass('message-text');
      nameStamp.addClass('system-name');
      message.addClass('system-text');
    }

    // add a unique identifier to each chat bubble 
    chatBubble.attr('data-heart', 'false');
    chatBubble.attr('data-key', key);
    chatBubble.append(nameStamp);
    chatBubble.append(message);
    

    $("#messages").append(chatBubble);
    
    // scroll to the bottom
    scrollToBottom();
  });

  // listen for double click to chat bubble
  // this works to update the page for the current user, but it's not sent to other users
  $('body').on('dblclick', '.chat-bubble', function() {
    if ($(this).data('heart') === false) {
      let heart = $('<p>').text(`❤️ ${currentUser} Liked this`);
      heart.insertAfter($(this));
      $(this).data('heart', true);
    } else {
      console.log('already clicked')
    }



  })

});


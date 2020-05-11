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
  const genRandomColor = function () {
    return Math.floor(Math.random() * 21);
  };
  const scrollToBottom = function () {
    $(".messages-area").scrollTop($(".messages-area")[0].scrollHeight);
  };
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

  currentColor = colorArr[genRandomColor()];

  // make the user enter a username into a modal
  $("#un-modal").modal({ backdrop: "static" }, "show");

  $("#un-submit").click(function () {
    // make sure they input something
    const userName = $("#un-input").val().trim();
    if (userName.length) {
      currentUser = userName;
      let globalMessage = {
        name: "System",
        message: `${currentUser} has joined the chat`,
      };
      movieData.ref("chat").push(globalMessage);
    } else {
      alert("You must input a username to join the chat!");
      return;
    }

    $("#un-modal").modal("toggle");
  });

  // listen for send message button click
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
    };

    movieData.ref("chat").push(messageObj);
    $("#m").val("");
  });

  // listen for pressing enter
  $("#m").on("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action
      event.preventDefault();
      // Trigger the button element with a click
      $("#m-send").click();
    }
  });

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

      chatBubble.attr("data-key", key);
      chatBubble.append(nameStamp);
      chatBubble.append(img);

      $("#messages").append(chatBubble);

      if (likedBy) {
        let heart = $("<p>").text(`❤️ ${likedBy} Liked this`);
        $("#messages").append(heart);
      }

      scrollToBottom();
      return;
    }

    // check if the message is a system message
    if (name === "System") {
      nameStamp.attr("style", "color: black");
      // change the styling by adding a system-message class to it
      nameStamp.removeClass("name-stamp");
      message.removeClass("message-text");
      nameStamp.addClass("system-name");
      message.addClass("system-text");
    }

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
    const chatBubble = $(".chat-bubble[data-key='" + childSnapshot.key + "']");
    const nextElement = chatBubble.next();

    // if this is the last element on the page, or the next element doesn't start with the heart...
    if (nextElement[0] == null || !nextElement[0].innerText.startsWith("❤️")) {
      let heart = $("<p>").text(`❤️ ${childSnapshot.val().likedBy} Liked this`);
      heart.insertAfter(chatBubble);
    }
    // else a liked message exists, update it
    else {
      nextElement[0].innerText = `❤️ ${childSnapshot.val().likedBy} Liked this`;
    }
  });

  // listen for double click to chat bubble (initiate liking a message)
  $("body").on("dblclick", ".chat-bubble", function () {
    // check if anyone has already liked this message
    const messageKey = $(this).data("key");
    movieData
      .ref("chat")
      .child(messageKey)
      .once("value", function (data) {
        let whoLikedThis = data.val().likedBy;
        if (whoLikedThis == null) {
          console.log("First like");
          movieData
            .ref("chat")
            .child(messageKey)
            .update({ likedBy: currentUser });
        } else {
          console.log("This has been liked");
          whoLikedThis = whoLikedThis + ", " + currentUser;
          movieData
            .ref("chat")
            .child(messageKey)
            .update({ likedBy: whoLikedThis });
        }
      });
  });

  // if user clicks send, send the gif as a message to the DB and remove the buttons
  $("body").on("click", "#send-btn", function () {
    console.log("Clicked send btn");
    let messageObj = {
      name: currentUser,
      tColor: currentColor,
      message: "gif",
      gifSrc: giphyResponse.data[gifIterator].images.fixed_width.url,
    };

    console.log(messageObj);
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

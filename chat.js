$(document).ready(function () {

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
    let currentUser = '';
    // make the user enter a username into a modal
    $("#un-modal").modal({ 'backdrop': 'static' }, 'show')
    $("#un-submit").click(function () {
        // make sure they input something
        const userName = $("#un-input").val().trim();
        if (userName.length) {
            currentUser = userName;
        } else {
            alert('You must input a username to join the chat!');
            return;
        }

        $("#un-modal").modal('toggle');
    });

    window.location.hash = '#m';

    // Chat room logic
    $("#m-send").click(function (e) {
        e.preventDefault();
        // capture the message
        const message = $("#m").val().trim();
        // send it to the database
        let messageObj = {
            name: currentUser,
            message: message
        }

        movieData.ref('chat').push(messageObj);
        $("#m").val('');
    });

    // listen for any changes to the database and add them to the page
    movieData.ref('chat').on("child_added", function (childSnapshot) {

        const name = childSnapshot.val().name;
        const mText = childSnapshot.val().message;
        const chatBubble = $("<div class='chat-bubble'>");
        const nameStamp = $("<p class='name-stamp'>").text(name);
        const message = $("<p class='message-text'>").text(mText);

        chatBubble.append(nameStamp);
        nameStamp.append(message);

        $("#messages").append(chatBubble);

        // scroll to the bottom
        const messageDiv = $('#messages');

        scrollToBottom();
    });


})
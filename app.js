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
  const movieData = firebase.database();
  const totalVotes = [];

  $("#submit-movie-suggestion").click(function(e) {
    // prevent the page from reloading
    e.preventDefault();
    const movie = $("#movie-input")
      .val()
      .trim();
    const suggestedBy = $("#who-suggested")
      .val()
      .trim();
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
    // Creating an AJAX call for the specific movie button being clicked
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // console.log(response);

      // Send the relevant data from omdb to firebase along with suggestBy
      // Creates local "temporary" object for holding train data
      const newMovie = {
        title: movie,
        suggestedBy: suggestedBy,
        image: response.Poster,
        synopsis: response.Plot,
        numVotes: 0
      };

      // Uploads train data to the database
      movieData.ref().push(newMovie);

      // Logs everything to console
      console.log(newMovie.title);
      console.log(newMovie.suggestedBy);
      console.log(newMovie.image);
      console.log(newMovie.synopsis);
      // Clears all of the text-boxes
      $("#movie-input").val("");
      $("#who-suggested").val("");
      // Alert
      alert("Movie successfully added");
    });
  });

  movieData.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.key);
    // store all the data from the db as a variable
    const title = childSnapshot.val().title;
    const suggestedBy = childSnapshot.val().suggestedBy;
    const image = childSnapshot.val().image;
    const synopsis = childSnapshot.val().synopsis;
    const votes = childSnapshot.val().numVotes;
    const key = childSnapshot.key;
    // Build the html components with the data from the db
    //  the column
    const column = $("<div>").addClass("col-md-3");
    //  the div.card
    const card = $("<div>").addClass("card");
    //  the img tag
    const img = $("<img>")
      .addClass("card-img-top")
      .attr("src", image);
    //  the card body div
    const cardBody = $("<div>").addClass("card-body");
    //  the h5 for the title
    const movieTitle = $("<h5>").html(title + " - Suggested By " + suggestedBy);
    //  the p tag for short synopsis
    const movieSynopsis = $("<p>").text(synopsis);
    //  div to center the button
    const centerTheText = $("<div>").addClass("text-center");
    //  btn
    const voteBtn = $("<button>")
      .addClass("btn btn-primary vote-btn")
      .text("Click to Vote");
    voteBtn.attr("data-key", key);
    // need to add some unique identifier to each button for voting logic

    // add the elements to the page
    cardBody
      .append(movieTitle)
      .append(movieSynopsis)
      .append(centerTheText);
    centerTheText.append(voteBtn);
    card.append(img).append(cardBody);
    column.append(card);
    $("#choices-row").append(column);

    // add the title to the voting list display
    const voteDisplay = $("<h5>");
    const titleSpan = $("<span>").text(title + ": ");
    const voteCount = $("<span>").text(votes);
    voteCount.addClass(key)
    voteDisplay.append(titleSpan).append(voteCount);
    $("#vote-display").append(voteDisplay);
    // add the movie and number of votes to an array so that they can be updated on click.
    const movieObj = {
      key: key,
      votes: votes,
      title: title
    };
    totalVotes.push(movieObj);
    console.log(totalVotes);

    figureOutWhatsNext(totalVotes);
  });

  // listen for vote-btn click
  $(document).on("click", ".vote-btn", function() {
    alert('Thanks for your vote!')
    let key = $(this).data("key");
    for (i = 0; i < totalVotes.length; i++) {
      if (totalVotes[i].key === key) {
        const updatedVoteCount = totalVotes[i].votes + 1;
        // update the DB
        movieData
          .ref()
          .child(key)
          .update({ numVotes: updatedVoteCount })
        // update the UI and the global var obj
        totalVotes[i].votes = updatedVoteCount
        $("." + key).text(updatedVoteCount)
        break;
      }
    }
  });

  const figureOutWhatsNext = function(arr) {
    let mostVotes = 0;
    let chosenFilm = "";
    console.log(arr)
    for (i = 0; i < arr.length; i++) {
      if (arr[i].votes > mostVotes) {
        mostVotes = arr[i].votes;
        chosenFilm = arr[i].title;
      }
    }
    console.log("Chosen film: " + chosenFilm)
    $("#upcoming-movie").text(chosenFilm);

  }

  
});

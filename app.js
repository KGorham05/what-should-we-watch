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
  const totalVotes = [];
  const whosComing = [];

  // Submit a movie button
  $("#submit-movie-suggestion").click(function (e) {
    // prevent the page from reloading
    e.preventDefault();
    const movie = $("#movie-input")
      .val()
      .trim();
    const streaming = $("#streaming-input")
      .val()
      .trim();
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

    // Creating an AJAX call for the specific movie button being clicked
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      // Send the relevant data from omdb to firebase along with suggestBy
      // Creates local "temporary" object for holding train data

      // Ratings":[{"Source":"Rotten Tomatoes","Value":"82%"}]
      let tomatoes;

      for (var i = 0; i < response.Ratings.length; i++) {
        if (response.Ratings[i].Source === "Rotten Tomatoes") {
          tomatoes = response.Ratings[i].Value;
        }
      }

      const newMovie = {
        year: response.Year,
        genre: response.Genre,
        imdbRating: response.imdbRating,
        tomatoes: tomatoes,
        title: movie,
        streaming: streaming,
        image: response.Poster,
        synopsis: response.Plot,
        numVotes: 0
      };

      // Uploads movie data to firebase
      movieData.ref("movies").push(newMovie);

      // Clears all of the text-boxes
      $("#movie-input").val("");
      $("#who-suggested").val("");
      $("#streaming-input").val("");
      // Alert
      alert("Movie successfully added");
    });
  });

  // display the movies on the page
  movieData.ref("movies").on("child_added", function (childSnapshot) {
    // store all the data from the db as a variable
    const title = childSnapshot.val().title;
    const image = childSnapshot.val().image;
    const synopsis = childSnapshot.val().synopsis;
    const votes = childSnapshot.val().numVotes;
    const stream = childSnapshot.val().streaming;
    const year = childSnapshot.val().year;
    const genre = childSnapshot.val().genre;
    const tomatoes = childSnapshot.val().tomatoes;
    const imdbRating = childSnapshot.val().imdbRating;
    const key = childSnapshot.key;
    // Build the html components with the data from the db
    //  the column
    const column = $("<div>").addClass("col-md-3");
    //  the div.card
    const card = $("<div>").addClass("card shadow mb-3 movie");
    //  the img tag
    const img = $("<img>")
      .addClass("card-img-top")
      .attr("src", image);
    //  the card body div
    const cardBody = $("<div>").addClass("card-body movie-info");
    //  the h5 for the title
    const movieTitle = $("<h5 class='movie-title'>").html(title + " - " + stream);
    // Year + Genre
    const yearAndGenre = $("<p class='year-and-genre'>").html(`<span class="year">(${year})</span> ${genre}`);
    // Ratings (IMBD + Tomatoes)
    const ratings = $("<p class='ratings'>").text(`IMBD: ${imdbRating} Tomatoes: ${tomatoes}`);
    //  the p tag for short synopsis
    const movieSynopsis = $("<p class='plot'>").text(synopsis);
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
      .append(yearAndGenre)
      .append(ratings)
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
  $(document).on("click", ".vote-btn", function () {
    alert('Thanks for your vote!')
    let key = $(this).data("key");
    for (i = 0; i < totalVotes.length; i++) {
      if (totalVotes[i].key === key) {
        const updatedVoteCount = totalVotes[i].votes + 1;
        // update the DB
        movieData
          .ref("movies")
          .child(key)
          .update({ numVotes: updatedVoteCount })
        // update the UI and the global var obj
        totalVotes[i].votes = updatedVoteCount
        $("." + key).text(updatedVoteCount)
        break;
      }
    }
  });

  // whichever movie has the highest votes, display as upcoming film
  const figureOutWhatsNext = function (arr) {
    let mostVotes = 0;
    let chosenFilm = "";
    for (i = 0; i < arr.length; i++) {
      if (arr[i].votes > mostVotes) {
        mostVotes = arr[i].votes;
        chosenFilm = arr[i].title;
      }
    }

    chosenFilm = chosenFilm.toUpperCase();
    $("#upcoming-movie").html(chosenFilm);

  };


});

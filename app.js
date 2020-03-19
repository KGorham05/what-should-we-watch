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
      console.log(response);
      
      // Send the relevant data from omdb to firebase along with suggestBy
      // Creates local "temporary" object for holding train data
      const newMovie = {
        title: movie,
        suggestedBy: suggestedBy,
        posterImg: response.Poster,
        synopsis: response.Plot
      };

      // Uploads train data to the database
      movieData.ref().push(newMovie);

      // Logs everything to console
      console.log(newMovie.title);
      console.log(newMovie.suggestedBy);
      console.log(newMovie.posterImg);
      console.log(newMovie.synopsis);
      $("#movie-input").val("");
      $("#who-suggested").val("");
      // Alert
      alert("Movie successfully added");

      // Clears all of the text-boxes
      
    });
  });

//   function displayMovies() {
//     // create the column
//     const column = $("<div>").addClass("col-md-3");
//     // Create the div.card
//     const card = $("<div>").addClass("card");
//     // Create the img tag
//     const img = $("<img>").addClass("card-img-top");
//     // Create the card body div
//     const cardBody = $("<div>").addClass("card-body");
//     // create the h5 for the title
//     const movieTitleHeading = $("<h5>");
//     // Create the p tag for short synopsis
//     const movieSynopsisDisplay = $("<p>");
//     // Create div to center the button
//     const centerTheText = $("<div>").addClass("text-center");
//     // Create btn
//     const voteBtn = $("<button>").addClass("btn btn-primary");
//     // need to add some unique identifier to each button for voting logic

//     // set the values of these components to pieces pulled from the ajax response

//     // Creating a div to hold the movie
//     //  var movieDiv = $("<div class='movie'>");

//     // Storing the rating data
//     //  var rating = response.Rated;

//     // Creating an element to have the rating displayed
//     //  var pOne = $("<p>").text("Rating: " + rating);

//     // Displaying the rating
//     //  movieDiv.append(pOne);

//     // Storing the release year
//     //  var released = response.Released;

//     // Creating an element to hold the release year
//     //  var pTwo = $("<p>").text("Released: " + released);

//     // Displaying the release year
//     //  movieDiv.append(pTwo);

//     // Storing the plot
//     //  var plot = response.Plot;

//     // Creating an element to hold the plot
//     //  var pThree = $("<p>").text("Plot: " + plot);

//     // Appending the plot
//     //  movieDiv.append(pThree);

//     // Retrieving the URL for the image
//     var imgURL = response.Poster;

//     // Creating an element to hold the image
//     //  var image = $("<img>").attr("src", imgURL);

//     // Appending the image
//     //  movieDiv.append(image);

//     // Putting the entire movie above the previous movies
//     //  $("#movies-view").prepend(movieDiv);
//   }

  // Function for displaying movie data
  //  function renderButtons() {
  //    // Deleting the movies prior to adding new movies
  //    // (this is necessary otherwise you will have repeat buttons)
  //    $("#buttons-view").empty();

  //    // Looping through the array of movies
  //    for (var i = 0; i < movies.length; i++) {
  //      // Then dynamicaly generating buttons for each movie in the array
  //      // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
  //      var a = $("<button>");
  //      // Adding a class of movie-btn to our button
  //      a.addClass("movie-btn");
  //      // Adding a data-attribute
  //      a.attr("data-name", movies[i]);
  //      // Providing the initial button text
  //      a.text(movies[i]);
  //      // Adding the button to the buttons-view div
  //      $("#buttons-view").append(a);
  //    }
  //  }
});

// 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
// trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
//   console.log(childSnapshot.val());

//   // Store everything into a variable.
//   var tName = childSnapshot.val().name;
//   var tDestination = childSnapshot.val().destination;
//   var tFrequency = childSnapshot.val().frequency;
//   var tFirstTrain = childSnapshot.val().firstTrain;

//   var timeArr = tFirstTrain.split(":");
//   var trainTime = moment()
//     .hours(timeArr[0])
//     .minutes(timeArr[1]);
//   var maxMoment = moment.max(moment(), trainTime);
//   var tMinutes;
//   var tArrival;

//   // If the first train is later than the current time, sent arrival to the first train time
//   if (maxMoment === trainTime) {
//     tArrival = trainTime.format("hh:mm A");
//     tMinutes = trainTime.diff(moment(), "minutes");
//   } else {
//     // Calculate the minutes until arrival using hardcore math
//     // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
//     // and find the modulus between the difference and the frequency.
//     var differenceTimes = moment().diff(trainTime, "minutes");
//     var tRemainder = differenceTimes % tFrequency;
//     tMinutes = tFrequency - tRemainder;
//     // To calculate the arrival time, add the tMinutes to the current time
//     tArrival = moment()
//       .add(tMinutes, "m")
//       .format("hh:mm A");
//   }
//   console.log("tMinutes:", tMinutes);
//   console.log("tArrival:", tArrival);

//   // Add each train's data into the table
//   $("#train-table > tbody").append(
//     $("<tr>").append(
//       $("<td>").text(tName),
//       $("<td>").text(tDestination),
//       $("<td>").text(tFrequency),
//       $("<td>").text(tArrival),
//       $("<td>").text(tMinutes)
//     )
//   );
// });

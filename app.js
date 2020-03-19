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
        image: response.Poster,
        synopsis: response.Plot
      };

      // Uploads train data to the database
      movieData.ref().push(newMovie);

      // Logs everything to console
      console.log(newMovie.title);
      console.log(newMovie.suggestedBy);
      console.log(newMovie.posterImg);
      console.log(newMovie.synopsis);
      // Clears all of the text-boxes
      $("#movie-input").val("");
      $("#who-suggested").val("");
      // Alert
      alert("Movie successfully added");
    });
  });

  movieData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    
    console.log(childSnapshot.val());
    // store all the data from the db as a variable
    const title = childSnapshot.val().title
    const suggestedBy = childSnapshot.val().suggestedBy
    const image = childSnapshot.val().image
    const synopsis = childSnapshot.val().synopsis

    // Build the html components with the data from the db
    //  the column
    const column = $("<div>").addClass("col-md-3");
    //  the div.card
    const card = $("<div>").addClass("card");
    //  the img tag
    const img = $("<img>").addClass("card-img-top").attr("src", image)
    //  the card body div
    const cardBody = $("<div>").addClass("card-body");
    //  the h5 for the title
    const movieTitle = $("<h5>").html(title + " - Suggested By " + suggestedBy);
    //  the p tag for short synopsis
    const movieSynopsis = $("<p>").text(synopsis);
    //  div to center the button
    const centerTheText = $("<div>").addClass("text-center");
    //  btn
    const voteBtn = $("<button>").addClass("btn btn-primary").text("Click to Vote");
    // need to add some unique identifier to each button for voting logic

    // add the elements to the page
    cardBody.append(movieTitle).append(movieSynopsis).append(centerTheText);
    centerTheText.append(voteBtn);
    card.append(img).append(cardBody);
    column.append(card);
    $("#choices-row").append(column);
   
  });

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

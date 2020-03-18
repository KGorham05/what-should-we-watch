$(document).ready(function() {
  console.log("ready!");

  // var movies = ["The Matrix", "The Notebook", "Mr. Nobody", "The Lion King"];

  $("#submit-movie-suggestion").click(function(e) {
    // prevent the page from reloading
    e.preventDefault();
    const movie = $("#movie-input")
      .val()
      .trim();
    const suggestedBy = $("#suggested-by")
      .val()
      .trim();
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
    // Creating an AJAX call for the specific movie button being clicked
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      // create the column
      const column = $("<div>").addClass("col-md-3")
      // Create the div.card 
      const card = $("<div>").addClass("card")
      // Create the img tag
      const img = $("<img>").addClass("card-img-top")
      // Create the card body div
      // create the h5 for the title
      // Create the p tag for short synopsis
      // Create div to center the button
      // Create btn
      // set the values of these components to pieces pulled from the ajax response






      // Creating a div to hold the movie
      //  var movieDiv = $("<div class='movie'>");

      // Storing the rating data
      //  var rating = response.Rated;

      // Creating an element to have the rating displayed
      //  var pOne = $("<p>").text("Rating: " + rating);

      // Displaying the rating
      //  movieDiv.append(pOne);

      // Storing the release year
      //  var released = response.Released;

      // Creating an element to hold the release year
      //  var pTwo = $("<p>").text("Released: " + released);

      // Displaying the release year
      //  movieDiv.append(pTwo);

      // Storing the plot
      //  var plot = response.Plot;

      // Creating an element to hold the plot
      //  var pThree = $("<p>").text("Plot: " + plot);

      // Appending the plot
      //  movieDiv.append(pThree);

      // Retrieving the URL for the image
      var imgURL = response.Poster;

      // Creating an element to hold the image
      //  var image = $("<img>").attr("src", imgURL);

      // Appending the image
      //  movieDiv.append(image);

      // Putting the entire movie above the previous movies
      //  $("#movies-view").prepend(movieDiv);
    });
  });

  // Function for displaying movie data
  //   function renderButtons() {
  //     // Deleting the movies prior to adding new movies
  //     // (this is necessary otherwise you will have repeat buttons)
  //     $("#buttons-view").empty();

  //     // Looping through the array of movies
  //     for (var i = 0; i < movies.length; i++) {
  //       // Then dynamicaly generating buttons for each movie in the array
  //       // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
  //       var a = $("<button>");
  //       // Adding a class of movie-btn to our button
  //       a.addClass("movie-btn");
  //       // Adding a data-attribute
  //       a.attr("data-name", movies[i]);
  //       // Providing the initial button text
  //       a.text(movies[i]);
  //       // Adding the button to the buttons-view div
  //       $("#buttons-view").append(a);
  //     }
  //   }

  // This function handles events where a movie button is clicked
  //   $("#add-movie").on("click", function(event) {
  //     event.preventDefault();
  //     // This line grabs the input from the textbox
  //     var movie = $("#movie-input")
  //       .val()
  //       .trim();

  //     // Adding movie from the textbox to our array
  //     movies.push(movie);

  //     // Calling renderButtons which handles the processing of our movie array
  //     renderButtons();
  //   });

  // Adding a click event listener to all elements with a class of "movie-btn"
  //   $(document).on("click", ".movie-btn", displayMovieInfo);

  // Calling the renderButtons function to display the intial buttons
  //   renderButtons();
});

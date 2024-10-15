// your code here
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/films/1")
      .then(response => response.json())
      .then(movie => {
          displayMovieDetails(movie);
      });
});

function displayMovieDetails(movie) {
  const movieDetails = document.querySelector("#movie-details");
  movieDetails.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <h2>${movie.title}</h2>
      <p>Runtime: ${movie.runtime} mins</p>
      <p>Showtime: ${movie.showtime}</p>
      <p>Available Tickets: ${movie.capacity - movie.tickets_sold}</p>
      <button id="buy-ticket">Buy Ticket</button>
  `;
}



function loadMovies() {
  fetch("http://localhost:3000/films")
      .then(response => response.json())
      .then(movies => {
          const filmsList = document.getElementById("films");
          filmsList.innerHTML = "";
          movies.forEach(movie => {
              const li = document.createElement("li");
              li.className = "film item";
              li.textContent = movie.title;
              filmsList.appendChild(li);
          });
      });
}

loadMovies();





document.addEventListener("click", (event) => {
  if (event.target.id === "buy-ticket") {
      const availableTickets = Number(document.querySelector("p").textContent.split(": ")[1]);
      if (availableTickets > 0) {
          const movieId = 1; 
          buyTicket(movieId);
      }
  }
});

function buyTicket(movieId) {
  fetch(`http://localhost:3000/films/${movieId}`)
      .then(response => response.json())
      .then(movie => {
          const updatedTicketsSold = movie.tickets_sold + 1;

          fetch(`http://localhost:3000/films/${movieId}`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ tickets_sold: updatedTicketsSold })
          })
          .then(() => {

              displayMovieDetails({ ...movie, tickets_sold: updatedTicketsSold });
          });
      });
}




function loadMovies() {
  fetch("http://localhost:3000/films")
      .then(response => response.json())
      .then(movies => {
          const filmsList = document.getElementById("films");
          filmsList.innerHTML = "";
          movies.forEach(movie => {
              const li = document.createElement("li");
              li.className = "film item";
              li.textContent = movie.title;

              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Delete";
              deleteButton.addEventListener("click", () => deleteFilm(movie.id));

              li.appendChild(deleteButton);
              filmsList.appendChild(li);
          });
      });
}

function deleteFilm(id) {
  fetch(`http://localhost:3000/films/${id}`, { method: "DELETE" })
      .then(() => loadMovies());
}



function displayMovieDetails(movie) {
  const availableTickets = movie.capacity - movie.tickets_sold;
  const soldOut = availableTickets <= 0;

  const movieDetails = document.querySelector("#movie-details");
  movieDetails.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <h2>${movie.title}</h2>
      <p>Runtime: ${movie.runtime} mins</p>
      <p>Showtime: ${movie.showtime}</p>
      <p>Available Tickets: ${availableTickets}</p>
      <button id="buy-ticket" ${soldOut ? "disabled" : ""}>${soldOut ? "Sold Out" : "Buy Ticket"}</button>
  `;

  if (soldOut) {
      const filmsList = document.getElementById("films");
      const filmItem = [...filmsList.children].find(li => li.textContent.includes(movie.title));
      if (filmItem) {
          filmItem.classList.add("sold-out");
      }
  }
}


document.getElementById("films").addEventListener("click", (event) => {
    if (event.target.classList.contains("film")) {
        const movieTitle = event.target.textContent;
        fetch("http://localhost:3000/films")
            .then(response => response.json())
            .then(movies => {
                const selectedMovie = movies.find(movie => movie.title === movieTitle);
                displayMovieDetails(selectedMovie);
            });
    }
});

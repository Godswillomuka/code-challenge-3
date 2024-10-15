// your code here
const filmsList = document.getElementById('films');
document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.querySelector('.film.item');
  if (placeholder) {
    placeholder.remove();
  }
  loadAllMovies(`http://localhost:3000/films`);
});

function loadAllMovies(url) {
  fetch(url)
    .then(response => response.json())
    .then(movies => {
      if (movies.length > 0) {
        displayFilmDetails(movies[0]);
      }
      movies.forEach(movie => {
        showMovie(movie);
      });
    });
}

function showMovie(movie) {
  const filmItem = document.createElement('li');
  filmItem.className = 'film item';
  filmItem.style.cursor = "pointer";
  filmItem.textContent = movie.title.toUpperCase();
  filmsList.appendChild(filmItem);
  filmItem.addEventListener('click', () => {
    fetchFilmDetails(movie.id);
  });
}


function fetchFilmDetails(movieId) {
  fetch(`${`http://localhost:3000/films`}/${movieId}`)
    .then(response => response.json())
    .then(movie => {
      document.getElementById('buy-ticket').textContent = 'Buy Ticket';
      displayFilmDetails(movie);
    });
}


function displayFilmDetails(selectedMovie) {
  const posterElement = document.getElementById('poster');
  posterElement.src = selectedMovie.poster;
  document.querySelector('#title').textContent = selectedMovie.title;
  document.querySelector('#runtime').textContent = `${selectedMovie.runtime} minutes`;
  document.querySelector('#film-info').textContent = selectedMovie.description;
  document.querySelector('#showtime').textContent = selectedMovie.showtime;
  const availableTickets = selectedMovie.capacity - selectedMovie.tickets_sold;
  const ticketsElement = document.querySelector('#ticket-num');
  ticketsElement.textContent = availableTickets;
  const buyButton = document.getElementById('buy-ticket');
  buyButton.removeEventListener('click', buyTicketHandler);
  if (availableTickets === 0) {
    buyButton.textContent = 'Sold Out';
    buyButton.disabled = true;
  } else {
    buyButton.addEventListener('click', () => buyTicketHandler(selectedMovie));
  }
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
      });
    });
}

function deleteFilm(id) {
  fetch(`http://localhost:3000/films/${id}`, { method: "DELETE" })
    .then(() => loadMovies());
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteFilm(movie.id));

  li.appendChild(deleteButton);
  filmsList.appendChild(li);
}


function buyTicketHandler(movie) {
  const ticketsElement = document.querySelector('#ticket-num');
  let remainingTickets = parseInt(ticketsElement.textContent, 10);
  if (remainingTickets > 0) {
    remainingTickets -= 1;
    ticketsElement.textContent = remainingTickets;
    const updatedTicketsSold = movie.tickets_sold + 1;
    fetch(`${`http://localhost:3000/films`}/${movie.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tickets_sold: updatedTicketsSold })
    })
      .then(response => response.json())
      .then(updatedMovie => {
        displayFilmDetails(updatedMovie);
        if (remainingTickets === 0) {
          document.getElementById('buy-ticket').textContent = 'Sold Out';
          document.getElementById('buy-ticket').disabled = true;
        }
      });
  }
  else {
    alert('Error, no more tickets available!');
  }
}

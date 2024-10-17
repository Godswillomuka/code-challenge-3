// Your code hear
const filmsList = document.getElementById('films');

document.addEventListener('DOMContentLoaded', () => {
  
  const placeholder = document.querySelector('.film.item');
  if (placeholder) {
    placeholder.remove();
  }
  loadAllMovies('http://localhost:3000/films');
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
    })
    .catch(error => console.error('Error loading movies:', error));
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

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteFilm(movie.id));
  filmItem.appendChild(deleteButton);
}


function fetchFilmDetails(movieId) {
  fetch(`http://localhost:3000/films/${movieId}`)
    .then(response => response.json())
    .then(movie => {
      displayFilmDetails(movie);
    })
    .catch(error => console.error('Error fetching film details:', error));
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
  buyButton.removeEventListener('click', () => buyTicketHandler(selectedMovie));
  

  if (availableTickets === 0) {
    buyButton.textContent = 'Sold Out';
    buyButton.disabled = true;
  } else {
    buyButton.textContent = 'Buy Ticket';
    buyButton.disabled = false;
    buyButton.addEventListener('click', () => buyTicketHandler(selectedMovie));
  
  }
}


function deleteFilm(id) {
  fetch(`http://localhost:3000/films/${id}`, { method: "DELETE" })
    .then(() => {
      const filmItem = Array.from(filmsList.children).find(item => item.textContent.includes(id));
      if (filmItem) {
        filmItem.remove();
      }
      loadAllMovies('http://localhost:3000/films'); 
    })
    .catch(error => console.error('Error deleting film:', error));
}


function buyTicketHandler(movie) {
  const ticketsElement = document.querySelector('#ticket-num');
  let remainingTickets = parseInt(ticketsElement.textContent, 10);

  console.log(`Current available tickets: ${remainingTickets}`); 

  if (remainingTickets > 0) {
    remainingTickets -= 1;
    ticketsElement.textContent = remainingTickets;

    const updatedTicketsSold = movie.tickets_sold + 1;
    fetch(`http://localhost:3000/films/${movie.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tickets_sold: updatedTicketsSold })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(updatedMovie => {
      displayFilmDetails(updatedMovie);
      console.log(`Updated tickets sold: ${updatedMovie.tickets_sold}`); 
      if (remainingTickets === 0) {
        document.getElementById('buy-ticket').textContent = 'Sold Out';
        document.getElementById('buy-ticket').disabled = true;
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  } else {
    alert('Error, no more tickets available!');
  }
}

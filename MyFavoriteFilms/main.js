import { ChaveApi } from "./RepositorioLocal/ChaveApi.js"

const moviesContainer = document.querySelector('.movies')

const input = document.querySelector('input')
const searchButton = document.querySelector('.searchIcon');

searchButton.addEventListener('click', managersearchSystem)

input.addEventListener("keyup", function(event){
    event.preventDefault();
    if (event.key === "Enter")
        managersearchSystem()
})

const checkboxInput = document.querySelector('input[type="checkbox"]')
checkboxInput.addEventListener('change', checkCheckboxStatus)

async function checkCheckboxStatus() {
    const isChecked = checkboxInput.checked
    cleanAllMovies()
    if (isChecked) {
        const movies = await getFavoriteMovies()
        movies.forEach(movie => renderMovie(movie))
    }
    else {
        const movies = await getFilmesPopulares()
        movies.forEach(movie => renderMovie(movie))
    }
    
}

async function managersearchSystem() {
    const inputValue = input.value
    if (inputValue != '') {
        cleanAllMovies()
        const movies = await getFilmeEspecifico(inputValue)
        movies.forEach(movie => renderMovie(movie))
    }
}

function cleanAllMovies() {
  moviesContainer.innerHTML = ''
}

async function getFilmesPopulares() {
    let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${ChaveApi}&language=pt-BR-US&page=1`);
    let { results } = await response.json();
    return results;
}

async function getFilmeEspecifico(FilmeSelecionado) {
    let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${ChaveApi}&language=pt-BR&query=${FilmeSelecionado}&page=1`);
    let { results } = await response.json();
    return results;
}

function getFavoriteMovies() {
    return JSON.parse(localStorage.getItem('favoriteMovies'))
  }

function checkMovieIsFavorited(id) {
    const movies = getFavoriteMovies() || [] 
    return movies.find(movie => movie.id == id)
}

function saveToLocalStorage(movie) {
    const movies = getFavoriteMovies() || []
    movies.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
}

function removeToLocalStorage(id) {
    const movies = getFavoriteMovies() || []
    const findMovie = movies.find(movie => movie.id == id)
    const newMovies = movies.filter(movie => movie.id != findMovie.id)
    localStorage.setItem('favoriteMovies', JSON.stringify(newMovies))
}

function favoriteButtonStatus(event, movie) {
    const favoriteStatus = {
        favorited: 'images/heart-fill.svg',
        notFavorited: 'images/heart.svg'
    }

    if(event.target.src.includes(favoriteStatus.notFavorited)) {
        event.target.src = favoriteStatus.favorited
        saveToLocalStorage(movie)
    }
    else if(event.target.src.includes(favoriteStatus.favorited)) { 
        event.target.src = favoriteStatus.notFavorited
        removeToLocalStorage(movie.id)
    }
}



window.onload = function() {
    checkCheckboxStatus()
}

function renderMovie(movie) {
    const { id, title, poster_path, vote_average, release_date, overview} = movie
    
    const year = new Date(release_date).getFullYear()
    const image = 'https://image.tmdb.org/t/p/w500'+poster_path
    const isFavorited = checkMovieIsFavorited(id)

    const movieElement = document.createElement('div')
    movieElement.classList.add('movie')
    moviesContainer.appendChild(movieElement)

    const movieInformations = document.createElement('div')
    movieInformations.classList.add('movie-informations')

    const movieImageContainer = document.createElement('div')
    movieImageContainer.classList.add('movie-image')
    const movieImage = document.createElement('img')
    movieImage.src = image
    movieImage.alt = `${title} Poster`
    movieImageContainer.appendChild(movieImage)
    movieInformations.appendChild(movieImageContainer)

    const movieTextContainer = document.createElement('div')
    movieTextContainer.classList.add('movie-text')
    const movieTitle = document.createElement('h4')
    movieTitle.textContent = `${title} (${year})`
    movieTextContainer.appendChild(movieTitle)
    movieInformations.appendChild(movieTextContainer)

    const informations = document.createElement('div')
    informations.classList.add('movie-informations')
    movieTextContainer.appendChild(informations)

    const ratingContainer = document.createElement('div')
    ratingContainer.classList.add('rating')
    const starImage = document.createElement('img')
    starImage.src = 'images/star.png'
    starImage.alt = 'Star'
    const movieRate = document.createElement('span')
    movieRate.classList.add('movie-rate')
    movieRate.textContent = vote_average
    ratingContainer.appendChild(starImage)
    ratingContainer.appendChild(movieRate)
    informations.appendChild(ratingContainer)

    const favorite = document.createElement('div')
    favorite.classList.add('favorite')
    const favoriteImage = document.createElement('img')
    favoriteImage.src = isFavorited ? 'images/heart-fill.svg' : 'images/heart.svg'
    favoriteImage.alt = 'Heart'
    favoriteImage.classList.add('favoriteImage')
    favoriteImage.addEventListener('click', (event) => favoriteButtonStatus(event, movie))

    const favoriteText = document.createElement('span')
    favoriteText.classList.add('movie-favorite')
    favoriteText.textContent = 'Favoritar'
    favorite.appendChild(favoriteImage)
    favorite.appendChild(favoriteText)
    informations.appendChild(favorite)

    const movieDescriptionContainer = document.createElement('div')
    movieDescriptionContainer.classList.add('movie-description')
    const movieDescription = document.createElement('span')
    movieDescription.textContent = overview
    movieDescriptionContainer.appendChild(movieDescription)
    
    movieTextContainer.appendChild(movieDescriptionContainer)
    movieElement.appendChild(movieInformations)

}
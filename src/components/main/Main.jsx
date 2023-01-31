import React from 'react'
import './main.css'
import { getRandomMovieID, getMovieByID, getMoviesData, getMoviesConfigInfo, getMoviesGenres } from '../../services/movies'
import SelectedMovies from './SelectedMovies'

import PLACEHOLDER_POSTER from '../../assets/placeholder_poster.png'

const startingYear = 1940
const years = Array.from(new Array((new Date()).getFullYear() - startingYear + 1), (val, index) => (new Date()).getFullYear() - index);

const Main = () => {

    const [genres, setGenres] = React.useState({})
    const [filters, setFilters] = React.useState({ genre_id: "", rating: "0", initialYear: "", finalYear: "" })
    const [amountOfPagesAndMoviesPerPageInDB, setAmountOfPagesAndMoviesPerPageInDB] = React.useState(null)
    const [movieData, setMovieData] = React.useState({})
    const [movieID, setMovieID] = React.useState()
    const [pathInfo, setPathInfo] = React.useState({})
    const [selectedMovies, setSelectedMovies] = React.useState([])
    const [randomMovie, setRandomMovie] = React.useState()

    React.useEffect(() => {
        getMoviesGenres().then(genresInfo => setGenres(genresInfo.genres))
    }, [])

    React.useEffect(() => {
        getMoviesData().then(info => setAmountOfPagesAndMoviesPerPageInDB({ total_pages: info.total_pages, results: info.results.length }))
    }, [])

    React.useEffect(() => {
        getMoviesConfigInfo().then(info => setPathInfo(info.images.base_url))
    }, [])

    React.useEffect(() => {
        if (amountOfPagesAndMoviesPerPageInDB === null || ((filters.initialYear !== "" && filters.finalYear !== "") && filters.initialYear > filters.finalYear)) return
        getRandomMovieID(amountOfPagesAndMoviesPerPageInDB, filters).then(setMovieID)
    }, [amountOfPagesAndMoviesPerPageInDB, filters])

    React.useEffect(() => {
        if (!movieID) return
        getMovieByID(movieID).then(setMovieData)
    }, [movieID])

    const nextMovie = async () => {
        const newMovieID = await getRandomMovieID(amountOfPagesAndMoviesPerPageInDB, filters)
        setMovieID(newMovieID)
    }

    function handleFilterChange(event) {
        setFilters(prevFilters => { return { ...prevFilters, [event.target.name]: event.target.value } })
    }

    function selectNewMovie() {
        const posterPath = movieData.poster_path ? (pathInfo + 'w500' + movieData.poster_path) : PLACEHOLDER_POSTER
        const selectedMovie = { title: movieData.title, posterPath: posterPath }
        setSelectedMovies(prevMovies => [...prevMovies, selectedMovie])
    }

    function deselectMovie(event, title) {
        event.stopPropagation()
        console.log(title)
        setSelectedMovies(oldMovies => oldMovies.filter((movie) => movie.title !== title))
    }

    function pickRandomMovie() {
        let randomMovieIndex = Math.floor(Math.random() * selectedMovies.length)
        console.log(randomMovieIndex)
        setRandomMovie({ title: selectedMovies[randomMovieIndex].title, posterPath: selectedMovies[randomMovieIndex].posterPath })
    }

    return (
        <>
            <div className='container'>
                <div className="main_filters">
                    <select className='btn btn-primary' id="genre_id" value={filters.genre_id} onChange={handleFilterChange} name="genre_id">
                        <option value="">-- Genre --</option>
                        {genres.length > 0 && genres.map((genre) => { return <option key={`${genre.name}`} value={`${genre.id}`}>{genre.name}</option> })}
                    </select>

                    <select className='btn btn-primary' id="rating" value={filters.rating} onChange={handleFilterChange} name="rating">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>

                    <select className="btn btn-primary" id="initialYear" value={filters.initialYear} onChange={handleFilterChange} name="initialYear">
                        <option value="">-- Initial Year --</option>
                        {years.map(year => { return <option key={`${year}`} value={`${year}`}>{year}</option> })}
                    </select>

                    <select className="btn btn-primary" id="finalYear" value={filters.finalYear} onChange={handleFilterChange} name="finalYear">
                        <option value="">-- Final Year --</option>
                        {years.map(year => { return <option key={`${year}`} value={`${year}`}>{year}</option> })}
                    </select>
                </div>
                <div className="main__movie-card">
                    <div className="main__movie">
                        <div className="main__movie-image">
                            <img src={movieData.poster_path ? (pathInfo + 'w500' + movieData.poster_path) : PLACEHOLDER_POSTER} alt="Movie poster" />
                        </div>
                    </div>

                    <div className="main__movie-info">
                        <h1>
                            {movieData.title}
                        </h1>
                        <ul>
                            {movieData.genres !== undefined && <li>Genre: {movieData.genres.map((genreItem) => genreItem.name).join(', ')} </li>}
                            <li>Date: {movieData.release_date}</li>
                            {movieData.production_countries && <li>Country: {movieData.production_countries.map(countries => countries.iso_3166_1).join(', ')}</li>}
                            <li>Rating: {movieData.vote_average} / 10</li>
                        </ul>

                        <p>
                            {movieData.overview}
                        </p>
                    </div>
                </div>
                <div className="main__buttons">
                    <a className="btn btn-primary" onClick={selectNewMovie}>Select</a>
                    <a className="btn btn-primary" onClick={nextMovie}>Next movie</a>
                </div>
                <div className="main__selected-movies">
                    <SelectedMovies movies={selectedMovies} deselectMovie={deselectMovie} />
                </div>
                <div className="main__randomMovie">
                    <div className="main__buttons">
                        {selectedMovies.length > 0 && <a className="btn btn-primary" onClick={pickRandomMovie}>Pick one</a>}
                    </div>
                    {randomMovie &&
                        <article className="main__movie-picked">
                            <h3>{randomMovie.title}</h3>
                            <img src={randomMovie.posterPath} alt="Random movie poster" />
                        </article>}
                </div>
            </div>
        </>
    )
}

export default Main
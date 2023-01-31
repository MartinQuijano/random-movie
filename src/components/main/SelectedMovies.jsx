import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'

export default function SelectedMovies(props) {
    return (
        props.movies.map((movie, i) => (

            <article key={i} className="main__movie-selected">
                <h3>{movie.title}</h3>
                <img src={movie.posterPath} alt="Selected movie poster" />
                <a className="btn btn-primary" onClick={(event) => props.deselectMovie(event, movie.title)}><FaTrashAlt /></a>
            </article>
        ))
    )
}
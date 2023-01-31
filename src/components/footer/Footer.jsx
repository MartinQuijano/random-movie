import React from 'react'
import './footer.css'
import TMDB_logo from '../../assets/TMDB_logo.svg'

const footer = () => {
    return (
        <div className='footer'>
            <div>Movies information courtesy of </div>
            <a href="https://www.themoviedb.org/" target="_blank">
                <img src={TMDB_logo} alt="TMBD logo" />
            </a>
        </div>
    )
}

export default footer
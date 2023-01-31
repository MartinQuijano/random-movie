const MOVIES_ENDPOINT_INFO = 'https://api.themoviedb.org/3/discover/movie?api_key=4f23b537454a2ccdcfd1f92a3761a212'
const MOVIES_ENDPOINT_CONFIG = 'https://api.themoviedb.org/3/configuration?api_key=4f23b537454a2ccdcfd1f92a3761a212'
const MOVIES_ENDPOINT_GENRES = 'https://api.themoviedb.org/3/genre/movie/list?api_key=4f23b537454a2ccdcfd1f92a3761a212'

export const getMoviesGenres = () => {
    return fetch(MOVIES_ENDPOINT_GENRES)
        .then(res => res.json())
        .then(data => data)
}

export const getMoviesConfigInfo = () => {
    return fetch(MOVIES_ENDPOINT_CONFIG)
        .then(res => res.json())
        .then(data => data)
}

export const getMoviesData = () => {
    return fetch(MOVIES_ENDPOINT_INFO)
        .then(res => res.json())
        .then(data => data)
}

export const getRandomMovieID = (amountOfPagesAndMoviesPerPageInDB, filters) => {
    return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=4f23b537454a2ccdcfd1f92a3761a212&primary_release_date.gte=${filters.initialYear}&primary_release_date.lte=${filters.finalYear}&vote_average.gte=${filters.rating}&with_genres=${filters.genre_id}`)
        .then(res => {
            if (res.ok) {
                console.log('SUCCESS')
            } else {
                console.log('Not Successful')
                return getRandomMovieID(amountOfPagesAndMoviesPerPageInDB, filters)
            }
            return res.json()
        })
        .then(data => {

            // The total of pages to search is hardcoded to 500 due to an insconsistency on the API response.
            // It should be at max 500 pages but the result provided it's higher.
            // Without the said issue, the next line should be: let randomNumberOfPage = Math.ceil(Math.random() * data.total_pages) in case the total pages returned changes.
            let randomNumberOfPage = Math.ceil(Math.random() * Math.min(data.total_pages, 500))

            return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=4f23b537454a2ccdcfd1f92a3761a212&page=${randomNumberOfPage}&primary_release_date.gte=${filters.initialYear}&primary_release_date.lte=${filters.finalYear}&vote_average.gte=${filters.rating}&with_genres=${filters.genre_id}`)
                .then(res => {
                    if (res.ok) {
                        console.log('SUCCESS')
                    } else {
                        console.log('Not Successful')
                        return getRandomMovieID(amountOfPagesAndMoviesPerPageInDB, filters)
                    }
                    return res.json()
                })
                .then(data => {
                    const movies = data.results
                    let randomNumberOfMovie = Math.floor(Math.random() * movies.length)
                    return movies[randomNumberOfMovie].id
                })
        })
}

export const getMovieByID = (movie_id) => {
    return fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=4f23b537454a2ccdcfd1f92a3761a212`)
        .then(res => {
            if (res.ok) {
                console.log('SUCCESS')
            } else {
                console.log('Not Successful')
                return getMovieByID(movie_id)
            }
            return res.json()
        })
        .then(data => data)
}
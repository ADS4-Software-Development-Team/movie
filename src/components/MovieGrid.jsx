import { useState } from 'react'
import MovieCard from './MovieCard'

const MovieGrid = ({
  movies,
  onMovieClick,
  loading,
  paginate = true,
  limit = null,
  rowMode = false,
  currentPage: externalCurrentPage,
  onPageChange: externalOnPageChange
}) => {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)

  const isPaginatedExternally = externalCurrentPage !== undefined
  const currentPage = isPaginatedExternally ? externalCurrentPage : internalCurrentPage
  const setCurrentPage = isPaginatedExternally ? externalOnPageChange : setInternalCurrentPage

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="no-movies">
        <p>No movies found. Try a different search or genre.</p>
      </div>
    )
  }

  const moviesPerPage = rowMode ? 4 : 15

  // ✅ Apply limit if provided
  const limitedMovies = limit ? movies.slice(0, limit) : movies

  // ✅ Slice for pagination ONLY if paginate === true
  const indexOfLastMovie = currentPage * moviesPerPage
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage
  const currentMovies = paginate
    ? limitedMovies.slice(indexOfFirstMovie, indexOfLastMovie)
    : limitedMovies

  const totalPages = Math.ceil(limitedMovies.length / moviesPerPage)

  return (
    <div className="movie-grid-container">
      <div className={rowMode ? 'movie-row' : 'movie-grid'}>
        {currentMovies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => onMovieClick(movie)}
          />
        ))}
      </div>

      {/* ✅ Only show pagination if paginate is true */}
      {paginate && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default MovieGrid

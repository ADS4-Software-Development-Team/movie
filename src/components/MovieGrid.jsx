import MovieCard from './MovieCard'

const MovieGrid = ({ movies, onMovieClick, loading }) => {
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

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => onMovieClick(movie)}
        />
      ))}
    </div>
  )
}

export default MovieGrid
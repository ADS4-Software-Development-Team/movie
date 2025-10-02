const MovieCard = ({ movie, onClick }) => {
  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/placeholder-movie.jpg'
        }
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span>{new Date(movie.release_date).getFullYear()}</span>
          <span className="rating">{movie.vote_average?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
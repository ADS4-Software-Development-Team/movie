import { useState, useEffect } from 'react'

const Carousel = ({ movies, onMovieClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (movies.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [movies.length])

  if (movies.length === 0) return null

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div className="carousel">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
          }}
          onClick={() => onMovieClick(movie)}
        >
          <div className="slide-info">
            <h2>{movie.title}</h2>
            <p>{movie.overview?.substring(0, 150)}...</p>
            <div className="movie-meta">
              <span>Rating: {movie.vote_average?.toFixed(1)}</span>
              <span>Release: {new Date(movie.release_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      ))}
      
      <div className="carousel-indicators">
        {movies.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
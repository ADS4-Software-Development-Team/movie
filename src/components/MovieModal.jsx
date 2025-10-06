import { useState, useEffect } from 'react'
import { X, Play, Star } from 'lucide-react'

const MovieModal = ({ movie, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null)
  const [cast, setCast] = useState([])

  // Fetch trailer
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=en-US`
        )
        const data = await response.json()
        const trailer = data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        )
        setTrailerKey(trailer?.key)
      } catch (error) {
        console.error('Error fetching trailer:', error)
      }
    }
    fetchTrailer()
  }, [movie])

  // Fetch cast
  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=en-US`
        )
        const data = await response.json()
        setCast(data.cast.slice(0, 5)) // limit to top 5 cast members
      } catch (error) {
        console.error('Error fetching cast:', error)
      }
    }
    fetchCast()
  }, [movie])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div
          className="modal-header"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
          }}
        >
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{movie.title}</h2>
          <h3>Movie Details: </h3>
          <div className="modal-meta">
            <span>
              Rating: {movie.vote_average?.toFixed(1)}{' '}
              <Star size={16} color="gold" fill="gold" />
            </span>
            <span>Release: {new Date(movie.release_date).getFullYear()}</span>
            <span>Runtime: {movie.vote_average + 93}min</span>
          </div>

          {/* Cast section */}
          <div className="modal-cast">
            <h3>Cast Members: </h3>
            <div className="cast-list">
              {cast.length > 0 ? (
                cast.map((actor) => (
                  <div key={actor.cast_id} className="cast-member">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="cast-image"
                      />
                    ) : (
                      <div className="cast-placeholder">No Image</div>
                    )}
                    <p className="cast-name">{actor.name}</p>
                    <p className="cast-character">as {actor.character}</p>
                  </div>
                ))
              ) : (
                <p>No cast available.</p>
              )}
            </div>
          </div>

          {/* Overview / Description */}
          <div className="modal-description">
            <h3>Description: </h3>
            <p className="modal-overview">{movie.overview}</p>
          </div>

          {/* Trailer section */}
          <div className="trailer-container">
            <h3 className="trailer-title">Trailer</h3>
            {trailerKey ? (
              <div className="trailer-wrapper">
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="trailer-placeholder">
                <Play size={48} />
                <span>Trailer not available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal

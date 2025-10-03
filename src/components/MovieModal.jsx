import { useState, useEffect } from 'react'
import { X, Play } from 'lucide-react'

const MovieModal = ({ movie, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null)

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        )
        const data = await response.json()
        const trailer = data.results.find(video => 
          video.type === 'Trailer' && video.site === 'YouTube'
        )
        setTrailerKey(trailer?.key)
      } catch (error) {
        console.error('Error fetching trailer:', error)
      }
    }
    fetchTrailer()
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
          <div className="modal-meta">
            <span>Rating: {movie.vote_average?.toFixed(1)}</span>
            <span>Release: {new Date(movie.release_date).getFullYear()}</span>
            <span>Runtime: {movie.runtime}min</span>
          </div>
          <p className="modal-overview">{movie.overview}</p>
          
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
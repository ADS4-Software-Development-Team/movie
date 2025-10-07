import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import GenreMenu from './components/GenreMenu'
import Carousel from './components/Carousel'
import MovieGrid from './components/MovieGrid'
import MovieModal from './components/MovieModal'
import { useMovies } from './hooks/useMovies'
import { useGenres } from './hooks/useGenres'
import './styles/App.css'

function App() {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [recentlyWatched, setRecentlyWatched] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { movies, popularMovies, loading, error } = useMovies(selectedGenre, searchQuery)
  const { genres } = useGenres()

  const recentlyWatchedRef = useRef(null)

  // Load recently watched from localStorage on mount
  useEffect(() => {
    const watched = JSON.parse(localStorage.getItem('recentlyWatched') || '[]')
    setRecentlyWatched(watched)
  }, [])

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)

    const updatedWatched = [
      movie,
      ...recentlyWatched.filter(m => m.id !== movie.id)
    ].slice(0, 8)

    setRecentlyWatched(updatedWatched)
    localStorage.setItem('recentlyWatched', JSON.stringify(updatedWatched))
  }

  const handleCloseModal = () => {
    setSelectedMovie(null)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setSelectedGenre(null)
  }

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre)
    setSearchQuery('')
    setIsMenuOpen(false)
  }

  const carouselMovies = popularMovies?.slice(0, 5) || []

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Movies</h2>
        <p>{error}</p>
        <p>Please check your API key in the .env file</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
      />

      <div className="app-body">
        <GenreMenu 
          genres={genres || []}
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
          isMenuOpen={isMenuOpen}
        />

        <main className="main-content">
          {/* Carousel Section */}
          {carouselMovies.length > 0 && (
            <Carousel movies={carouselMovies} onMovieClick={handleMovieClick} />
          )}

          {/* Recently Watched Section */}
          {recentlyWatched.length > 0 && (
            <>
              <h2 className="section-title">Recently Watched</h2>
              <div className="recently-watched-container">
                <div className="recently-watched-row" ref={recentlyWatchedRef}>
                  <MovieGrid 
                    movies={recentlyWatched}
                    onMovieClick={handleMovieClick}
                    rowMode={true}
                    limit={6}
                    paginate={false}
                  />
                </div>
              </div>
            </>
          )}

          {/* Recommendations Section */}
          <h2 className="section-title">
            {selectedGenre
              ? `${selectedGenre.name} Movies`
              : searchQuery
                ? `Search Results for "${searchQuery}"`
                : 'Popular Movies'}
          </h2>
          <MovieGrid 
            movies={movies || []}
            onMovieClick={handleMovieClick}
            loading={loading}
            paginate={true}
          />
        </main>
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App

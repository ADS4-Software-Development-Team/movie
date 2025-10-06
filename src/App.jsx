import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import GenreMenu from './components/genreMenu'
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
  const [recentlyWatchedPage, setRecentlyWatchedPage] = useState(1)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { movies, popularMovies, loading, error } = useMovies(selectedGenre, searchQuery)
  const { genres } = useGenres()

  // Ref for scrolling Recently Watched
  const recentlyWatchedRef = useRef(null)

  // Load recently watched from localStorage on mount
  useEffect(() => {
    const watched = JSON.parse(localStorage.getItem('recentlyWatched') || '[]')
    setRecentlyWatched(watched)
  }, [])

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
    
    // Add to recently watched (max 8 in storage)
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
    setIsMenuOpen(false) // Close menu on genre selection
  }

  // Safe slicing for carousel
  const carouselMovies = popularMovies?.slice(0, 5) || []

  // Scroll Recently Watched left/right
  const scrollRow = (direction) => {
    if (!recentlyWatchedRef.current) return
    const scrollAmount = 300
    recentlyWatchedRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

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
          
          {/* Recently Watched Section (max 5, horizontal row, scroll buttons) */}
          {recentlyWatched.length > 0 && (
            <>
              <h2 className="section-title">Recently Watched</h2>
              <div className="recently-watched-container">
                <div className="recently-watched-row" ref={recentlyWatchedRef}>
                  <MovieGrid 
                    movies={recentlyWatched} 
                    onMovieClick={handleMovieClick}
                    paginate={false}   // no pagination
                    limit={8}          // Show up to 8 items
                    rowMode={true}     // horizontal row
                    currentPage={recentlyWatchedPage}
                    onPageChange={setRecentlyWatchedPage}
                  />
                </div>
              </div>
            </>
          )}
          
          {/* Recommendations Section */}
          <h2 className="section-title">
            {selectedGenre ? `${selectedGenre.name} Movies` : 
             searchQuery ? `Search Results for "${searchQuery}"` : 
             'Popular Movies'}
          </h2>
          <MovieGrid 
            movies={movies || []} 
            onMovieClick={handleMovieClick}
            loading={loading}
            paginate={true}
          />
        </main>
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
//
export default App

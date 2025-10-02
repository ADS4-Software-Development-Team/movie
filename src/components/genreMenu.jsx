import { Film } from 'lucide-react'

const GenreMenu = ({ genres, selectedGenre, onGenreSelect }) => {
  const handleGenreClick = (genre) => {
    onGenreSelect(genre)
  }

  const clearGenreFilter = () => {
    onGenreSelect(null)
  }

  return (
    <div className="genre-menu">
      <div className="genre-list">
        <div 
          className={`genre-item ${!selectedGenre ? 'selected' : ''}`}
          onClick={clearGenreFilter}
        >
          <h3>All Genres</h3>
        </div>
        {genres.map(genre => (
          <div
            key={genre.id}
            className={`genre-item ${selectedGenre?.id === genre.id ? 'selected' : ''}`}
            onClick={() => handleGenreClick(genre)}
          >
            <span>{genre.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GenreMenu
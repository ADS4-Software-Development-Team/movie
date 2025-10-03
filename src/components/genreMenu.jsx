import { Film } from 'lucide-react' 

const GenreMenu = ({ genres, selectedGenre, onGenreSelect }) => {
  const handleGenreClick = (genre) => {
    onGenreSelect(genre)
  }

  const clearGenreFilter = () => {
    onGenreSelect(null)
  }

  return (
    <div className="genre-menu sticky top-0 bg-white shadow-md z-50 p-2">
      <div className="genre-list flex flex-col gap-2">
        <div 
          className={`genre-item cursor-pointer p-2 rounded ${!selectedGenre ? 'bg-gray-200 font-bold' : ''}`}
          onClick={clearGenreFilter}
        >
          <h3>All Genres</h3>
        </div>
        {genres.map(genre => (
          <div
            key={genre.id}
            className={`genre-item cursor-pointer p-2 rounded ${selectedGenre?.id === genre.id ? 'bg-blue-500 text-white font-bold' : ''}`}
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

import { useState } from 'react'
import { Search, Film } from 'lucide-react'

const Header = ({ onSearch, searchQuery }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(localSearchQuery)
  }

  const handleInputChange = (e) => {
    setLocalSearchQuery(e.target.value)
    // If input is cleared, clear the search
    if (e.target.value === '') {
      onSearch('')
    }
  }

  return (
    <header>
      <div className="header-content">
        <div className="logo">
          <Film size={32} />
          <span>MovieDB</span>
        </div>
        
        <div className="search-container">
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for movies..."
              value={localSearchQuery}
              onChange={handleInputChange}
            />
            <button type="submit" className="search-button">
              <Search size={20} />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

export default Header
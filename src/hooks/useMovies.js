import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const useMovies = (selectedGenre, searchQuery) => {
  const [movies, setMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPopularMovies()
  }, [])

  useEffect(() => {
    if (!API_KEY) {
      setError('API key is missing. Please check your .env file.')
      return
    }

    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre.id)
    } else if (searchQuery) {
      searchMovies(searchQuery)
    } else {
      setMovies(popularMovies)
    }
  }, [selectedGenre, searchQuery, popularMovies])

  const fetchPopularMovies = async () => {
    try {
      if (!API_KEY) {
        setError('API key is missing. Please check your .env file.')
        return
      }

      setLoading(true)
      setError(null)
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
      )
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setPopularMovies(data.results || [])
      setMovies(data.results || [])
    } catch (err) {
      setError(`Failed to fetch popular movies: ${err.message}`)
      setPopularMovies([])
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMoviesByGenre = async (genreId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=1`
      )
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setMovies(data.results || [])
    } catch (err) {
      setError(`Failed to fetch movies by genre: ${err.message}`)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const searchMovies = async (query) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
      )
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setMovies(data.results || [])
    } catch (err) {
      setError(`Failed to search movies: ${err.message}`)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  return { movies, popularMovies, loading, error }
}
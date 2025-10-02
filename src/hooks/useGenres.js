import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const useGenres = () => {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    try {
      if (!API_KEY) {
        setError('API key is missing. Please check your .env file.')
        return
      }

      setLoading(true)
      setError(null)
      const response = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
      )
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setGenres(data.genres || [])
    } catch (err) {
      setError(`Failed to fetch genres: ${err.message}`)
      setGenres([])
    } finally {
      setLoading(false)
    }
  }

  return { genres, loading, error }
}
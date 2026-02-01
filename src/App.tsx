import { useEffect, useState } from 'react'
import CityWeather from './components/CityWeather'

type City = {
  name: string
  latitude: number
  longitude: number
}

type CityWeatherData = {
  name: string
  temperature: number | null
  humidity: number | null
  precipitationProbability: number | null
  windSpeed: number | null
  status: 'ok' | 'error'
}

const cities: City[] = [
  { name: 'Tel Aviv', latitude: 32.0853, longitude: 34.7818 },
  { name: 'Jerusalem', latitude: 31.7683, longitude: 35.2137 },
  { name: 'Haifa', latitude: 32.794, longitude: 34.9896 },
  { name: 'Eilat', latitude: 29.5577, longitude: 34.9519 },
  { name: 'London', latitude: 51.5072, longitude: -0.1276 },
  { name: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Toronto', latitude: 43.6532, longitude: -79.3832 },
]

function App() {
  // Stores the weather result for each city.
  const [weather, setWeather] = useState<CityWeatherData[]>([])
  // Controls the loading spinner.
  const [loading, setLoading] = useState(false)
  // Shows a message if something goes wrong.
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // Tracks which city card is expanded.
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  useEffect(() => {
    // Fetch weather for a single city.
    const fetchCityWeather = async (city: City): Promise<CityWeatherData> => {
      try {
        // Build the Open-Meteo URL using the city's coordinates.
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}` +
          '&current=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m' +
          '&temperature_unit=celsius'

        // Call the API.
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        // Read the JSON data.
        const data = await response.json()
        const temperature = data?.current?.temperature_2m
        const humidity = data?.current?.relative_humidity_2m
        const precipitationProbability = data?.current?.precipitation_probability
        const windSpeed = data?.current?.wind_speed_10m

        if (typeof temperature !== 'number') {
          throw new Error('Temperature missing')
        }

        // Success case.
        return {
          name: city.name,
          temperature,
          humidity: typeof humidity === 'number' ? humidity : null,
          precipitationProbability:
            typeof precipitationProbability === 'number'
              ? precipitationProbability
              : null,
          windSpeed: typeof windSpeed === 'number' ? windSpeed : null,
          status: 'ok',
        }
      } catch (cityError) {
        // Failure case for a single city.
        return {
          name: city.name,
          temperature: null,
          humidity: null,
          precipitationProbability: null,
          windSpeed: null,
          status: 'error',
        }
      }
    }

    // Load weather for all cities.
    const loadWeather = async () => {
      setLoading(true)
      setErrorMessage(null)

      try {
        // Run all requests in parallel.
        const results = await Promise.all(cities.map(fetchCityWeather))
        setWeather(results)
      } catch (error) {
        setErrorMessage('Unable to load weather right now. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    // Start loading when the app opens.
    void loadWeather()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-emerald-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-700 to-emerald-500 p-6 text-center text-white shadow-2xl">
          <header>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Simple Weather Dashboard
            </h1>
          </header>
        </div>

        {errorMessage && (
          <div
            className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-amber-800"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            <p className="text-sm text-slate-600">Loading weather...</p>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {weather.map((city) => (
            <CityWeather
              key={city.name}
              name={city.name}
              temperature={city.temperature}
              humidity={city.humidity}
              precipitationProbability={city.precipitationProbability}
              windSpeed={city.windSpeed}
              status={city.status}
              isSelected={selectedCity === city.name}
              onToggle={() =>
                setSelectedCity((current) =>
                  current === city.name ? null : city.name,
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App

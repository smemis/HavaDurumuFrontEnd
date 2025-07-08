import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Sun, Moon } from 'lucide-react';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState('Istanbul');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'https://havadurumu-production.up.railway.app/api';
//const API_BASE_URL = 'http://localhost:3001/api';
//const API_BASE_URL = 'https://your-backend-url.com/api';


  // Hava durumu verilerini getir
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/weather/${cityName}`),
        fetch(`${API_BASE_URL}/forecast/${cityName}`)
      ]);

      if (!weatherResponse.ok) {
        throw new Error('Şehir bulunamadı!');
      }

      const weather = await weatherResponse.json();
      const forecast = await forecastResponse.json();

      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde varsayılan şehir verilerini getir
  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  // Arama işlemi
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city.trim());
    }
  };

  // Hava durumu ikonu URL'si
  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  // Sıcaklık rengi
  const getTemperatureColor = (temp) => {
    if (temp <= 0) return 'text-blue-600';
    if (temp <= 10) return 'text-blue-400';
    if (temp <= 20) return 'text-green-500';
    if (temp <= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🌤️ Hava Durumu</h1>
          <p className="text-blue-100">Şehrinizin güncel hava durumu bilgilerini görün</p>
        </div>

        {/* Arama Formu */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder="Şehir adı girin..."
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-white font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Aranıyor...' : 'Ara'}
            </button>
          </div>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 text-red-100">
            ❌ {error}
          </div>
        )}

        {/* Ana Hava Durumu Kartı */}
        {weatherData && (
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-200" />
                  <h2 className="text-2xl font-bold text-white">
                    {weatherData.city}, {weatherData.country}
                  </h2>
                </div>
                <p className="text-blue-100 capitalize">{weatherData.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={getWeatherIconUrl(weatherData.icon)}
                  alt={weatherData.description}
                  className="w-16 h-16"
                />
                <div className={`text-5xl font-bold ${getTemperatureColor(weatherData.temperature)}`}>
                  {weatherData.temperature}°C
                </div>
              </div>
            </div>

            {/* Detaylı Bilgiler */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <Thermometer className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                <p className="text-sm text-blue-200">Hissedilen</p>
                <p className="text-xl font-bold text-white">{weatherData.feelsLike}°C</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <Droplets className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                <p className="text-sm text-blue-200">Nem</p>
                <p className="text-xl font-bold text-white">{weatherData.humidity}%</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <Wind className="w-8 h-8 text-green-300 mx-auto mb-2" />
                <p className="text-sm text-blue-200">Rüzgar</p>
                <p className="text-xl font-bold text-white">{weatherData.windSpeed} m/s</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <Eye className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <p className="text-sm text-blue-200">Görüş</p>
                <p className="text-xl font-bold text-white">{weatherData.visibility} km</p>
              </div>
            </div>

            {/* Gün Doğumu/Batımı */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                <Sun className="w-6 h-6 text-yellow-300" />
                <div>
                  <p className="text-sm text-blue-200">Gün Doğumu</p>
                  <p className="text-lg font-bold text-white">{weatherData.sunrise}</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                <Moon className="w-6 h-6 text-purple-300" />
                <div>
                  <p className="text-sm text-blue-200">Gün Batımı</p>
                  <p className="text-lg font-bold text-white">{weatherData.sunset}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5 Günlük Tahmin */}
        {forecastData && (
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">5 Günlük Hava Durumu Tahmini</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {forecastData.forecasts.map((forecast, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-200 mb-2">{forecast.date}</p>
                  <img
                    src={getWeatherIconUrl(forecast.icon)}
                    alt={forecast.description}
                    className="w-12 h-12 mx-auto mb-2"
                  />
                  <p className={`text-2xl font-bold ${getTemperatureColor(forecast.temperature)} mb-1`}>
                    {forecast.temperature}°C
                  </p>
                  <p className="text-xs text-blue-200 capitalize">{forecast.description}</p>
                  <p className="text-xs text-blue-300 mt-1">Nem: {forecast.humidity}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-blue-100">
          <p>Hava durumu verileri OpenWeatherMap API'den alınmaktadır</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;

"use client";

import { useState, useEffect, useCallback } from "react";

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  city: string;
  country: string;
  sunrise: number;
  sunset: number;
  uvIndex?: number;
}

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

const WEATHER_ICONS: Record<string, string> = {
  "01d": "sun",
  "01n": "moon",
  "02d": "cloud-sun",
  "02n": "cloud-moon",
  "03d": "cloud",
  "03n": "cloud",
  "04d": "clouds",
  "04n": "clouds",
  "09d": "cloud-rain",
  "09n": "cloud-rain",
  "10d": "cloud-sun-rain",
  "10n": "cloud-moon-rain",
  "11d": "cloud-lightning",
  "11n": "cloud-lightning",
  "13d": "snowflake",
  "13n": "snowflake",
  "50d": "cloud-fog",
  "50n": "cloud-fog",
};

export function useWeather() {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Get user's geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setGeolocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      let errorMessage = "Unable to get your location";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission denied";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out";
          break;
      }
      setGeolocation((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes cache
    });
  }, []);

  // Fetch weather data when we have coordinates
  const fetchWeather = useCallback(async () => {
    if (!geolocation.latitude || !geolocation.longitude) return;

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    // If no API key, use mock data
    if (!apiKey) {
      const mockWeather = generateMockWeather();
      setWeather(mockWeather);
      return;
    }

    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${geolocation.latitude}&lon=${geolocation.longitude}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();

      setWeather({
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: WEATHER_ICONS[data.weather[0].icon] || "sun",
        city: data.name,
        country: data.sys.country,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      });

      // Optionally fetch UV index (requires One Call API)
      try {
        const uvResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${geolocation.latitude}&lon=${geolocation.longitude}&appid=${apiKey}`
        );
        if (uvResponse.ok) {
          const uvData = await uvResponse.json();
          setWeather((prev) => prev ? { ...prev, uvIndex: Math.round(uvData.value) } : prev);
        }
      } catch {
        // UV index is optional, ignore errors
      }
    } catch (error) {
      setWeatherError(error instanceof Error ? error.message : "Failed to fetch weather");
      // Fall back to mock data on error
      const mockWeather = generateMockWeather();
      setWeather(mockWeather);
    } finally {
      setWeatherLoading(false);
    }
  }, [geolocation.latitude, geolocation.longitude]);

  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude && !geolocation.loading) {
      fetchWeather();
    }
  }, [geolocation.latitude, geolocation.longitude, geolocation.loading, fetchWeather]);

  // Generate mock weather when no API key or on error
  const generateMockWeather = (): WeatherData => {
    const hour = new Date().getHours();
    const month = new Date().getMonth();

    // Simulate seasonal temperatures
    let baseTemp = 20;
    if (month >= 11 || month <= 1) baseTemp = 5; // Winter
    else if (month >= 2 && month <= 4) baseTemp = 15; // Spring
    else if (month >= 5 && month <= 7) baseTemp = 28; // Summer
    else baseTemp = 18; // Fall

    // Add some randomness
    const temp = baseTemp + Math.floor(Math.random() * 8) - 4;

    const conditions = [
      { desc: "Clear sky", icon: hour >= 6 && hour < 18 ? "sun" : "moon" },
      { desc: "Few clouds", icon: hour >= 6 && hour < 18 ? "cloud-sun" : "cloud-moon" },
      { desc: "Scattered clouds", icon: "cloud" },
      { desc: "Broken clouds", icon: "clouds" },
      { desc: "Light rain", icon: "cloud-rain" },
    ];

    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      temp,
      feelsLike: temp - 2,
      humidity: 50 + Math.floor(Math.random() * 30),
      description: condition.desc,
      icon: condition.icon,
      city: "Your Location",
      country: "",
      sunrise: new Date().setHours(6, 30, 0, 0) / 1000,
      sunset: new Date().setHours(18, 30, 0, 0) / 1000,
      uvIndex: Math.floor(Math.random() * 8) + 1,
    };
  };

  // If geolocation failed but we need weather, use mock data
  useEffect(() => {
    if (geolocation.error && !weather) {
      const mockWeather = generateMockWeather();
      setWeather(mockWeather);
    }
  }, [geolocation.error, weather]);

  return {
    weather,
    loading: geolocation.loading || weatherLoading,
    error: weatherError || geolocation.error,
    hasLocation: !!(geolocation.latitude && geolocation.longitude),
    refetch: fetchWeather,
  };
}

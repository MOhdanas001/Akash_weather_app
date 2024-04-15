// WeatherPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import brokencloud from '../broken-cloud.svg'
import clearsky from '../clear-sky.svg'
import lightrain from '../light-rain.svg'
import moderaterain from '../moderate-rain.svg'
import scattercloud from '../scatter-cloud.svg'

interface WeatherData {
  temperature: number;
  weatherDescription: string;
  humidity: number;
  windSpeed: number;
  pressure:number;
  high:number;
  low:number;
  icon:string;
}

const WeatherPage: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const[temperature,settemperature]=useState(0);
  const[temp,setTemp]=useState("C")

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `http://api.openweathermap.org/data/2.5/weather?q=${cityId}&appid=cbbdf6296227c362411653ac32ac230d`
        );
        const data=await response.json();
          console.log(data);
        const weatherData: WeatherData = {
          temperature: Math.round(data.main.temp-273),
          weatherDescription: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: data.weather[0].icon,
          pressure:data.main.pressure,
          high:Math.floor(data.main.temp_min-273),
          low:Math.floor(data.main.temp_max-273)
          
        };
        settemperature(data.main.temp-273);
        setWeather(weatherData);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };
    fetchWeather();
  
  }, [cityId]);

 
  if (!weather) return <div>Loading...</div>;

  const weatherIcons: { [key: string]: string } = {
    'broken clouds': brokencloud,
    'clear sky': clearsky,
    'light rain': lightrain,
    'scattered clouds': moderaterain,
    'moderate rain': scattercloud,
  };
  
  return (

    <div className="min-h-screen flex items-center justify-center hover:bg-slate-200 drop-shadow-2xl ">
    <div className="flex flex-col bg-white rounded p-5 w-full max-w-xs">
						<div className="font-bold text-xl">Weather for {cityId}</div>
             <p>Switch temperature
                <button className="ml-2 mt-2 cursor-pointer border-black border-2 hover:bg-slate-400 rounded-full p-2 " onClick={() => {
                  temp==="C" ? settemperature((temperature*9)/5+32) : settemperature((temperature-32)*5/9);
                  temp==="C" ? setTemp("F") : setTemp("C");
                }}>
                Change to {temp==="F"?"C":"F"}
              </button>
             </p>
						<div className="text-sm text-gray-500">{new Date().toLocaleString("en-US", { weekday: "long" })},{" "}
        {new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}</div>
						<div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">
              {/* svg section */}
              <img src={weatherIcons[weather.weatherDescription.toLowerCase()]} alt={weather.weatherDescription} className="w-full h-full" />
						</div>
						  <div className="flex flex-row items-center justify-center mt-6">
							<div className="font-medium text-6xl">{temperature.toFixed(2)}{temp}</div>

							<div className="flex flex-col items-center ml-6">
							<div className='text-xl'>{weather.weatherDescription}</div>	
							</div>
					   	</div>
              
						<div className="flex flex-row justify-between mt-6">
              <div className="flex flex-col items-center">
								<div className="font-medium text-sm">Description</div>
								<div className="text-sm text-gray-500">{weather.weatherDescription}</div>
							</div>
							<div className="flex flex-col items-center">
								<div className="font-medium text-sm">Wind</div>
								<div className="text-sm text-gray-500">{weather.windSpeed}</div>
							</div>
							<div className="flex flex-col items-center">
								<div className="font-medium text-sm">Humidity</div>
								<div className="text-sm text-gray-500">{weather.humidity}</div>
							</div>
							
						</div>
					</div>
</div>

  );
};

export default WeatherPage;
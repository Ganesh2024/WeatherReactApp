import React,{ useState } from 'react' 
import './App.css'
import './index.css'
import Search from './components/Search'
import CurrentWeather from './components/current-weather/CurrentWeather'
import {WEATHER_API_URL,WEATHER_API_KEY} from "./api";
import Forecast from './components/forecast/Forecast'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

function App() {
  const [currentWeather,setCurrentWeather]=useState(null);
  const [forecast,setForecast]=useState(null);
  const [loading,setLoading] = useState(0);

  const handleOnSearchChange = (searchData)=>{
    const [lat,lon]=searchData.value.split(" ");

    const currentWeatherFetch=fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const forecastFetch=fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    setLoading(true)
    Promise.all([currentWeatherFetch,forecastFetch])
    .then(async(response)=>{
      const weatherResponse = await response[0].json();
      const forecastResponse = await response[1].json();
      setLoading(false)
      setCurrentWeather({city: searchData.label, ...weatherResponse});
      setForecast({city: searchData.label, ...forecastResponse});
    })
    .catch((err)=>{
      setLoading(false)
      console.log(err);
    })
  }
  console.log(currentWeather,'aaa');
  return (
    <div className='container'>
      {/* here we are sending handleOnSearchChange fun
        as onSearchChange to component Search.jsx */}
      <Search onSearchChange={handleOnSearchChange}/>
      {!loading  ?  <CurrentWeather data={currentWeather} /> : <SkeletonLoading/>}
      {forecast && <Forecast data={forecast}/>}
    </div>
  )
}

const SkeletonLoading = () => {
  return (
  <Stack spacing={1} sx={{display:"flex",alignItems:"center",padding:"1rem 0"}}>
    <Skeleton variant="rounded" width={300} height={250} />
  </Stack>
  )
}
export default App

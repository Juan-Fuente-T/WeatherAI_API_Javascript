//import logo from './logo.svg';
//import './App.css';
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import WeatherDisplayWeather from './components/WeatherDisplayWeather';
import { ChakraProvider, Box, Heading } from '@chakra-ui/react';
import WeatherDisplayAI from './components/WeatherDisplayAI';
const { infoWeather, infoOpenAI } = require('./components/Datos.js');

function App() {
  // Definimos un estado inicial para los datos meteorológicos
  const [datosMeteorologicos, setDatosMeteorologicos] = useState(null);
  const [datosOpenAI, setDatosOpenAI] = useState(null);

  async function consultarTiempo(inputValue) {
    try {
      const { weatherData } = await infoWeather(inputValue);
      //console.log("DatosTiempo: ", weatherData); //impresion de depuracion
      // Actualizar el estado con los datos obtenidos
      setDatosMeteorologicos({
        datos_meteorologicos: weatherData
      });

      /*     const dailyData = weather.daily || {};
    // Extraer los datos de dentro de la previsión para siete días
    const maxTemperatures = dailyData.apparent_temperature_max || 'No disponible';
    const minTemperatures = dailyData.apparent_temperature_min || 'No disponible';
    const rainProbabilities = dailyData.precipitation_probability_mean || 'No disponible';
    const dailyWeatherCodes = dailyData.weathercode || 'No disponible';   */
      //console.log("Datos", weatherData.daily.apparent_temperature_max);
      const OpenAIResponse = await infoOpenAI(inputValue, weatherData);
      //console.log("OpenAIResponse: ", OpenAIResponse); //impresion de depuracion
      setDatosOpenAI({ datosOpenAI: OpenAIResponse });
    } catch (error) {
      console.error(`Error al consultar el tiempo: ${error.message}`);
    }
  }

  return (
    <ChakraProvider> {/* Se envuelve la app con ChakraProvider para usar sus componentes UI*/}
      <Box textAlign="center" p={4}>

        <Heading as="h1" size="2xl" color={'teal.800'} >
          Pronóstico del Tiempo con AI
        </Heading>
        {/*Se renderiza el componente InputForm y se pasa la función consultarTiempo como prop */}
        <InputForm consultarTiempo={consultarTiempo} font color={'teal.800'} />
        {/* Se renderiza el componente WeatherDisplay y se pasan los datos meteorológicos como prop */}
        <WeatherDisplayAI datosOpenAI={datosOpenAI || {}} />
        <WeatherDisplayWeather datosMeteorologicos={datosMeteorologicos || {}} />
      </Box>
    </ChakraProvider>
  );
}
export default App; // Se exporta el componente App para su uso 



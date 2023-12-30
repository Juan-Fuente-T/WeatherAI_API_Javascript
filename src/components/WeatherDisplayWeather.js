import React, { useState, useEffect, useRef } from 'react';
import { Box, Heading, Divider, Flex, ChakraProvider, Text, useBreakpointValue, extendTheme } from '@chakra-ui/react';
import InfoWindow from './InfoWindow.js';
import weathercodes from '../WeathercodesList.js'
import LongTextScroll from './LongTextScroll';


// Define el componente WeatherDisplay
function WeatherDisplayWeather({ datosMeteorologicos }) {
  // Se extraen los datos iniciales de datosMeteorologicos
  const initialCurrentWeather = datosMeteorologicos?.datos_meteorologicos?.current_weather || {};
  const initialDailyForecast = datosMeteorologicos?.datos_meteorologicos?.daily || {};


  // Se nicializan los estados con los datos iniciales
  const [currentWeather, setCurrentWeather] = useState(initialCurrentWeather);
  const [dailyForecast, setDailyForecast] = useState(initialDailyForecast);

  // console.log("Lluvia ", dailyForecast.precipitation_probability_mean[0], "%")

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // Llamada a datos e impresiones para depuración en la consola
  /*const temperaturaActual = datosMeteorologicos?.respuesta_openAI;
  console.log("Temp. actual", temperaturaActual);
  console.log("Datos meteorológicos", datosMeteorologicos);
  console.log("Initial current Weather", initialCurrentWeather);
  console.log("Initial daily Forecast", initialDailyForecast);
  console.log("Temp-max-antes:",dailyForecast.apparent_temperature_max);
  console.log("Initial AI",initialRespuestaOpenAI);*/

  // Se actualizan los estados cuando cambian los datos
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (container & content) {

      const scrollSpeed = 30; // Ajusta la velocidad de desplazamiento según tus preferencias
      const contentWidth = content.clientWidth;
      const containerWidth = container.clientWidth;

      //Funcion que desplaza el texto en la ventana principal
      function scrollText() {
        if (contentWidth > containerWidth) {
          content.style.transform = `translateX(${containerWidth}px)`; // Inicializa la posición del texto
          const animationDuration = (contentWidth / scrollSpeed) * 1000;

          content.style.transition = `transform ${animationDuration}ms linear`;
          content.style.transform = `translateX(-${contentWidth}px)`; // Desplaza el texto
        }
      }

      scrollText();

      // Reinicia el desplazamiento cuando termine la animación
      content.addEventListener('transitionend', () => {
        content.style.transition = 'none';
        content.style.transform = `translateX(${containerWidth}px)`;
        setTimeout(scrollText, 500); // Pausa antes de reiniciar
      });
    }


    // Actualizamos los estados con los datos de datosMeteorologicos
    setCurrentWeather(datosMeteorologicos?.datos_meteorologicos?.current_weather || {});
    setDailyForecast(datosMeteorologicos?.datos_meteorologicos?.daily || {});
  }, [datosMeteorologicos]); // Esto escucha cambios en los datos iniciales


  // Función para manejar cambios en el clima actual
  const handleCurrentWeatherChange = (key, newValue) => {
    console.log(`Cambio en ${key}: ${newValue}`);
    setCurrentWeather((prevWeather) => ({
      ...currentWeather,
      [key]: newValue,
    }));
  };

  // Función para manejar cambios en el pronóstico diario
  const handleDailyForecastChange = (key, newValue) => {
    setDailyForecast((prevWeather) => ({
      ...dailyForecast,
      [key]: newValue,
    }));
  };


  // Se renderiza el componente que muestra las respuestas, WeatherDisplay
  return (
    //Se envuelve todo en Chakra provider para acceder a sus componentes
    <ChakraProvider>
      <Box p={4} >
        <Divider my={2} />

        <Heading size="lg" color={'teal.800'}>
          Información Detallada
        </Heading>

        <Divider my={1} />
        <Box backgroundColor={'teal.800'} borderRadius={'10'} mb={'1'} pb={'3'}>
          <Flex

            p={4}
            maxW={'100%'}
            flexDirection={useBreakpointValue({ base: "column", md: "row", lg: "row" })}
            alignContent={['center', 'center', 'space-around']}  //flexDirection responsive especifica segun el tamaño de la pantalla
            alignItems={['center', 'center', 'stretch']}
            backgroundColor={'teal.800'}
            borderRadius="10px"
            flexWrap={'wrap'}
            m={'0'}
          >

            {/* Sección Izquierda */}
            <Flex
              width={['100%', '100%', '45%']}
              textColor={'darkAlfa.900'}
              fontSize="1.9xl"
              fontWeight="bold"
              flexDirection="column"
              justifyContent={'center'}
              alignItems={['center', 'center', 'stretch']}
              padding="10px"
              margin={['5px', '5px', '5px', '5px']} // 
              backgroundColor={'teal.500'}
              flex={1}
              borderRadius="10px"
              overflowX="auto"
            //height={'360px'}
            >
              <Heading size="md" mb={'1%'}>Tiempo Actual</Heading>
              <Box mt={useBreakpointValue({ base: 0, md: 4, lg: 4 })}></Box>
              <InfoWindow
                label="Tiempo"
                value={
                  currentWeather && weathercodes.hasOwnProperty(currentWeather.weathercode)
                    ? weathercodes[currentWeather.weathercode]
                    : 'Introduce una localidad o un codigo postal' //se evalua si existen los datos antes de asignarlos o se devuelve Esperando solicitud
                }
                onChange={(value) => handleCurrentWeatherChange('weathercode', value)}//Se asignan los valores correspondientes
                customClassName='scroll-fast' // Se asigna una clase CSS específica para controlar la velocidad de desplazamiento
              />
              <Box mt={useBreakpointValue({ base: 0, md: 10, lg: 12 })}></Box> {/* Ajusta el espacio vertical según el tamaño de pantalla */}
              <InfoWindow
                label="Temperatura"
                value={currentWeather.temperature ? `${currentWeather.temperature}°C` : 'Esperando'} //Se cogen el valor si esta dispponible
                onChange={(value) => handleCurrentWeatherChange('temperature', value)}//Se asignan el valor correspondientes
              />

            </Flex>

            {/* Sección Derecha */}
            <Flex
              width={['100%', '100%', '45%']}
              textColor={'darkAlfa.900'}
              fontSize="1.9xl"
              fontWeight="bold"
              flexDirection="column"
              justifyContent={'center'}
              alignItems={['center', 'center', 'stretch']}
              padding="0%"
              margin={['5px', '5px', '5px', '5px']} // 
              backgroundColor={'teal.500'}
              flex={2}
              borderRadius="10px">

              <Heading size="md" pt={'3%'}>Previsión para mañana</Heading>
              <Flex flexDirection={useBreakpointValue({ base: "column", md: "row", lg: "row" })} justifyContent="space-between" alignItems="center" padding="20px">
                <InfoWindow
                  label="Previsión para mañana"
                  value={currentWeather && weathercodes.hasOwnProperty(currentWeather.weathercode) ? weathercodes[currentWeather.weathercode] : 'Introduce una localidad o un codigo postal'} //se evalua si existen los datos antes de asignarlos o se devuelve Esperando solicitud
                  onChange={(value) => handleCurrentWeatherChange('weathercode', value)}
                  customClassName='scroll-fast' // Se asigna una clase CSS específica para controlar la velocidad de desplazamiento
                />
                <InfoWindow
                  label="Probabilidad de Lluvia"
                  value={dailyForecast.precipitation_probability_mean ? `${dailyForecast.precipitation_probability_mean[1]}%` : 'Esperando'}//se evalua si existen los datos antes de asignarlos o se devuelve Esperando solicitud
                  onChange={(value) => handleDailyForecastChange('precipitation_probability_mean', value)}//Se asignan los valores correspondientes
                />
              </Flex>
              <Heading size={'sm'} >Temperaturas</Heading>
              <Flex flexDirection={useBreakpointValue({ base: "column", md: "row", lg: "row" })} justifyContent="space-between" alignItems="center" padding="20px">
                <InfoWindow
                  label="Máximas"
                  value={dailyForecast.apparent_temperature_max ? `${dailyForecast.apparent_temperature_max[1]}°C` : 'Esperando'} //se evalua si existen los datos antes de asignarlos o se devuelve Esperando solicitud
                  onChange={(value) => handleDailyForecastChange('apparent_temperature_max', value)}//Se asignan los valores correspondientes
                />
                <InfoWindow
                  label="Mínimas"
                  value={dailyForecast.apparent_temperature_min ? `${dailyForecast.apparent_temperature_min[1]}°C` : 'Esperando'} //se evalua si existen los datos antes de asignarlos o se devuelve Esperando solicitud
                  onChange={(value) => handleDailyForecastChange('apparent_temperature_min', value)} //Se asignan los valores correspondientes
                />
              </Flex>
            </Flex>
          </Flex>
          <Flex display={'flex'} flexDirection={'column'} maxW={'99%'} mr={'5'} ml={'5'} marginBottom="10px" pr={'3'} pl={'3'} pt={'3'} backgroundColor={'teal.500'} alignContent={'center'} alignItems={'center'} borderRadius="10px" >
            <LongTextScroll style={{ flex: '0 1 auto', backgroundColor: 'red.800', }} text={`En los siguientes 5 días - Temperaturas máximas: ${dailyForecast.apparent_temperature_max?.slice(2, 7).join('°C, ') || 'Esperando'}°C - Mínimas: ${dailyForecast.apparent_temperature_min?.slice(2, 7).join('°C, ') || 'Esperando'}°C - Lluvias: ${dailyForecast.precipitation_probability_mean?.slice(2, 7).join('%, ') || 'Esperando'}%.`} />
          </Flex>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
export default WeatherDisplayWeather;
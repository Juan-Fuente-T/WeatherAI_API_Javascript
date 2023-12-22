import axios from 'axios';
//const axios = require('axios');
const config = require('../config.json');
const weathercodes = require('../WeathercodesList');


// Función que verifica si la ubicación introducida es válida (solo letras y espacios)
function isLocation(inputValue) {
    const locationPattern = /^[A-Za-z\s]+$/;
    return locationPattern.test(inputValue);
}

// Función que verifica si el código postal introducido es un formato válido (5 dígitos numéricos)
function isPostalCode(inputValue) {
    const postalCodePattern = /^\d{5}$/;
    return postalCodePattern.test(inputValue);
}

// Función que obtiene la latitud, longitud y zona horaria a partir del código postal
async function geocodePostalCode(postalCode) {
    const geocodeApiUrl = `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=Spain&format=json&limit=1`;

    try {
        const response = await axios.get(geocodeApiUrl);
        const locationData = response.data[0];

        if (!locationData) {
            throw new Error(`No se pudo obtener la ubicación para el código postal ${postalCode}`);
        }

        const { lat, lon } = locationData;
        const timezone = await getTimezone(lat, lon);

        return { latitude: lat, longitude: lon, timezone };
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

// Función que obtiene la latitud, longitud y zona horaria a partir de la ubicación
async function geocodeLocation(location) {
    const geocodeApiUrl = `https://nominatim.openstreetmap.org/search?city=${location}&country=Spain&format=json&limit=1`;

    try {
        const response = await axios.get(geocodeApiUrl);
        const locationData = response.data[0];

        if (!locationData) {
            console.error("No se pudo encontrar la ubicación.");
            return { latitude: null, longitude: null, timezone: null };
        }

        const { lat, lon } = locationData;
        const timezone = await getTimezone(lat, lon);

        //console.log(`Ubicación encontrada. Latitud: ${lat}, Longitud: ${lon}`);//impresion de depuracion
        return { latitude: lat, longitude: lon, timezone };
    } catch (error) {
        console.error(`Ocurrió un error al buscar la ubicación: ${error.message}`);
        return { latitude: null, longitude: null, timezone: null };
    }
}

// Función que obtiene el timezone a partir de la latitud y longitud
async function getTimezone(latitude, longitude) {
    //console.log("Variables de entorno:", process.env);
    const myApiKey = config.MY_API_KEY;
    const timezoneApiUrl = `https://api.ipgeolocation.io/timezone?apiKey=${myApiKey}&lat=${latitude}&lon=${longitude}`;

    try {
        const response = await axios.get(timezoneApiUrl);
        return response.data.timezone;
    } catch (error) {
        console.error(`No se pudo obtener el timezone: ${error.message}`);
        throw error;
    }
}

// Función que consulta la predicción meteorológica
async function getWeather(latitude, longitude, timezone) {
    const openMeteoApiUrl = "https://api.open-meteo.com/v1/forecast";

    const params = {
        latitude,
        longitude,
        timezone,
        daily: "apparent_temperature_max,apparent_temperature_min,precipitation_probability_mean,weathercode,sunrise,sunset",
        current_weather: "true",
        forecast_days: 7
    };

    try {
        const response = await axios.get(openMeteoApiUrl, { params });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener la predicción meteorológica: ${error.message}`);
        throw error;
    }
}

// Función que realiza una consulta a OpenAI

async function infoOpenAI(locationOrPostalCode, weather) {
    //console.log("INPUT", locationOrPostalCode); //impresion de depuracion
    const currentWeather = weather.current_weather;
    const temperature = currentWeather.temperature;
    const windspeed = currentWeather.windspeed;
    const weathercodeToday = currentWeather.weathercode;
    //console.log("DatosDetallados", temperature, windspeed, weathercodeToday); //impresion de depuracion
    const openai_api_key = config.api_key_openAI;
    const openAIUrl = "https://api.openai.com/v1/chat/completions";  // Reemplazar con la URL real
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openai_api_key}`
    };

    // Evaluar si el valor weathercode está en el diccionario de códigos de condiciones meteorológicas y, si está, cambiar el nuevo valor por el número inicial
    let weatherCode;
    if (weathercodeToday in weathercodes) {
        weatherCode = weathercodes[weathercodeToday];
    } else {
        weatherCode = 'No disponible'; // Notificación de error
    }

    // Extraer datos de la previsión para siete días
    const dailyData = weather.daily || {};
    // Extraer los datos de dentro de la previsión para siete días
    const maxTemperatures = dailyData.apparent_temperature_max || 'No disponible';
    const minTemperatures = dailyData.apparent_temperature_min || 'No disponible';
    const rainProbabilities = dailyData.precipitation_probability_mean || 'No disponible';
    const dailyWeatherCodes = dailyData.weathercode || 'No disponible';
    //console.log("DatosDetalladosDaily", maxTemperatures, minTemperatures, rainProbabilities, weathercodes); //impresion de depuracion
    // Cambiar los valores de condiciones meteorológicas por el número inicial
    const dailyWeatherCodesMapped = dailyWeatherCodes.map(code => weathercodes[code] || 'Desconocido');

    // Crear el contenido del mensaje del usuario
    const userMessage = `Hazme un resumen del tiempo ahora en ${locationOrPostalCode} y cuál es la previsión y posibilidad de lluvia para los próximos días, sabiendo que el día es ${weatherCode}, la temperatura es de ${temperature}°C y la velocidad del viento es ${windspeed}km/h. Para los próximos días, y por ese orden, estas son las temperaturas esperadas ${maxTemperatures.join(',')}°C, estas las mínimas ${minTemperatures.join(',')}°C, estas las previsiones ${rainProbabilities.join('% de lluvia')} y estas las previsiones del día ${dailyWeatherCodesMapped.join(',')} con un TAMAÑO MAXIMO de respuesta de 330 caracteres y SIN DAR CIFRAS.`;

    const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: "Eres un presentador meteorológico cercano y simpático. La longitud máxima de la respuesta es de 330 caracteres, y evita nombrar el postal_code." },
            { role: 'user', content: userMessage }
        ]
    };

    try {
        /*
        //llamada simulada a la API de openAI para desarrollo y evitar el gasto en lalmadas reales 
        const response = {
            data: {
                choices: [
                    {
                        message: {
                            content: "¡Saludos, Palencia! Ahora mismo hay unas condiciones climáticas variadas, con una temperatura fresca de 2°C y un ligero viento de 2.6km/h. Para los próximos días, tendremos un clima bastante estable, con temperaturas que oscilan entre los valores bajos y medios. En cuanto a la posibilidad de lluvia, hay algunas probabilidades de precipitaciones, aunque en general se esperan días mayormente secos. ¡Manténganse abrigados y tengan un gran día!"
                        }
                    }
                ]
            }
        };*/

        // Se realiza la solicitud a la API de OpenAI
        const response = await axios.post(openAIUrl, payload, { headers });
        // Se agregan registros para depurar la respuesta
        //console.log('Respuesta de la API de OpenAI:', response);
        /*console.log(response.status); // Muestra el código de estado HTTP de la respuesta
        console.log(response.headers); // Muestra los encabezados de la respuesta
        console.log(response.data); // Muestra el contenido de la respuesta como texto*/

        // Se verifica si la respuesta incluye el campo 'choices'
        if (response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content;
        } else {
            // Si no, devuelve un mensaje de error
            console.error("Error: La respuesta de la API no incluye el campo 'choices'.");
            return 'Error: La respuesta de la API no incluye el campo "choices".';
        }
    } catch (error) {
        console.error(`Error al realizar la solicitud a la API de OpenAI: ${error.message}`);
        return `Error al realizar la solicitud a la API de OpenAI: ${error.message}`;
    }
}


// Ejemplo de uso
async function infoWeather(inputValue) {
    const locationOrPostalCode = inputValue; // Reemplaza con tu ubicación o código postal
    try {
        let geocodeResult;

        if (isPostalCode(locationOrPostalCode)) {
            geocodeResult = await geocodePostalCode(locationOrPostalCode);
        } else if (isLocation(locationOrPostalCode)) {
            geocodeResult = await geocodeLocation(locationOrPostalCode);
        } else {
            throw new Error("Entrada no válida: debe ser un código postal o una ubicación");
        }

        const { latitude, longitude, timezone } = geocodeResult;
        const weatherData = await getWeather(latitude, longitude, timezone);
        //console.log("weatherData", weatherData);
        //const OpenAIResponse = await queryOpenAI(locationOrPostalCode, weatherData);
        //OpenAIResponse = "¡Hola Boiro! Ahora mismo tenemos cielos despejados y una temperatura de 13.8°C, con vientos de 10.4km/h. Para los próximos días, tendremos temperaturas entre 12.1 y 14.0°C, con mínimas que oscilarán entre 7.8 y -2.9°C. La posibilidad de lluvia es baja, solo un 2% para mañana. Pero atención, hoy tendremos llovizna moderada y niebla, así que toma tus precauciones. ¡Mantén esos paraguas a mano!"
        //const OpenAIResponse = " ¡Hola Barcelona! Aquí tu presentador meteorológico amigable. Hoy, el clima se encuentra en una temperatura agradable de 12.4°C, con una brisa suave de 6.1km/h. En los próximos días, puedes esperar temperaturas variadas. Las mínimas serán frescas, y las máximas serán suaves. No se espera lluvia en ningún día. ¡Así que prepárate para disfrutar del tiempo sin preocuparte por la lluvia! Desafortunadamente, no tengo información sobre el clima para el día no disponible. ¡Mantente positivo, Barcelona!";
        //console.log("RespuestaOpenAI:", OpenAIResponse);
        return { weatherData };
    } catch (error) {
        throw new Error(`Error al obtener datos: ${error.message}`);
    }
}

// Ejecutar la función principal
//main();

// Ejecutar la función específica solo si el módulo se ejecuta directamente
/*if (require.main === module) {
    const { variablesEntorno } = require('./src/components/Datos');
    variablesEntorno();
}*/

//module.exports = { getTimezone, main, variablesEntorno };
export { infoWeather, infoOpenAI };
# WeatherAI - Aplicación del Tiempo con IA y Geocodificación 🌦️🤖📍

Aplicación web desarrollada con React y Chakra UI que proporciona el pronóstico del tiempo actual y futuro. Utiliza **Nominatim (OpenStreetMap)** para obtener coordenadas a partir de localidades o códigos postales (España), **ipgeolocation.io** para la zona horaria, **OpenMeteo** para los datos meteorológicos, y **OpenAI** para generar un resumen amigable en lenguaje natural.


![Captura_pantalla](https://github.com/Juan-Fuente-T/WeatherAI_API_Javascript/assets/127140423/decd9416-c863-43d6-ac89-3f7461d2301e)

## Descripción

Esta aplicación integra múltiples APIs para ofrecer una experiencia meteorológica completa. Permite buscar por localidad o código postal, obteniendo datos precisos ajustados a la zona horaria local gracias a la geocodificación y consulta de timezone. Además de los datos técnicos, utiliza la IA de OpenAI para una interpretación más conversacional del pronóstico. La arquitectura es **Frontend-Only**.

## Características Principales ✨

* Consulta del tiempo actual y previsión detallada.
* Búsqueda flexible por **nombre de localidad (global) o código postal (España)** con geocodificación automática (Nominatim).
* Información ajustada a la **zona horaria local** obtenida vía API (ipgeolocation.io).
* **Resumen del tiempo generado por IA (OpenAI)** para una interpretación más natural.
* Interfaz de usuario moderna y fácil de usar (React + Chakra UI).
* Arquitectura **Frontend-Only**.

## Tecnologías Utilizadas 🛠️

* **Frontend:** React (v18.2.0), JavaScript, Chakra UI (v2.8.1), HTML, CSS
* **APIs Externas:**
    * OpenMeteo (Datos meteorológicos)
    * OpenAI (Generación de texto/resumen)
    * **Nominatim (OpenStreetMap)** (Geocodificación)
    * **ipgeolocation.io API** (Zona Horaria)
* **Herramientas:** Git, GitHub, npm/yarn

## Demo en Vivo 🔗
[[Enlace a la Demo Desplegada](https://juanfuente.ovh/weatherapi/)]

## Cómo Empezar (Desarrollo Local) 🚀

Para ejecutar este proyecto localmente, sigue estos pasos:

1.  **Prerrequisitos:**
    * Node.js (v16+ recomendado)
    * npm o yarn
    * Git
    * **Clave API de OpenAI:** Desde [OpenAI Platform](https://platform.openai.com/).
    * **Clave API de ipgeolocation.io:** Desde [ipgeolocation.io](https://ipgeolocation.io/).

2.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/Juan-Fuente-T/WeatherAI_API_Javascript.git
    cd WeatherAI_API_Javascript
    
    ```

3.  **Configurar Variables de Entorno:**
    * Crea un archivo `.env` en la raíz del proyecto.
    * Añade tus claves API:
        ```env
        REACT_APP_OPENAI_API_KEY=TU_CLAVE_API_DE_OPENAI
        REACT_APP_API_KEY=TU_CLAVE_API_DE_IPGEOLOCATION
        # Nota: Nominatim no suele requerir clave para uso moderado.
        ```
    * **IMPORTANTE:** Añade `.env` a tu `.gitignore`.

4.  **Instalar Dependencias:**
    ```bash
    npm install
    # o: yarn install
    ```

5.  **Iniciar la Aplicación:**
    ```bash
    npm start
    # o: yarn start
    ```

6.  Abrir `http://localhost:3000` (o el puerto indicado) en tu navegador.

## Cómo Funciona ⚙️

1.  El usuario introduce una localidad o código postal.
2.  La aplicación llama a la **API Nominatim (OSM)** para obtener las coordenadas geográficas (lat, lon).
3.  Con las coordenadas, llama a la **API ipgeolocation.io** para determinar la zona horaria local.
4.  Usando coordenadas y zona horaria, llama a la **API OpenMeteo** para los datos meteorológicos detallados.
5.  Los datos de OpenMeteo se envían a la **API de OpenAI** para generar un resumen conversacional.
6.  La interfaz (React + Chakra UI) muestra la información completa.

## Licencia 📄

Distribuido bajo la Licencia MIT.

## Contacto 📬

Juan Fuente - [Enlace a tu LinkedIn] - [https://juanfuente.ovh] - jfuentet@gmail.com

import React from 'react';
import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import '../stylesheets/keyframes.css'

//se define el elemento con las props(propiedades) que va a utilizar
function InfoExtraWindow({ label, value, onChange, customClassName }) {
  //console.log(value);
  // Se intenta renderizar el componente InfoWindow
  try {
    const formattedValue = typeof value === 'object' ? (Object.keys(value).length === 0 ? 'Información detallada del tiempo en tu localidad o codigo postal' : value.datosOpenAI) : value;

    // Se devuelve un componente de caja que contiene una etiqueta y un cuadro de entrada
    return (
      <Flex textColor="darkAlfa.900" fontSize="1.9xl" fontWeight="bold" flexDirection={'column'} justifyContent={'center'} pr={'2%'}>
        <Box pb="5%">
          {/* Etiqueta que muestra el nombre del campo */}
          <label>{label}:</label>
        </Box>
        {/* Contenedor que establece el estilo de borde, margen y desplazamiento horizontal */}
        <Box borderWidth="6px" borderRadius="10px" p="2" mb="4" mx="1%" overflowX="auto" width="100%" style={{ whiteSpace: 'nowrap' }} justifyContent={'center'}>
          {/* Cuadro de entrada de texto */}
          <Text
            width="100%"
            textColor="darkAlfa.900"
            fontSize={["sm", "md", "lg", "xl", "2xl"]}
            fontWeight="bold"
            className={customClassName}
          >
            {formattedValue}
          </Text>
        </Box>
      </Flex>
    );
  } catch (error) {
    // Capturamos y manejamos errores si ocurren al renderizar el componente
    console.error("Error en Infowindow: ", error);
    // Devolvemos null y un mensaje de error si se produce una excepción
    return null;
  }
}

// Exportamos el componente InfoWindow con la capacidad de usar características de Chakra UI
export default chakra(InfoExtraWindow);
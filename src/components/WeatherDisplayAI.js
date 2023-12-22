import React, { useEffect, useRef, useState } from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import InfoExtraWindow from './InfoExtraWindow';

function WeatherDisplayAI({ datosOpenAI }) {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const [respuestaOpenAI, setRespuestaOpenAI] = useState(datosOpenAI || 'Esperando solicitud');

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;

        if (container && content) {
            const scrollSpeed = 30;
            const contentWidth = content.clientWidth;
            const containerWidth = container.clientWidth;

            function scrollText() {
                if (contentWidth > containerWidth) {
                    content.style.transform = `translateX(${containerWidth}px)`;
                    const animationDuration = (contentWidth / scrollSpeed) * 1000;

                    content.style.transition = `transform ${animationDuration}ms linear`;
                    content.style.transform = `translateX(-${contentWidth}px)`;
                }
            }

            scrollText();

            content.addEventListener('transitionend', () => {
                content.style.transition = 'none';
                content.style.transform = `translateX(${containerWidth}px)`;
                setTimeout(scrollText, 500);
            });
        }

        setRespuestaOpenAI(datosOpenAI || 'Esperando solicitud');
    }, [datosOpenAI]);

    return (
        <ChakraProvider>
            <Box p={4}>
                <Box
                    margin={'0 auto'}
                    size={'sm'}
                    textColor={'darkAlfa.900'}
                    fontSize="1.9xl"
                    fontWeight="bold"
                    backgroundColor={'teal.800'}
                    borderRadius={'10px'}
                    p={'2%'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <Box
                        mt={4}
                        maxW={'100%'}
                        padding={'2%'}
                        backgroundColor={'teal.500'}
                        borderRadius={'10px'}
                        size={'sm'}
                        overflowX="auto"
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <InfoExtraWindow
                            label="Información Meteorológica"
                            value={datosOpenAI || 'Esperando solicitud'}
                            customClassName='scroll-slow'
                        />
                    </Box>
                </Box>
            </Box>
        </ChakraProvider>
    );
}

export default WeatherDisplayAI;
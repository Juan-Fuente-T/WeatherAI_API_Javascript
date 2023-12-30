import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const LongTextScroll = ({ text }) => {
    return (
        <Box
            alignContent={'center'}
            overflowX="hidden"
            whiteSpace="nowrap"
            width="100%"
            borderRadius="10px"
            p="2"
            mb="4"
            mx="1%"

            borderWidth="6px"
            borderColor="gray.200"
            animation="scroll 10s linear infinite"
        >
            <Text
                fontSize="1.9xl"
                fontWeight="bold"
                color="darkAlfa.900"
            >
                {text}
            </Text>
        </Box>
    );
};

export default LongTextScroll;

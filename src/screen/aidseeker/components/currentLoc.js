import React, { useEffect, useState, useMemo } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import {
    Box, Text, Heading, HStack, Container
} from "native-base"

import { Location } from "../../../components/location";
import ConverterAddress from "../../../components/converToAddress";

const Currentlocation = () => {
    // STATE : START ==== //
    const [Region, RegionSet] = useState('');
    // STATE : END ==== //

    useEffect(() => {
        const fetchLocation = async () => {
            // fetch the location
            const lolatlocation = await Location();
            // check if the gelocation response - boolean
            if (lolatlocation.status) {
                const fetchAddress = await ConverterAddress(lolatlocation.Position.coords.latitude, lolatlocation.Position.coords.longitude);
                RegionSet(fetchAddress.address);
            } 
        }
        fetchLocation();
    }, []);

    const memoizedCurrentLoc = useMemo(() => {
        return (
            <Box bg="warmGray.50" rounded="xl" p="2" shadow={2}>
                <HStack space={5} h="90" alignItems="center">
                    <Box justifyContent="center" ml="2">
                        <FontAwesome name="map-marker-alt" size={30} color="#000000" />
                    </Box>
                    <Container>
                        <Heading
                            fontWeight="900"
                            fontSize={18}
                            color="#f63b3b"
                        >
                            CURRENT LOCATION
                        </Heading>
                        <Text style={{ fontSize: 21 }} mt="2" numberOfLines={2}>
                            {Region}
                        </Text>
                    </Container>
                </HStack>
            </Box>
        );
    }, [Region]);

    return memoizedCurrentLoc
}

export default Currentlocation
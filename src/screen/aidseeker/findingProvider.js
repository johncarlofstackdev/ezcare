import * as React from "react";

import { View, Image } from "react-native";
import {Box, Text, Heading, HStack, Center, NativeBaseProvider } from "native-base"

import Loader from "react-native-spinkit";

import EZCARELOGO from "../../assets/img/EZCARE-LOGO.png";

import Dimension from "../../components/Dimension";

const Finding = ({ navigation, route }) => {
    const eventId = Object.keys(route.params)[0];
    const [eventData, eventNewDataSet] = React.useState(route.params[eventId]);
    const Title = eventData.serviceType === 1 ? "Aid Provider" : eventData.serviceType === 2 ? "Police" : "Bureau of fire protection";
    return (
        <NativeBaseProvider>
            <View style={{ backgroundColor: '#f63b3b', height: Dimension.Height, padding: 30 }}>
                <Center flex={1} px="5" bg="#f63b3b">
                    <HStack w="100%" p="2" pt="0" direction="column" space={4}>
                        <Heading style={{ fontSize: 30, color: "white", marginBottom: -10 }} textAlign="left" fontWeight="900">Emergency Request Sent!</Heading>
                        <Text style={{ fontSize: 19, color: "white" }} textAlign="left" fontWeight="600">Searching for an {Title}.</Text>
                    </HStack>
                    <Box style={{ height: Dimension.Height - 450, justifyContent: "center" }} alignItems="center">
                        <Loader isVisible={true} size={Dimension.Width - 100} type="Pulse" color="white" />
                        <View style={{
                            width: Dimension.Width - 250,
                            height: Dimension.Width - 250,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#fffffff2",
                            borderRadius: Dimension.Width - 250,
                            marginTop: - Dimension.Width + 180
                        }}>
                            <Image
                                source={EZCARELOGO}
                                style={{ width: Dimension.Width - 300, height: Dimension.Width - 300 }}
                            />
                        </View>
                    </Box>
                    <Text style={{ fontSize: 19, color: "white", marginTop: 50 }}>Note: Please stay where you are and keep calm until the {Title} arrives. Help will reach you soon.</Text>
                </Center>
            </View>
        </NativeBaseProvider >
    );
};

export default Finding
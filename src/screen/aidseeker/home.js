import React, { useCallback } from "react";
import { View, StyleSheet } from 'react-native';

import { Box, Text, Heading, NativeBaseProvider } from "native-base"

import { ref, set } from "firebase/database";
import { db, auth } from "../../../config";

import UserInfo from "./components/UserInformation";
import RequestButton from "./components/requestButton";
import Currentlocation from "./components/currentLoc";
import { Time } from "./components/functions";

import Dimension from "../../components/Dimension";
import { Location } from "../../components/location";
import Trackingcode from "../../components/codeGenerator";
import Swiper from 'react-native-swiper'

const Home = ({ navigation }) => {

    const _REQUEST = useCallback((requestType) => {


        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const currentDate = month + "/" + day + "/" + year;

        const currentTime = Time();
        const code = Trackingcode(6)
        const reference = Trackingcode(15)

        const fetchLocation = async () => {
            try {
                const userID = auth.currentUser.uid;
                const response = await Location()
                const data = {
                    incedent_code: code,
                    aid_seeker_id: userID,
                    date_requested: currentDate,
                    time: currentTime,
                    date_close: false,
                    time_close: false,
                    aid_provider_id: false,
                    aid_provider_location: false,
                    location: {
                        longitude: response.Position.coords.longitude,
                        latitude: response.Position.coords.latitude,
                    },
                    ambulance_Request: false,
                    status: 1,
                    readStatus: false,
                    event_type: false,
                    event_details: false,
                    checkViewed: false,
                    serviceType: requestType
                }

                set(ref(db, `incedent/${reference}/`), data)

            } catch (error) {
                console.error(error);
            }
        }
        fetchLocation();
    }, []);

    return (
        <NativeBaseProvider>
            <View style={styles.ViewStyle}>
                <UserInfo nav={navigation} />
                <Box mt="4" pt="2">
                    <Heading
                        fontWeight="900"
                        fontSize={40}
                    >
                        Need immediate help?
                    </Heading>
                    <Text
                        style={{ fontSize: 23, lineHeight: 30 }}
                        color="coolGray.600"
                        _dark={{
                            color: "warmGray.200"
                        }}
                        mt="2"
                    >
                        Press and hold the button to release distress signal.
                    </Text>
                </Box>
                <View style={styles.wrapper}>
                    <Swiper showsButtons={false} showsPagination={false} loop={true}>
                        <View>
                            <Box alignItems="center" mt="4">
                                <Text fontWeight="900" fontSize={14} style={{color: "#db8f8f"}}>FIRST AID SERVICE</Text>
                            </Box>
                            <RequestButton requestType={1} onClick={_REQUEST} navigate={navigation} />
                        </View>
                        <View>
                            <Box alignItems="center" mt="4">
                                <Text fontWeight="900" fontSize={14} style={{color: "#9D9CE8"}}>POLICE SERVICE</Text>
                            </Box>
                            <RequestButton requestType={2} onClick={_REQUEST} navigate={navigation} />
                        </View>
                        <View>
                            <Box alignItems="center" mt="4">
                                <Text fontWeight="900" fontSize={14} style={{color: "#f78320"}}>BFP SERVICE</Text>
                            </Box>
                            <RequestButton requestType={3} onClick={_REQUEST} navigate={navigation} />
                        </View>
                    </Swiper>
                </View>
                <Box alignItems="center" mb="3">
                    <Text fontSize={17} color="coolGray.600">
                        Swipe to change service
                    </Text>
                </Box>
                <Currentlocation />
            </View>
        </NativeBaseProvider >
    );
}

const styles = StyleSheet.create({
    ViewStyle: {
        backgroundColor: '#fefefe',
        padding: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 40,
        height: Dimension.Height - 10
    },
    wrapper: {
        height: Dimension.Height - 470
    }
});

export default Home;

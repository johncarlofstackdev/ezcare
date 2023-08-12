// == React | React Native == //
import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, StyleSheet } from "react-native";
import Dimension from "../../components/Dimension";

// == Template == //
import { Box, Text, Heading, HStack, Center, NativeBaseProvider, Avatar, Spinner, Actionsheet, Button } from "native-base";

// == Map == //
import MapView, { PROVIDER_GOOGLE, enableLatestRenderer, Marker } from "react-native-maps";
import { Location } from "../../components/location";
import { CustomMapIcons } from "../../components/mapusersicons";

// == Template Loader == //
import Loader from "react-native-spinkit";

// == Own Components == //
import ListHelp from "./components/AskingHelp";
import ActionSheet from "./components/ActionSheet";
import HomeUI from "./components/homeUI";
import NotiAlert from "./components/notificationAlert";

import MapIcon from "../../components/mapIcons";

import { db, auth } from "../../../config";

const Home = ({ navigation }) => {
    // STATE : START ==== //
    const [Region, RegionSet] = useState({});

    // 1 - initial | 2 - To aid seeker map | 3 - no session
    const [checkHelp, checkHelpSet] = useState(1);

    const actionSheetRef = useRef();
    const eventCode = useRef(true);
    // STATE : END ==== //

    const [icon, iconSet] = useState(null); 

    useEffect(() => {
        const fetchLocation = async () => {

            const rootRefSeeker = db.ref(`aid_provider/${auth.currentUser.uid}/`)
            rootRefSeeker.on("value", async snap => {
                if(snap.exists()){
                    iconSet(snap.val());
                }
            });

            // fetch the location
            const lolatlocation = await Location();
            // check if the gelocation response - boolean
            if (lolatlocation.status) {
                // caculate the ASPECT_RATIO
                const ASPECT_RATIO = Dimension.Width / Dimension.Height;
                const LATITUDE_DELTA = 0.02;
                const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
                const INITIAL_POSITION = {
                    latitude: lolatlocation.Position.coords.latitude,
                    longitude: lolatlocation.Position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }
                RegionSet(INITIAL_POSITION);
            }
        };

        fetchLocation();
    }, []);

    // Functions Area : START
    const viewHEP_ = useCallback((event) => {
        actionSheetRef.current.open();
        eventCode.current = event.nativeEvent.id
    }, []);
    // Functions Area : END

    // Check the Data if not empty : START
    if (Object.keys(Region).length === 0 || icon === null) {
        return (
            <NativeBaseProvider>
                <Center flex={1} px="3" bg="muted.50">
                    <Center w="100%">
                        <HStack space={2} justifyContent="center">
                            <Loader isVisible={true} size={Dimension.Width - 360} type='ThreeBounce' color='#f63b3b' />
                        </HStack>
                    </Center>
                </Center>
            </NativeBaseProvider >
        );
    }

    // Final Return : START
    return (
        <NativeBaseProvider>
            <MapView style={styles.map} provider={PROVIDER_GOOGLE} region={Region}>
                <ListHelp IconHelp={CustomMapIcons.help} Press={viewHEP_} serviceType={icon.serviceType} />
                <Marker
                    coordinate={{ latitude: Region.latitude, longitude: Region.longitude }}
                    image={MapIcon(icon.serviceType).me}
                />
            </MapView>
            <HomeUI Design={styles} nav={navigation} />
            <ActionSheet ref={[actionSheetRef, eventCode]}  />
            <NotiAlert userType={icon.serviceType} />
        </NativeBaseProvider >
    );
}

// == Custom StylSheet == //
const styles = StyleSheet.create({
    map: {
        width: Dimension.Width,
        height: Dimension.Height,
    }, container: {
        position: 'absolute',
        top: 30,
        left: 30,
        right: 30,
        padding: 20,
        borderRadius: 10
    },
    containerBottom: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30
    },
    containerLeftBottom: {
        padding: 20,
        borderRadius: 10
    },
    containerRightBottom: {
        padding: 20,
        borderRadius: 10,
        width: Dimension.Width - 139
    }
});

export default Home;

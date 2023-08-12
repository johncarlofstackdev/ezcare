import React, { useEffect, useState, useCallback, useRef, useMemo, memo } from "react";

import { View, StyleSheet, Dimensions, Image } from 'react-native';

import {
    Box, Text, Heading, HStack, Center, NativeBaseProvider, Avatar, Spinner, Actionsheet, Button, Spacer, Modal, FormControl,
    Input, Divider
} from "native-base";

import { ref, set, update, onValue, remove } from "firebase/database"

import Loader from 'react-native-spinkit'

// import Geolocation from '@react-native-community/geolocation'
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, enableLatestRenderer, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { getDistance } from "geolib"
import haversine from 'haversine';
import moment from 'moment';

import { Icons } from "../../components/mapusersicons";

import { auth, db, storage } from "../../../config";

import Dimension from "../../../components/Dimension";
import { CustomMapIcons } from "../../../components/mapusersicons";
import Google_API from "../../../components/api";
import MapIcon from "../../../components/mapIcons";

const Map = ({ eventInformation }) => {
    const [region, setRegion] = useState({});
    const { location, serviceType } = eventInformation;
    const aidPSeekerLoc = {
        latitude: location.latitude,
        longitude: location.longitude,
    };

    useEffect(() => {
        const watchId = Geolocation.watchPosition(
            (position) => {
                const LATITUDE_DELTA = 0.02;
                const ASPECT_RATIO = Dimension.Width / Dimension.Height;
                const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
                const initialPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                };
                setRegion(initialPosition);
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, [eventInformation]);

    if (!region.latitude || !region.longitude) {
        return null;
    }

    return (
        <MapView style={styles.map} provider={PROVIDER_GOOGLE} region={region}>
            <Marker coordinate={region} image={MapIcon(serviceType).me} />

            <Marker coordinate={aidPSeekerLoc} image={MapIcon(serviceType).services} />

            <MapViewDirections
                origin={region}
                destination={aidPSeekerLoc}
                apikey={Google_API()}
                strokeWidth={5}
                strokeColor={serviceType == 1 ? "#f63b3b" : serviceType == 2 ? "#4035C2" : "#ff7500" }
            />
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
});

export default memo(Map);
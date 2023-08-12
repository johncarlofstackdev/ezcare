import React, { useEffect, useState, useCallback, useRef } from "react"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import { useRoute } from '@react-navigation/native';

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

import AcceptNotificaton from "./components/event_modal";
import SuccessModal from "./components/successModal";
import Map from "./components/map";

import Dimension from "../../components/Dimension";
import { CustomMapIcons } from "../../components/mapusersicons";

import Google_API from "../../components/api";
import EventInformation from "./components/eventInformation";

const Event = ({ navigation, route }) => {
    const eventId = Object.keys(route.params)[0];
    const [eventData, eventNewDataSet] = useState(route.params[eventId]);

    const onCloseModal = useCallback(() => {
        const updateStatsView = async () => {
            try {
                const dataInfo = { readStatus: true };
                await db.ref(`incedent/${eventId}`).update(dataInfo);
            } catch (error) {
                console.log("Error updating status:", error);
            }
        };
        updateStatsView();
    }, [eventId]);

    useEffect(() => {
        const ref = "incedent/" + eventId + "/";
        const rootRef = db.ref(ref);
        rootRef.on('value', snap => {
            if (snap.exists()) {
                const userData = snap.val();
                eventNewDataSet(userData);
            }
        });
    }, []);

    return (
        <NativeBaseProvider>
            <Map eventInformation={eventData} />
            <EventInformation design={styles} eventInformation={eventData} />
            <AcceptNotificaton design={styles} onCloseFunct={onCloseModal} eventCode={eventId} />
            <SuccessModal design={styles} eventCode={eventId} />
        </NativeBaseProvider >
    );
};

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
        right: 30,
        borderRadius: 30
    },
    containerLeftBottom: {
        padding: 20,
        borderRadius: 10
    },
    containerRightBottom: {
        padding: 20,
        borderRadius: 10
    },
    LineDivder: {
        marginTop: 100
    },
    profilepopup: {
        width: 100,
        height: 100,
        marginTop: 20,
        resizeMode: "cover",
        borderRadius: 250,
        borderColor: "red",
        borderWidth: 7
    },
    RatingSt: {
        marginTop: 10
    },
    btnCompleted: {
        borderRadius: 50
    }
});

export default Event;

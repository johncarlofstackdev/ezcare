

import React, { useEffect, useState, useCallback, useRef, useMemo, memo } from "react";
import { TabRouter, useRoute } from '@react-navigation/native';


import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import haversine from 'haversine';
import moment from 'moment';

import { View, designheet, Dimensions, Linking } from 'react-native';

import {
    Box, Text, Heading, HStack, Center, NativeBaseProvider, Avatar, Spinner, Actionsheet, Button, Spacer, Modal, FormControl,
    Input, Divider
} from "native-base";

import { Rating, AirbnbRating } from 'react-native-ratings';

import IndexImage from "../../../assets/img/index.jpg";
import getFileUrl from "../../../components/fileFetch";
import fetchDistanceDuration from "../../../components/fetchMinsDistance";

import { Time } from "./functions";

import { db } from "../../../../config";


const Event_Information = ({ design, eventInformation }) => {
    const [eventInfo, eventInfoSet] = useState({});
    const { aid_provider_id, time, aid_provider_location, location } = eventInformation;

    useEffect(() => {
        const ref = "aid_provider/" + aid_provider_id + "/";
        const rootRef = db.ref(ref);
        rootRef.on('value', async snap => {
            if (snap.exists()) {
                const userData = snap.val();
                const fetchProfileURL = await getFileUrl(!userData.profile ? 'profile/index.jpg' : 'profile/' + userData.profile);
                userData["profile"] = fetchProfileURL;
                // const aidSeeker = {longitude: -122.077901, latitude: 37.41195};
                // const distance = haversine(aid_provider_location, location, { unit: 'meter' });
                // const second = distance.toFixed(2) / 10; // 10 meters per seconds
                // const caculatemins = second.toFixed(2) / 60;

                const reponseData = await fetchDistanceDuration(aid_provider_location, location);
                userData["estimateTimeDistance"] = reponseData.distance + " / " + reponseData.duration;
                // userData["estimateTimeDistance"] = caculatemins.toFixed(0) + " mins / " + distance.toFixed(2) + " m";

                userData["timeAskHelp"] = moment(time, 'HH:mm').format('h:mm A')
                eventInfoSet(userData);
            } else {
                eventInfoSet({});
            }
        })
    }, [eventInformation]);

    const makeCall = useCallback(() => {
        let url = "tel:" + eventInfo.phone;
        Linking.openURL(url);
    }, [eventInfo]);

    return (
        <>
            <Box style={design.containerBottom} bg="white" p="5" shadow={2}>
                <HStack space={1} alignItems="center">
                    <Avatar
                        bg="white"
                        size="lg"
                        source={{
                            uri: eventInfo.profile
                        }}
                        style={{ borderWidth: 4, borderColor: '#be185d', padding: 3 }}
                    >
                        {eventInfo.fullname}
                    </Avatar>
                    <Box>
                        <Heading
                            mt="1"
                            ml="3"
                            fontWeight="900"
                            fontSize={20}
                        >
                            {eventInfo.fullname}
                        </Heading>
                        <Heading
                            ml="3"
                            fontWeight="medium"
                            size="sm"
                            color="coolGray.600"
                        >
                            ID: {eventInfo.code}
                        </Heading>
                    </Box>
                    <HStack space={3} alignItems="center" ml="auto">
                        <Box>
                            <Text
                                fontWeight="medium"
                                style={{ fontSize: 15 }}
                                color="coolGray.600"
                                textAlign="right"
                            >
                                Today
                            </Text>
                            <Text
                                fontWeight="medium"
                                style={{ fontSize: 16 }}
                            >
                                {eventInfo.timeAskHelp}
                            </Text>
                        </Box>
                    </HStack>
                </HStack>
                <Box>
                    <Text
                        fontWeight="medium"
                        style={{ fontSize: 15 }}
                        color="coolGray.600"
                        mt="3"
                    >
                        Estimate Time of Arrival
                    </Text>
                    <Text
                        fontWeight="medium"
                        style={{ fontSize: 19 }}
                        mt="1"
                    >
                        {eventInfo.estimateTimeDistance}
                    </Text>
                </Box>
                <Box textAlign="right" mt="5">
                    <HStack space={2} height="10">
                        <Spacer />
                        <Button size="md" bg="info.600" onPress={makeCall}>
                            <FontAwesome5 name="phone" size={20} color="#fefefe" />
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </>
    );
}

export default memo(Event_Information);

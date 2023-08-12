// == React | React Native == //
import React, { useState, useMemo, useEffect, useCallback, memo } from 'react';

// == Template == //
import { Box, Button, Text, Heading, HStack, Spinner } from "native-base";

// == Firebase == //
import { auth, db } from "../../../../config";

import Dimension from "../../../components/Dimension"

// == Address Converter == //
import ConverterAddress from "../../../components/converToAddress"

// == Icons == //
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Location } from '../../../components/location';

// import moment from "moment";
import RealTimeAgo from '../../../components/agoRealTime';

const fetchRequestInfo = ({ eventCode }) => {
    const [data, setData] = useState({});
    const [respondStat, respondStatSet] = useState(false);

    const RespondTo = useCallback(() => {
        const respondMethod = async () => {
            respondStatSet(true);
            try {
                const userId = auth.currentUser.uid;
                const currentLocation = await Location();
                const dataInfo = {
                    aid_provider_id: userId,
                    aid_provider_location: {
                        latitude: currentLocation.Position.coords.latitude,
                        longitude: currentLocation.Position.coords.longitude,
                    },
                    status: 2
                };
                await db.ref(`incedent/${eventCode}`).update(dataInfo);
            } catch (error) {
                console.log("Error updating information:", error);
            }
        };
        respondMethod();
    }, [eventCode]);

    useEffect(() => {
        const loadRequestInformation = async () => {
            try {
                const snapshotIncedent = await db.ref(`incedent/${eventCode}/`).once('value');
                if (snapshotIncedent.exists()) {
                    const infoIncedent = snapshotIncedent.val();
                    const snapshotUserInfo = await db.ref(`aid_seeker/${infoIncedent.aid_seeker_id}/`).once('value');
                    if (snapshotUserInfo.exists()) {
                        const infoUser = snapshotUserInfo.val();
                        const fetchAddress = await ConverterAddress(infoIncedent.location.latitude, infoIncedent.location.longitude);
                        infoIncedent['address'] = fetchAddress.address;
                        infoIncedent['fullname'] = infoUser.fullname;

                        // const dateRequested = infoIncedent.date_requested;
                        // const timeRequest = infoIncedent.time;
                        // const [month, day, year] = dateRequested.split('/');
                        // const [hours, minutes] = timeRequest.split(':');
                        // const newDate = new Date(year, month - 1, day, hours, minutes);
                        // const timeAgo = moment(newDate).fromNow();
                        // infoIncedent['ago'] = timeAgo;

                        setData(infoIncedent);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadRequestInformation();
    }, [eventCode, respondStat]);

    return (
        Object.keys(data).length !== 0 ? (
            <>
                <HStack w="100%" p="2" pt="0" direction="column" space={4}>
                    <HStack alignItems="center" space={3}>
                        <Box w="9" alignItems="center">
                            <MaterialIcons name="info" size={28} color="#f63b3b" />
                        </Box>
                        <Box>
                            <Text color="coolGray.600" style={{ fontSize: 13 }}>
                                DISTRESS INFORMATION
                            </Text>
                            <Heading
                                fontWeight="900"
                                fontSize={17}
                            >
                                {data.fullname} - Distress #{data.incedent_code}
                            </Heading>
                        </Box>
                    </HStack>
                    <HStack alignItems="center" space={3}>
                        <Box w="9" alignItems="center">
                            <FontAwesome5 name="map-marker-alt" size={27} color="#f63b3b" />
                        </Box>
                        <Box>
                            <Text color="coolGray.600" style={{ fontSize: 13 }}>
                                LOCATION
                            </Text>
                            <Heading
                                fontWeight="900"
                                fontSize={17}
                                width={Dimension.Width - 80}
                            >
                                {data.address}
                            </Heading>
                        </Box>
                    </HStack>
                    <HStack alignItems="center" space={3}>
                        <Box w="9" alignItems="center">
                            <FontAwesome5 name="clock" size={27} color="#f63b3b" />
                        </Box>
                        <Box>
                            <Text color="coolGray.600" style={{ fontSize: 13 }}>
                                TIME
                            </Text>
                            <Heading
                                fontWeight="900"
                                fontSize={17}
                            >
                                <RealTimeAgo  dateRequested={data.date_requested} timeRequested={data.time} />
                            </Heading>
                        </Box>
                    </HStack>
                </HStack>
                <Box p="3" pt="5" w="100%">
                    <Button h="50" colorScheme="red" size="sm" onPress={RespondTo}  isLoading={respondStat}>
                        RESPOND TO REQUEST
                    </Button>
                </Box>
            </>
        ) : (
            <Box py="10">
                <Spinner size="lg" color="#f63b3b" />
            </Box>
        )
    );
};

export default memo(fetchRequestInfo);
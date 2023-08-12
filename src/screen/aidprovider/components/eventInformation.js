

import React, { useEffect, useState, memo } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import moment from "moment";
import { Box, Text, Heading, HStack, Avatar, Button, Spacer } from "native-base";

import getFileUrl from "../../../components/fileFetch";
import fetchDistanceDuration from "../../../components/fetchMinsDistance";
import { db } from "../../../../config";


const Event_Information = (props) => {
    // props
    const { functions, styles, states } = props;

    // STATE
    const [eventInfo, eventInfoSet] = useState({});

    // Event Information
    const { aid_seeker_id, time, aid_provider_location, location } = states.eventInformation;

    // Event Information Effects
    useEffect(() => {
        const ref = "aid_seeker/" + aid_seeker_id + "/";
        const rootRef = db.ref(ref);
        const fetchAidProviderInfo = () => {
            rootRef.on('value', async snap => {
                if (snap.exists()) {
                    const userData = snap.val();
                    const fetchProfileURL = await getFileUrl(!userData.profile ? 'profile/index.jpg' : 'profile/' + userData.profile);
                    const reponseData = await fetchDistanceDuration(aid_provider_location, location);
                    userData["profile"] = fetchProfileURL;
                    userData["estimateTimeDistance"] = reponseData.distance + " / " + reponseData.duration;
                    userData["timeAskHelp"] = moment(time, "HH:mm").format("h:mm A");
                    eventInfoSet(userData);
                } else {
                    eventInfoSet({});
                }
            })
        }
        fetchAidProviderInfo();
    }, [states.eventInformation]);

    return (
        <>
            <Box style={styles.design.containerBottom} bg="white" p="5" shadow={2}>
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
                        Estimate Time
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
                        <Button size="md" bg="info.600" onPress={() => functions.makeACall(eventInfo.phone)}>
                            <FontAwesome5 name="phone" size={20} color="#fefefe" />
                        </Button>
                        <Button size="md" bg="secondary.700">
                            <FontAwesome5 name="ambulance" onPress={functions.requestAmulance} size={20} color="#fefefe" />
                        </Button>
                        <Button size="md" bg="tertiary.400" onPress={functions.report}>
                            COMPLETE
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </>
    )
}

export default memo(Event_Information);

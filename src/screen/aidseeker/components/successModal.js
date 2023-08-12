

import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Linking } from "react-native";

import { Box, Text, Heading, HStack, Avatar, Spinner, Actionsheet, Button, Modal, Divider } from "native-base";

import { Rating } from "react-native-ratings";

import FileFetch from "../../../components/fileFetch";
import { db } from "../../../../config";
import { ref, set } from "firebase/database";

const Rate_Provider = ({ design, eventCode }) => {

    const [providerData, providerDataSet] = useState({});
    const [statusCheck, statusCheckSet] = useState(false);
    const [rateModal, rateModalSet] = useState(false);
    const count = useRef(5);

    useEffect(() => {
        const ref = "incedent/" + eventCode + "/";
        const rootRef = db.ref(ref);
        const fetchRequest = async () => {
            rootRef.on('value', snap => {
                if (snap.exists()) {
                    const { status, aid_provider_id } = snap.val();
                    if (status === 3) {
                        aidProviderData(aid_provider_id);
                    } else {
                        statusCheckSet(false);
                    }
                } else {
                    statusCheckSet(false);
                }
            });
        }
        fetchRequest();
    }, [eventCode]);

    const aidProviderData = (aid_provider_id) => {
        const refProvider = "aid_provider/" + aid_provider_id + "/";
        const refRootProvider = db.ref(refProvider);
        refRootProvider.on('value', async snap => {
            const userInfo = snap.val();
            const fetchProfileURL = await FileFetch(!userInfo.profile ? "profile/index.jpg" : "profile/" + userInfo.profile);
            userInfo["profile"] = fetchProfileURL;
            userInfo["user_ref"] = aid_provider_id;
            providerDataSet(userInfo);
            statusCheckSet(true)
        });
    }

    const rateUsModal = () => {
        rateModalSet(true);
        statusCheckSet(false);
    };

    const onRateFunction = (rating) => {
        count.current = rating;
    };

    const submitRate = () => {
        const data = { aid_provider_id: providerData.user_ref, rated: count.current }
        set(ref(db, `rate/${eventCode}/`), data);
        const status = { status: 4 };
        db.ref(`incedent/${eventCode}`).update(status);
        rateModalSet(false);
        count.current = 5;
    };

    const makeCall = useCallback(() => {
        let url = "tel:" + providerData.phone;
        Linking.openURL(url);
    }, [providerData]);

    const memoMizedRate = useMemo(() => {
        return (
            <>
                <Modal isOpen={statusCheck}>
                    <Modal.Content maxWidth="400px">
                        <Modal.Body bg="white">
                            <Box alignItems="center">
                                <Heading fontSize="26" mt="5">SUCCESS!</Heading>
                            </Box>

                            <Box alignItems="center" mt="5">
                                <FontAwesome5 name="check-circle" size={100} color="#338f41" />
                            </Box>

                            <Box alignItems="center" mt="5" mb="3">
                                <Text fontSize="17">The patient is successfully secured</Text>
                            </Box>
                            <Box alignItems="center" mt="5">
                                <Button size="lg" bg="tertiary.400" width={150} style={design.btnCompleted} onPress={rateUsModal}>
                                    CONTINUE
                                </Button>
                            </Box>
                        </Modal.Body>
                    </Modal.Content >
                </Modal >
                <Actionsheet isOpen={rateModal}>
                    <Actionsheet.Content>
                        <Box w="100%" px={4} mb="4" justifyContent="center">
                            <Text fontSize="16" color="coolGray.600">
                                Rate Information
                            </Text>
                        </Box>
                        {
                            Object.keys(providerData).length === 0 ?
                                (
                                    <Box py="10">
                                        <Spinner size="lg" color="#f63b3b" />
                                    </Box>
                                ) : (
                                    <>
                                        <Box w="100%" p="5" pt="2">
                                            <HStack space={2} alignItems="center">
                                                <Avatar
                                                    bg="white"
                                                    size="lg"
                                                    source={{
                                                        uri: providerData.profile
                                                    }}
                                                    style={{ borderWidth: 4, borderColor: '#f63b3b', padding: 3 }}
                                                >
                                                    {providerData.fullname}
                                                </Avatar>
                                                <Box>
                                                    <Heading
                                                        mt="1"
                                                        ml="3"
                                                        fontWeight="900"
                                                        fontSize={20}
                                                    >
                                                        {providerData.fullname}
                                                    </Heading>
                                                    <Heading
                                                        ml="3"
                                                        fontWeight="medium"
                                                        size="sm"
                                                        color="coolGray.600"
                                                    >
                                                        ID: {providerData.code}
                                                    </Heading>
                                                </Box>
                                                <HStack space={3} alignItems="center" ml="auto">
                                                    <Box>
                                                        <Button size="md" colorScheme="red" w="50" h="50" style={{ borderRadius: 50 }} onPress={makeCall}>
                                                            <MaterialIcons name="phone" size={25} color="white" />
                                                        </Button>
                                                    </Box>
                                                </HStack>
                                            </HStack>
                                            <Divider mt="5" />
                                            <Box alignItems="center" mt="5">
                                                <Text fontSize="15" mt="2">RATE YOUR EXPERIENCE</Text>
                                            </Box>
                                            <Box mb="5">
                                                <Rating
                                                    style={design.RatingSt}
                                                    ratingCount={5}
                                                    startingValue={5}
                                                    showRating={false}
                                                    imageSize={40}
                                                    onFinishRating={onRateFunction}
                                                />
                                            </Box>
                                            <Button h="50" colorScheme="red" size="sm" mt="5" onPress={submitRate}>
                                                SUBMIT
                                            </Button>
                                        </Box>
                                    </>
                                )
                        }
                    </Actionsheet.Content >
                </Actionsheet >
            </>
        )
    }, [statusCheck, rateModal]);

    return memoMizedRate;
}

export default Rate_Provider;

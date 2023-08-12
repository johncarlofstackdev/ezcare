

import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Linking } from 'react-native';

import { Box, Text, Heading, Spinner, Button, Modal, Image } from "native-base";

import { Rating } from 'react-native-ratings';

import FileFetch from "../../../components/fileFetch";
import { db } from "../../../../config";


const Accept_Notificaton = ({ design, onCloseFunct, eventCode }) => {

    const [checkView, checkViewSet] = useState(true);
    const [providerData, providerDataSet] = useState({});

    useEffect(() => {
        const ref = "incedent/" + eventCode + "/";
        const rootRef = db.ref(ref);
        const fetchRequest = async () => {
            rootRef.on('value', snap => {
                if (snap.exists()) {
                    const { readStatus, aid_provider_id } = snap.val();
                    if (readStatus) {
                        checkViewSet(false)
                    } else {
                        aidProviderData(aid_provider_id);
                    }
                }
            })
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
            const refRate = "rate/";
            const rootRefRate = db.ref(refRate);
            rootRefRate.on('value', snap => {
                if (snap.exists()) {
                    const data = {};
                    let ratedUser = 0;
                    snap.forEach(childSnapshot => {
                        const childData = childSnapshot.val();
                        if (childData.aid_provider_id === aid_provider_id) {
                            data[childSnapshot.key] = childData;
                            ratedUser += childData.rated;
                        }
                    });
                    const total = Object.keys(data).length * 5;
                    const calculation = (ratedUser / total) * 5;
                    userInfo["calaculated_rate"] = calculation;
                } else {
                    userInfo["calaculated_rate"] = 0;
                }
                providerDataSet(userInfo);
                checkViewSet(true)
            })
        });
    }

    const makeCall = useCallback(() => {
        let url = "tel:" + providerData.phone;
        Linking.openURL(url);
    }, [providerData]);

    return (
        <Modal isOpen={checkView} onClose={onCloseFunct}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Body bg="white">
                    {
                        Object.keys(providerData).length === 0 ?
                            (
                                <Box py="10">
                                    <Spinner color="#f63b3b" />
                                </Box>
                            ) : (
                                <>
                                    <Box alignItems="center" mt="5">
                                    <Text fontSize="20" mt="5" fontWeight="500" color="error.500" textAlign="center">We have received your request for immediate assistance.</Text>
                                    </Box>
                                    <Box alignItems="center">
                                        <Image source={{ uri: providerData.profile }} style={design.profilepopup} alt="profile" />
                                    </Box>
                                    <Box alignItems="center" mt="5" mb="3">
                                        <Heading fontSize="30">{providerData.fullname}</Heading>
                                        <Text fontSize="16">{providerData.code}</Text>
                                        <Rating
                                            style={design.RatingSt}
                                            ratingCount={5}
                                            startingValue={providerData.calaculated_rate}
                                            showRating={false}
                                            readonly={true}
                                            imageSize={18}
                                        />
                                    </Box>
                                    <Box alignItems="center">
                                        <Text fontSize="18" textAlign="center">Please stay calm and stay where you are. Our team is on their way to assist you. Thank you for using our services.</Text>
                                    </Box>
                                    <Box alignItems="center" mt="5">
                                        <Text fontSize="12" mt="5" color="gray.300" textAlign="center">Tap anywhere outside of the box to dismiss!</Text>
                                    </Box>
                                </>
                            )
                    }
                </Modal.Body>
            </Modal.Content >
        </Modal >
    )
}

export default memo(Accept_Notificaton);

// == React | React Native == //
import React, { useState, useMemo, useEffect, useCallback } from 'react';

// == Template == //
import { Box, Button, Text, Heading, HStack, Center, NativeBaseProvider, Avatar, Spinner, Pressable } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// == Logout : FIREBASE == //
import Logout from "../../../components/logout";

// == File Fetcher : FIREBASE == //
import FileFetch from "../../../components/fileFetch";

import { auth, db } from "../../../../config";


const HomeUI = ({ Design, nav }) => {

    const [data, dataSet] = useState({});

    const goToProfile = useCallback(() => {
        nav.navigate("Information");
    }, []);

    useEffect(() => {
        const refSeeker = 'aid_provider/' + auth.currentUser.uid + '/'
        const rootRefSeeker = db.ref(refSeeker)

        rootRefSeeker.on('value', async snap => {

            if (snap.exists()) {
                const userInformation = snap.val();
                const fetchProfileURL = await FileFetch(!userInformation.profile ? "profile/index.jpg" : "profile/" + userInformation.profile);
                userInformation["profile"] = fetchProfileURL;
                dataSet(userInformation);
                return false;
            }

            dataSet({});
        });
    }, [])

    const memoizedUserInfo = useMemo(() => {
        return (
            <>
                <Box style={Design.container} bg="white" shadow={2}>
                    <HStack space={2} alignItems="center">
                        <Pressable onPress={goToProfile}>
                            <Avatar
                                bg="white"
                                size="lg"
                                source={{
                                    uri: data.profile
                                }}
                                style={{ borderWidth: 4, borderColor: '#f63b3b', padding: 3 }}
                            >
                                {data.fullname}
                            </Avatar>
                        </Pressable>
                        <Box>
                            <Heading
                                mt="1"
                                ml="3"
                                fontWeight="900"
                                fontSize={20}
                            >
                                {data.fullname}
                            </Heading>
                            <Heading
                                ml="3"
                                fontWeight="medium"
                                size="sm"
                                color="coolGray.600"
                            >
                                ID: {data.code}
                            </Heading>
                        </Box>
                        <HStack space={3} alignItems="center" ml="auto">
                            <Box>
                                <MaterialIcons name="notifications" size={33} color="#f63b3b" onPress={() => {nav.navigate("Notification")}} />
                            </Box>
                            <Box>
                                <MaterialIcons name="logout" size={33} color="#f63b3b" onPress={Logout} />
                            </Box>
                        </HStack>
                    </HStack>
                </Box>
                <Box style={Design.containerBottom}>
                    <HStack space={2}>
                        <Box bg="white" shadow={2} style={Design.containerRightBottom}>
                            <HStack space={2} alignItems="center">
                                <Box>
                                    <FontAwesome5 name="hands-helping" size={25} color="#f63b3b" />
                                </Box>
                                <Box>
                                    <Text
                                        ml="3"
                                        fontWeight="medium"
                                        style={{ fontSize: 18 }}
                                        color="coolGray.600"
                                    >
                                        Respond to distress signals.
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>
                        <Box bg="white" shadow={2} style={Design.containerLeftBottom}>
                            <Box style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                                <FontAwesome5 name="exclamation-triangle" size={25} color="#f63b3b" />
                            </Box>
                        </Box>
                    </HStack>
                </Box>
            </>
        );
    }, [data])

    return memoizedUserInfo
}

export default HomeUI
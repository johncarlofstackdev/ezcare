import React, { useEffect, useMemo, useState, memo } from "react";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
    Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider,
    Pressable, Icon, Avatar, Divider
} from "native-base";


import DocumentPicker from 'react-native-document-picker';
import Loader from "react-native-spinkit";

import { auth, db } from "../../../../config";

import Dimension from "../../../components/Dimension";
import Logout from "../../../components/logout";
import FileFetch from "../../../components/fileFetch";

import moment from "moment";

const ProfileInformation = ({ nav }) => {
    const [data, dataSet] = useState({});

    useEffect(() => {
        const refSeeker = "aid_seeker/" + auth.currentUser.uid + "/";
        const rootRefSeeker = db.ref(refSeeker)
        rootRefSeeker.on('value', async snap => {
            if (snap.exists()) {
                const userInformation = snap.val();
                const fetchProfileURL = await FileFetch(!userInformation.profile ? "profile/index.jpg" : "profile/" + userInformation.profile);
                userInformation["profile"] = fetchProfileURL;
                userInformation["data_added"] =  moment(userInformation["data_added"], "MM/DD/YYYY").format("MMMM D, YYYY");
                dataSet(userInformation);
            } else {
                dataSet({});
            }
        })
    }, []);


    return (
        <>
            {Object.keys(data).length === 0 ?
                (
                    <>
                        <Center flex={1} px="3">
                            <Center w="100%">
                                <HStack space={2} justifyContent="center">
                                    <Loader isVisible={true} size={Dimension.Width - 360} type="ThreeBounce" color='#f63b3b' />
                                </HStack>
                            </Center>
                        </Center>
                    </>
                )
                : (
                    <>
                        <Box>
                            <HStack space={5} alignItems="center">
                                <Pressable onPress={() => nav.goBack()}>
                                    <FontAwesome5 name="arrow-left" size={25} color="#f63b3b" />
                                </Pressable >
                                <Heading fontWeight="600" fontSize={25} >
                                    Profile Information
                                </Heading>
                            </HStack >
                        </Box >
                        <Box bg="white" my="5" rounded="xl" style={{ marginTop: 30 }}>
                            <HStack space={2} alignItems="center">
                                <Avatar
                                    bg="white"
                                    size="xl"
                                    source={{
                                        uri: data.profile
                                    }}
                                    style={{ borderWidth: 4, borderColor: '#f63b3b', padding: 3 }}
                                >
                                    {data.fullname}
                                </Avatar>
                                <Box mb="5">
                                    <Heading
                                        mt="1"
                                        ml="3"
                                        fontWeight="900"
                                        fontSize={30}
                                    >
                                        {data.fullname}
                                    </Heading>
                                    <Heading
                                        ml="3"
                                        fontWeight="medium"
                                        fontSize="20"
                                        color="coolGray.600"
                                    >
                                        ID No. {data.code}
                                    </Heading>
                                </Box>
                            </HStack>
                        </Box>
                        <Box mt="5">
                            <VStack space={5}>
                                <HStack space={5} alignItems="center">
                                    <Box>
                                        <FontAwesome5 name="phone-alt" size={23} color="#f63b3b" />
                                    </Box>
                                    <Text fontSize="23" color="coolGray.600">
                                        {data.phone}
                                    </Text>
                                </HStack>
                                <HStack space={5} alignItems="center">
                                    <Box>
                                        <MaterialIcons name="mail" size={24} color="#f63b3b" />
                                    </Box>
                                    <Text fontSize="23" color="coolGray.600">
                                        {data.email}
                                    </Text>
                                </HStack>
                                <HStack space={5} alignItems="center">
                                    <Box>
                                        <MaterialIcons name="favorite" size={24} color="#f63b3b" />
                                    </Box>
                                    <Text fontSize="23" color="coolGray.600">
                                        Joined on {data.data_added}
                                    </Text>
                                </HStack>
                                <HStack ml={1} space={5} alignItems="center">
                                    <Box>
                                        <FontAwesome5 name="transgender" size={23} color="#f63b3b" />
                                    </Box>
                                    <Text fontSize="23" color="coolGray.600">
                                       {data.gender}
                                    </Text>
                                </HStack>
                                <HStack ml={1} space={5} alignItems="center">
                                    <Box>
                                        <FontAwesome5 name="calendar" size={23} color="#f63b3b" />
                                    </Box>
                                    <Text fontSize="23" color="coolGray.600">
                                        Born in {data.dateOfBirth}
                                    </Text>
                                </HStack>
                                <HStack ml={1} space={5} alignItems="center">
                                    <Box>
                                        <FontAwesome5 name="undo" size={23} color="#f63b3b" />
                                    </Box>
                                    <Text fontSize="23" color="coolGray.600">
                                        {data.age} years old
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                        <Divider my="7" />
                        <VStack space={5}>
                            <Pressable onPress={() => nav.navigate("Settings", data)}>
                                <HStack space={5} alignItems="center">
                                    <Box>
                                        <MaterialIcons name="settings" size={26} color="#f63b3b" />
                                    </Box>
                                    <Text fontSize="23" color="coolGray.600">
                                        Settings
                                    </Text>
                                </HStack>
                            </Pressable>
                            <Pressable onPress={() => nav.navigate("ChangePassword", data)}>
                                <HStack space={5} alignItems="center">
                                    <Box>
                                        <MaterialIcons name="lock" size={26} color="#f63b3b" />
                                    </Box>
                                    <Text fontSize="23" color="coolGray.600">
                                        Change Password
                                    </Text>
                                </HStack>
                            </Pressable>
                            <Pressable onPress={() => nav.navigate("Report")}>
                                <HStack space={5} alignItems="center">
                                    <Box>
                                        <MaterialIcons name="flag" size={26} color="#f63b3b" />
                                    </Box>
                                    <Text fontSize="23" color="coolGray.600">
                                        Report
                                    </Text>
                                </HStack>
                            </Pressable>
                            <Pressable onPress={() => Logout()}>
                                <HStack space={5} alignItems="center">
                                    <Box>
                                        <FontAwesome5 name="power-off" size={22} color="red" />
                                    </Box>
                                    <Text fontSize="23" color="danger.600">
                                        Logout
                                    </Text>
                                </HStack>
                            </Pressable>
                        </VStack>
                    </>
                )}
        </>
    );
}

export default memo(ProfileInformation);

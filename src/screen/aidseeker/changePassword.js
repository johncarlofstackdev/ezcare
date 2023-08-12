import React, { useState } from "react";

import {
    Box, Heading, HStack, VStack, NativeBaseProvider, Button, FormControl,
    Input, Pressable, Icon, WarningOutlineIcon, Alert, IconButton, CloseIcon, Text
} from "native-base";

import { View } from 'react-native';
import Dimension from "../../components/Dimension";
import EditProfileContent from "./components/editProfileContent";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import AlertToast from "../../components/toast";

import firebase from "firebase/compat/app"
import "firebase/compat/auth"

const ChangePassword = ({ navigation }) => {
    const [show22, setShow22] = useState({ status: false, message: "" });

    // For Password Hide and Show
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);

    const [passowrd1, setPassowrd1] = useState("");
    const [passowrd2, setPassowrd2] = useState("");
    const [passowrd3, setPassowrd3] = useState("");

    const [forInvalid1, forInvalid1Set] = useState(false);
    const [forInvalid2, forInvalid2Set] = useState(false);
    const [forInvalid3, forInvalid3Set] = useState(false);

    const changePass = () => {
        const auth = firebase.auth();
        const userAuth = auth.currentUser;

        // if (passowrd1 === "" || passowrd2 == "" || passowrd3 == "") {
        //     if(passowrd1){
        //         forInvalid1Set(false);
        //     } else {
        //         forInvalid1Set(true);
        //     }

        //     if(passowrd2){
        //         forInvalid2Set(false);
        //     } else {
        //         forInvalid2Set(true);
        //     }

        //     if(passowrd3){
        //         forInvalid3Set(false);
        //     } else {
        //         forInvalid3Set(true);
        //     }

        //     return false;
        // }

        if (passowrd2.length < 6) {
            // AlertToast("Error, password must be atleast 6 character.", "error", "error", "bottom");
            setShow22({ status: true, message: "Error, password must be atleast 6 character." });
            messageRemover()
            return false;
        }

        if (passowrd2 !== passowrd3) {
            // AlertToast("Error, invalid Confirmation Password.", "error", "error", "bottom");
            setShow22({ status: true, message: "Error, invalid Confirmation Password." });
            messageRemover()
            return false;
        }

        const credentials = firebase.auth.EmailAuthProvider.credential(userAuth.email, passowrd1);

        userAuth.reauthenticateWithCredential(credentials)
            .then(() => {
                userAuth.updatePassword(passowrd2)
                    .then(() => {
                        AlertToast("Password updated successfully", "success", "success", "bottom");
                        setPassowrd1("");
                        setPassowrd2("");
                        setPassowrd3("");
                    })
                    .catch((error) => {
                        AlertToast(error.message, "error", "error", "bottom");
                    });
            })
            .catch((error) => {
                setShow22({ status: true, message: "Error, Invalid Old Password" });
                messageRemover()
            });
    }

    const onChange1 = (text) => {
        // if (text === "") {
        //     forInvalid1Set(true);
        //     setPassowrd1(text);
        // } else {
        //     forInvalid1Set(false);
        setPassowrd1(text);
        // }
    }

    const onChange2 = (text) => {
        // if (text === "") {
        //     forInvalid2Set(true);
        //     setPassowrd2(text);
        // } else {
        // forInvalid2Set(false);
        setPassowrd2(text);
        // }
    }

    const onChange3 = (text) => {
        // if (text === "") {
        //     forInvalid3Set(true);
        //     setPassowrd3(text);
        // } else {
        //     forInvalid3Set(false);
        setPassowrd3(text);
        // }
    }

    const messageRemover = () => {
        setTimeout(() => {
            setShow22({ status: false, message: "" });
        }, 3000);
    }

    return (
        <NativeBaseProvider>
            <View style={{
                height: Dimension.Height,
                width: Dimension.Width,
                backgroundColor: "white",
                padding: 25,
                paddingTop: 30
            }}>
                <Box>
                    <HStack space={5} alignItems="center">
                        <Pressable onPress={() => navigation.goBack()}>
                            <FontAwesome5 name="arrow-left" size={25} color="#f63b3b" />
                        </Pressable >
                        <Heading fontWeight="600" fontSize={25} >
                            Change Password
                        </Heading>
                    </HStack >
                    <Box>
                        <VStack space={3} mt="8">
                            {show22.status && (
                                <Alert maxW="400" status="error" isOpen={false}>
                                    <VStack space={1} flexShrink={1} w="100%">
                                        <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                            <HStack flexShrink={1} space={2} alignItems="center">
                                                <Alert.Icon />
                                                <Text fontSize="md" fontWeight="medium" _dark={{
                                                    color: "coolGray.800"
                                                }}>
                                                    {show22.message}
                                                </Text>
                                            </HStack>
                                            <IconButton variant="unstyled" _focus={{
                                                borderWidth: 0
                                            }} icon={<CloseIcon size="3" />} _icon={{
                                                color: "coolGray.600"
                                            }} onPress={() => setShow22(false)} />
                                        </HStack>
                                    </VStack>
                                </Alert>
                            )}
                            <FormControl isInvalid={forInvalid1}>
                                <Input
                                    type={show2 ? "text" : "password"}
                                    InputRightElement={
                                        <Pressable onPress={() => setShow2(!show2)}>
                                            <Icon as={<MaterialIcons name={show2 ? "visibility" : "visibility-off"} />} size={6} mr="2" color="muted.400" />
                                        </Pressable>
                                    }
                                    variant="filled"
                                    placeholder="Old Password"
                                    InputLeftElement={
                                        <Icon as={<MaterialIcons name="lock" />} size={6} ml="2" color="muted.400" />
                                    }
                                    onChangeText={onChange1}
                                    value={passowrd1}
                                    style={{ height: 50 }}
                                    size="lg"
                                />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Please enter a character.
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={forInvalid2}>
                                <Input
                                    type={show ? "text" : "password"}
                                    InputRightElement={
                                        <Pressable onPress={() => setShow(!show)}>
                                            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={6} mr="2" color="muted.400" />
                                        </Pressable>
                                    }
                                    variant="filled"
                                    placeholder="New Password"
                                    InputLeftElement={
                                        <Icon as={<MaterialIcons name="lock" />} size={6} ml="2" color="muted.400" />
                                    }
                                    onChangeText={onChange2}
                                    value={passowrd2}
                                    style={{ height: 50 }}
                                    size="lg"
                                />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Please enter a character.
                                </FormControl.ErrorMessage>
                                <FormControl.HelperText ml="2">
                                    Must be atleast 6 characters.
                                </FormControl.HelperText>
                            </FormControl>
                            <FormControl isInvalid={forInvalid3}>
                                <Input
                                    type={show3 ? "text" : "password"}
                                    InputRightElement={
                                        <Pressable onPress={() => setShow3(!show3)}>
                                            <Icon as={<MaterialIcons name={show3 ? "visibility" : "visibility-off"} />} size={6} mr="2" color="muted.400" />
                                        </Pressable>
                                    }
                                    variant="filled"
                                    placeholder="Confirmation Password"
                                    InputLeftElement={
                                        <Icon as={<MaterialIcons name="lock" />} size={6} ml="2" color="muted.400" />
                                    }
                                    onChangeText={onChange3}
                                    value={passowrd3}
                                    style={{ height: 50 }}
                                    size="lg"
                                />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    Please enter a character.
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <Button mt="6" colorScheme="red" fontSize="md" style={{ height: 50 }} onPress={changePass}>
                                UPDATE
                            </Button>
                            <Button colorScheme="gray" fontSize="md" style={{ height: 50 }} onPress={() => navigation.goBack()}>
                                CANCEL
                            </Button>
                        </VStack>
                    </Box>
                </Box >
            </View>
        </NativeBaseProvider >
    );
}

export default ChangePassword;

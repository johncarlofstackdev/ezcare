import React, { useState } from "react";

import {
    Box, Heading, HStack, VStack, NativeBaseProvider, Button, FormControl,
    Input, Pressable, Icon, WarningOutlineIcon, TextArea, Text, Alert, IconButton, CloseIcon
} from "native-base";

import { View } from 'react-native';
import Dimension from "../../components/Dimension";
import EditProfileContent from "./components/editProfileContent";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import AlertToast from "../../components/toast";

import Trackingcode from "../../components/codeGenerator";
import { db, auth } from "../../../config";

const Report = ({ navigation }) => {
    const [report, reportSet] = useState("");
    const [show2, setShow2] = useState({ status: false, message: "" });

    const handleSubmit = async () => {

        const code = Trackingcode(6);
        const reference = Trackingcode(15);
        const _uid = auth.currentUser.uid;
        
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const currentDate = month + "/" + day + "/" + year;

        if (report === "") {
            setShow2({ status: true, message: "Please fill on the blank" });
            messageRemover()
            return;
        }

        try {
            const dataInfo = { code: code, uid: _uid, report: report, date_added: currentDate };
            await db.ref(`report/${reference}/`).set(dataInfo);
            AlertToast("Report successfully reported!", "success", "success", "bottom");
            reportSet("");
        } catch (error) {
            AlertToast(error, "success", "success", "bottom");
        }
    }

    const messageRemover = () => {
        setTimeout(() => {
            setShow2({ status: false, message: "" });
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
                            Report Bugs
                        </Heading>
                    </HStack >
                    <Box>
                        <VStack space={3} mt="8">
                            {show2.status && (
                                <Alert maxW="400" status="error" isOpen={false}>
                                    <VStack space={1} flexShrink={1} w="100%">
                                        <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                            <HStack flexShrink={1} space={2} alignItems="center">
                                                <Alert.Icon />
                                                <Text fontSize="md" fontWeight="medium" _dark={{
                                                    color: "coolGray.800"
                                                }}>
                                                    {show2.message}
                                                </Text>
                                            </HStack>
                                            <IconButton variant="unstyled" _focus={{
                                                borderWidth: 0
                                            }} icon={<CloseIcon size="3" />} _icon={{
                                                color: "coolGray.600"
                                            }} onPress={() => setShow2(false)} />
                                        </HStack>
                                    </VStack>
                                </Alert>
                            )}

                            <Text fontSize="lg" fontWeight="medium">
                                Report
                            </Text>
                            <TextArea h={20} placeholder="Enter the report bugs here" fontSize="lg" onChangeText={text => reportSet(text)} />
                            <Button mt="6" colorScheme="red" style={{ height: 50 }} onPress={handleSubmit} >
                                SUBMIT REPORT
                            </Button>
                            <Button colorScheme="gray" style={{ height: 50 }} onPress={() => navigation.goBack()}>
                                CANCEL
                            </Button>
                        </VStack>
                    </Box>
                </Box >
            </View>
        </NativeBaseProvider >
    );
}

export default Report;

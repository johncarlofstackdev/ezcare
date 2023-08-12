import * as React from "react";
import { NativeBaseProvider, Box, ScrollView, Text, Heading, VStack, HStack, Center, Pressable, Avatar, Divider } from "native-base";
import { View, StyleSheet, Image } from 'react-native';
import Dimension from "../../components/Dimension";
import ProfileInformation from "./components/profileInformation";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Loader from "react-native-spinkit";
import moment from "moment";
import { auth, db } from "../../../config";
import emtpy from "../../assets/img/notification-icon.png";
import RealTimeAgo from "../../components/agoRealTime";

const fetchUserData = async (id) => {
    const userDataRef = db.ref(`aid_seeker/${id}/`);
    const userData = await userDataRef.once("value");
    return userData.val();
};

const Notification = ({ navigation }) => {
    const [data, dataSet] = React.useState({ status: false, set: null });

    React.useEffect(() => {
        const rootRef = db.ref("incedent");
        const handleSnapshot = async (snapshot) => {
            if (!snapshot.exists()) {
                dataSet({ status: false, set: [] });
                return;
            }

            const userDataRef = db.ref(`aid_provider/${auth.currentUser.uid}/`);
            const userData = await userDataRef.once("value");
            const userDataVal = userData.val();

            const response = snapshot.val();
            let arrData = [];

            for (const keyName in response) {
                if (userDataVal.serviceType == response[keyName].serviceType) {
                    response[keyName].aidInfo = await fetchUserData(response[keyName].aid_seeker_id);
                    response[keyName].timestamp = moment(`${response[keyName].date_requested} ${response[keyName].time}`, "M/D/YYYY H:mm").valueOf();
                    arrData = [...arrData, response[keyName]];
                }
            }

            arrData.sort((a, b) => b.timestamp - a.timestamp);
            dataSet({ status: true, set: arrData });
        };

        rootRef.on("value", handleSnapshot);
        return () => rootRef.off("value", handleSnapshot);
    }, []);

    if (!data.status && data.set === null) {
        return (
            <NativeBaseProvider>
                <Center flex={1} px="3" bg="muted.50">
                    <Center w="100%">
                        <HStack space={2} justifyContent="center">
                            <Loader isVisible={true} size={Dimension.Width - 360} type="ThreeBounce" color="#f63b3b" />
                        </HStack>
                    </Center>
                </Center>
            </NativeBaseProvider >
        );
    }

    if (data.set.length === 0) {
        return (
            <NativeBaseProvider>
                <View style={styles.container}>

                    <Box>
                        <HStack space={5} alignItems="center">
                            <Pressable onPress={() => navigation.goBack()}>
                                <FontAwesome5 name="arrow-left" size={25} color="#f63b3b" />
                            </Pressable >
                            <Heading fontWeight="600" fontSize={25} >
                                Notification
                            </Heading>
                        </HStack >
                    </Box >

                    <Box h={Dimension.Height - 180}>
                        <Center flex={1} px="3">
                            <VStack space={5}>
                                <Image
                                    source={emtpy}
                                    style={{ width: 150, height: 150 }}
                                />
                                <Text
                                    fontSize="13"
                                    fontWeight="700"
                                    color="light.400"
                                >
                                    NO NOTIFICATION AVAILABLE
                                </Text>
                            </VStack>
                        </Center>
                    </Box>

                </View>
            </NativeBaseProvider >
        );
    }


    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <Box>
                    <HStack space={5} alignItems="center">
                        <Pressable onPress={() => navigation.goBack()}>
                            <FontAwesome5 name="arrow-left" size={25} color="#f63b3b" />
                        </Pressable >
                        <Heading fontWeight="600" fontSize={25} >
                            Notification
                        </Heading>
                    </HStack >
                </Box >

                <Box mt="5" h={Dimension.Height - 200}>
                    <ScrollView>
                        <VStack space={2} alignItems="center">
                            {data.set.map((value, i) => (
                                <Box w="100%" p="3" bg="rose.50" rounded="md" shadow={3} key={i}>
                                    <HStack space={3} alignItems="center">
                                        <Box>
                                            <Heading color="error.700">
                                                Emergency Alert!
                                            </Heading>
                                            <Text
                                                fontSize="15"
                                                fontWeight="400"
                                            >
                                                {value.aidInfo.fullname} nearby is in need of your assistance..
                                            </Text>
                                        </Box>
                                    </HStack>
                                    <Box style={styles.ago}>
                                        <Text
                                            fontSize="15"
                                            fontWeight="400"
                                            color="rose.800"
                                        >
                                            <RealTimeAgo dateRequested={value.date_requested} timeRequested={value.time} />
                                        </Text>
                                    </Box>
                                </Box>
                            ))}
                        </VStack>
                    </ScrollView>
                </Box >

            </View>
        </NativeBaseProvider>
    );
};

export default React.memo(Notification);

const styleData = {
    container: {
        height: Dimension.Height,
        width: Dimension.Width,
        backgroundColor: "white",
        padding: 25,
        paddingTop: 30
    },
    ago: {
        position: "absolute",
        right: 10,
        top: 4
    }
}

const styles = StyleSheet.create(styleData);
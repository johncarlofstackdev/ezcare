import React, { useEffect, useState } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { HStack, Center, NativeBaseProvider } from "native-base";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Loader from "react-native-spinkit";

import Dimension from "../../components/Dimension";

// Firebase config
import { auth, db } from "../../../config";

// Screen
import AidProviderHome from "../../screen/aidprovider/home";
import AidProviderEvent from "../../screen/aidprovider/event";
import Profile from "../../screen/aidprovider/profile";
import EditProfile from "../../screen/aidprovider/editprofileInformation";
import ChangePassword from "../../screen/aidprovider/changePassword";
import Report from "../../screen/aidseeker/report";
import Notification from "../../screen/aidprovider/notification";

const Stack = createNativeStackNavigator();
const options = { headerShown: false };

const AidProviderScreen = () => {
    // 1 - initial | 2 - already accept | 3 - No Session
    const [checkHelp, checkHelpSet] = useState({ number: 1, data: {} });

    useEffect(() => {
        const ref = 'incedent/';
        const rootRef = db.ref(ref);
        const fetchRequest = async () => {
            const userId = auth.currentUser.uid;
            rootRef.on('value', snap => {
                if (!snap.exists()) {
                    checkHelpSet({ number: 3, data: {} });
                    return false;
                }

                const data = {};

                snap.forEach(childSnapshot => {
                    const childData = childSnapshot.val();
                    if (childData.status === 2 && childData.aid_provider_id === userId) {
                        data[childSnapshot.key] = childData;
                    }
                });

                if (Object.keys(data).length !== 0) {
                    checkHelpSet({ number: 2, data: data });
                    return false;
                }

                checkHelpSet({ number: 3, data: {} });
            });
        }
        fetchRequest();
    }, []);

    if (checkHelp.number === 1) {
        return (
            <NativeBaseProvider>
                <Center flex={1} px="3" bg="muted.50">
                    <Center w="100%">
                        <HStack space={2} justifyContent="center">
                            <Loader isVisible={true} size={Dimension.Width - 360} type='ThreeBounce' color='#f63b3b' />
                        </HStack>
                    </Center>
                </Center>
            </NativeBaseProvider >
        );
    }

    if (checkHelp.number === 2) {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Eventaidprovider" component={AidProviderEvent} options={options} initialParams={checkHelp.data} />
            </Stack.Navigator>
        );
    }


    return (
        <Stack.Navigator>
            <Stack.Screen name="Homeaidprovider" component={AidProviderHome} options={options} />
            <Stack.Screen name="Information" component={Profile} options={options} />
            <Stack.Screen name="Settings" component={EditProfile} options={options} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={options} />
            <Stack.Screen name="Report" component={Report} options={options} />
            <Stack.Screen name="Notification" component={Notification} options={options} />
        </Stack.Navigator>
    );
};

export default AidProviderScreen;
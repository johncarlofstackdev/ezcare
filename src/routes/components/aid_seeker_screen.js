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
import Home from "../../screen/aidseeker/home";
import Nottification from "../../screen/aidseeker/notification";
import Event from "../../screen/aidseeker/event";
import Finding from "../../screen/aidseeker/findingProvider";
import Profile from "../../screen/aidseeker/profile";
import EditProfile from "../../screen/aidseeker/editprofileInformation";
import ChangePassword from "../../screen/aidseeker/changePassword";
import Report from "../../screen/aidseeker/report";

const Stack = createNativeStackNavigator();
const options = { headerShown: false }
const Tab = createBottomTabNavigator();

const Logout = () => {
    auth.signOut();
}

const AidSeekerScreen = () => {

    // 1 - initial | 2 - already Press | 3 - To aid provider map | 4 - ambulance | 5 - no session
    const [checkHelp, checkHelpSet] = useState({number: 1, data: {}});

    useEffect(() => {
        const ref = 'incedent/';
        const rootRef = db.ref(ref);
        const fetchRequest = async () => {
            const userId = auth.currentUser.uid;
            rootRef.on('value', snap => {
                if (!snap.exists()) {
                    checkHelpSet({number: 5, data: {}});
                    return false;
                }

                const data = {};

                snap.forEach(childSnapshot => {
                    const childData = childSnapshot.val();
                    if ((childData.status === 1 || childData.status === 2 || childData.status === 3) && childData.aid_seeker_id === userId) {
                        data[childSnapshot.key] = childData;
                    }
                });

                const key = Object.keys(data);

                if (key.length === 0) {
                    const params = {number: 5, data: data}
                    checkHelpSet(params);
                    return false;
                }

                if (data[key[0]].status === 1) {
                    const params = {number: 2, data: data}
                    checkHelpSet(params);
                    return false;
                }

                if (data[key[0]].status === 2 || data[key[0]].status === 3) {
                    const params = {number: 3, data: data}
                    checkHelpSet(params);
                    return false;
                }
            })
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
            <FindingScreen params={checkHelp.data} />
        );
    }

    if (checkHelp.number === 3) {
        return (
            <SessionScreen params={checkHelp.data} />
        );
    }

    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'grey',
            tabBarStyle: {
                paddingBottom: 10, fontSize: 10, padding: 10, height: 70
            },
            tabBarShowLabel: false
        }}>
            <Tab.Screen name="Home" component={Home} options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => {
                    return (
                        <MaterialIcons name="home" size={30} color={focused ? '#f63b3b' : 'gray'} />
                    );
                }
            }} />

            <Tab.Screen name="Notification" component={Nottification} options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => {
                    return (
                        <MaterialIcons name="notifications" size={30} color={focused ? '#f63b3b' : 'gray'} />
                    );
                }
            }} />

            <Tab.Screen name="Logout" component={Logout} options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => {
                    return (
                        <MaterialIcons name="logout" size={30} color={focused ? '#f63b3b' : 'gray'} />
                    );
                }
            }} />

            <Stack.Screen name="Profile" component={ProfileScreens} options={{
                headerShown: false,
                tabBarButton: (props) => null,
                tabBarStyle: { display: 'none' },
            }} />
        </Tab.Navigator>
    );
};

const ProfileScreens = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Information" component={Profile} options={options} />
            <Stack.Screen name="Settings" component={EditProfile} options={options} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={options} />
            <Stack.Screen name="Report" component={Report} options={options} />
        </Stack.Navigator>
    )
}

const FindingScreen = ({ params }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Finding" component={Finding} options={options} initialParams={params} />
        </Stack.Navigator>
    )
}

const SessionScreen = ({ params }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Event" component={Event} options={options} initialParams={params} />
        </Stack.Navigator>
    )
}

export default AidSeekerScreen;
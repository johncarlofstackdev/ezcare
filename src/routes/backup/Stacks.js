import React, { useEffect, useState } from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, PermissionsAndroid, BackHandler, Alert } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

// Firebase config
import { auth, db } from "../../config";

// Screens for All users
import Login from "../screen/Login";
import Register from "../screen/Register";
import AidProviderRegisration from "../screen/apRegisration";

// aid seeker screen
import Home from "../screen/aidseeker/home";
import Nottification from "../screen/aidseeker/notification";
import Event from "../screen/aidseeker/event";
import Finding from "../screen/aidseeker/findingProvider";
import Profile from "../screen/aidseeker/profile";
import EditProfile from "../screen/aidseeker/editprofileInformation";

// aid provider screen
import AidProviderHome from "../screen/aidprovider/home";
import AidProviderEvent from "../screen/aidprovider/event";

// import Logout from "../components/logout";

const Logout = () => {
    auth.signOut().then(() => {
    }).catch(error => alert(error.message))
}

const Stack = createNativeStackNavigator();
const options = { headerShown: false }
const Tab = createBottomTabNavigator();

// Aid Seeker Tabs
const BottomTabs = () => {
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
            <Stack.Screen name="Event" component={Event} options={{
                headerShown: false,
                tabBarButton: (props) => null,
                tabBarStyle: { display: 'none' },
            }} />
            <Stack.Screen name="Finding" component={Finding} options={{
                headerShown: false,
                tabBarButton: (props) => null,
                tabBarStyle: { display: 'none' },
            }} />
            <Stack.Screen name="Profile" component={Profile} options={{
                headerShown: false,
                tabBarButton: (props) => null,
                tabBarStyle: { display: 'none' },
            }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{
                headerShown: false,
                tabBarButton: (props) => null,
                tabBarStyle: { display: 'none' },
            }} />
        </Tab.Navigator>
    );
}

// const showLocationAlert = () => {
//     Alert.alert(
//         'Location Services Off',
//         'Please enable location services for this app to work properly.',
//         [
//             {
//                 text: 'Cancel',
//                 onPress: () => BackHandler.exitApp(),
//                 style: 'cancel',
//             },
//             { text: 'Settings', onPress: () => Linking.openSettings() },
//         ],
//         { cancelable: false },
//     );
// }

const Navigation = () => {
    const [user, setUser] = useState();

    // Handle user state changes
    const onAuthStateChanged = (user) => {
        if (user) {
            const refSeeker = 'aid_seeker/' + user.uid + '/'
            const rootRefSeeker = db.ref(refSeeker)
            rootRefSeeker.on('value', snap => {
                if (snap.exists()) {
                    setUser(snap.val());
                } else {
                    const refProvider = 'aid_provider/' + user.uid + '/'
                    const rootRefProvider = db.ref(refProvider)
                    rootRefProvider.on('value', snap => {
                        setUser(snap.val())
                    });
                }
            })
        } else {
            Logout();
            setUser(user);
        }
    };

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged)
        return subscriber
    }, [])

    if (!user) {
        return (
            <Loginav />
        );
    } else {
        if (user.status) {
            if (user.type == 2) {
                return (
                    <NavigationContainer>
                        <BottomTabs />
                    </NavigationContainer>
                );
            } else {
                return (
                    <NavigationContainer>
                        <Stack.Navigator>
                            <Stack.Screen name="Homeaidprovider" component={AidProviderHome} options={options} />
                            <Stack.Screen name="Eventaidprovider" component={AidProviderEvent} options={options} />
                        </Stack.Navigator>
                    </NavigationContainer>
                );
            }
        } else {
            return (
                <Loginav />
            );
        }
    }
};

const Loginav = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={options} />
                <Stack.Screen name="Register" component={Register} options={options} />
                <Stack.Screen name="AidProviderRegisration" component={AidProviderRegisration} options={options} />
            </Stack.Navigator>
        </NavigationContainer>
    )
};

export default Navigation;



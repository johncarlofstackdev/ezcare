import React, { useEffect, useState } from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Firebase config
import { auth, db } from "../../config";

// Screens for All users
import Login from "../screen/Login";
import Register from "../screen/Register";
import AidProviderRegisration from "../screen/apRegisration";

// aid seeker screen
import AidSeekerScreen from "./components/aid_seeker_screen";

// aid provider screen
import AidProviderScreen from "./components/aid_provider_screen";

// import Logout from "../components/logout";

const Stack = createNativeStackNavigator();
const options = { headerShown: false }

const Navigation = () => {
    const [authUser, authUserSet] = useState(null);

    // Handle user state changes
    const onAuthStateChanged = (user) => {
        if (user !== null) {
            const refSeeker = 'aid_seeker/' + auth.currentUser.uid + '/'
            const rootRefSeeker = db.ref(refSeeker)
            rootRefSeeker.once('value', snap => {
                if (snap.exists()) {
                    authUserSet(snap.val());
                } else {
                    const refProvider = 'aid_provider/' + auth.currentUser.uid + '/'
                    const rootRefProvider = db.ref(refProvider)
                    rootRefProvider.once('value', snap => {
                        authUserSet(snap.val())
                    });
                }
            });
        } else {
            authUserSet(null);
        }
    };

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged)
        return subscriber
    }, []);

    // Load the No need to authenticate user if login
    if (!authUser) {
        return (
            <NotAuthenticateScreen />
        );
    }

    // check the user type

    if (authUser.type === 2) {
        return (
            <NavigationContainer>
                <AidSeekerScreen />
            </NavigationContainer>
        )
    }

    if (authUser.type === 1) {
        return (
            <NavigationContainer>
                <AidProviderScreen />
            </NavigationContainer>
        );
    }

    return (
        <NotAuthenticateScreen />
    );
};

const NotAuthenticateScreen = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={options} />
                <Stack.Screen name="Register" component={Register} options={options} />
                <Stack.Screen name="AidProviderRegisration" component={AidProviderRegisration} options={options} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;



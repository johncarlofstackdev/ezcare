import React from "react";
import { NativeBaseProvider } from "native-base";
import { View } from 'react-native';
import Dimension from "../../components/Dimension";
import ProfileInformation from "./components/profileInformation";

const Profile = ({ navigation }) => {
    return (
        <NativeBaseProvider>
            <View style={{
                height: Dimension.Height,
                width: Dimension.Width,
                backgroundColor: "white",
                padding: 25,
                paddingTop: 30
            }}>
                <ProfileInformation nav={navigation} />
            </View>
        </NativeBaseProvider >
    );
}

export default Profile;

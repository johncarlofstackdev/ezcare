import React from "react";
import { NativeBaseProvider } from "native-base";
import { View } from 'react-native';
import Dimension from "../../components/Dimension";
import EditProfileContent from "./components/editProfileContent";
import { useRoute } from '@react-navigation/native';

const EditProfile = ({ navigation }) => {
    
    const route = useRoute();

    return (
        <NativeBaseProvider>
            <View style={{
                height: Dimension.Height,
                width: Dimension.Width,
                backgroundColor: "white",
                padding: 25,
                paddingTop: 30
            }}>
                <EditProfileContent nav={navigation} userData={route.params} />
            </View>
        </NativeBaseProvider >
    );
}

export default EditProfile;

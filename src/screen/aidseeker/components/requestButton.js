import React, { useEffect, useState, useCallback, memo } from "react";
import { View, StyleSheet, Dimensions, Animated, ActivityIndicator } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import {
    Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider,
    Pressable, Icon, Avatar, Spinner, Container, Circle
} from "native-base"

import { auth, db } from "../../../../config";

import Dimension from "../../../components/Dimension";

const RequestButton = (props) => {
    const { requestType, onClick } = props;
    const [data, dataSet] = useState(false);

    useEffect(() => {
        const ref = 'incedent/';
        const rootRef = db.ref(ref);
        const userId = auth.currentUser.uid;
        const fetchRequest = async () => {
            rootRef.on('value', snap => {
                if (snap.exists()) {
                    const data = {};
                    snap.forEach(childSnapshot => {
                        const childData = childSnapshot.val();
                        if ((childData.status === 1 || childData.status === 2) && childData.aid_seeker_id === userId) {
                            data[childSnapshot.key] = childData;
                        }
                    });
                    if (Object.keys(data).length !== 0) {
                        dataSet(true)
                    } else {
                        dataSet(false)
                    }
                } else {
                    dataSet(false)
                }
            })
        }
        fetchRequest();

        return () => { fetchRequest() }
    }, []);

    return (
        <Center h={Dimension.Height - 500} alignItems="center">
            <Pressable
                w={Dimension.Width - 100}
                onLongPress={() => { onClick(requestType) }}
                delayLongPress={2000}
                disabled={data}
                h={Dimension.Width - 100}
            >
                {({
                    isHovered,
                    isFocused,
                    isPressed
                }) => {
                    return < View style={{
                        width: '100%',
                        height: '100%',
                        maxHeight: Dimension.Width - 100,
                        maxWidth: Dimension.Width - 100,
                        backgroundColor: 'white',
                        borderRadius: 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 3,
                        borderColor: requestType === 1 ? data ? '#db8f8f' : (isPressed ? '#db8f8f' : '#f63b3b') : (requestType === 2 ? data ? '#9D9CE8' : (isPressed ? '#9D9CE8' : '#4035C2') : data ? '#FFD4B0x' : (isPressed ? '#FFD4B0' : '#ff7500')),
                        transform: [{
                            scale: data ? 0.93 : (isPressed ? 0.93 : 1)
                        }]
                    }}>
                        <View style={{
                            width: Dimension.Width - 140,
                            height: Dimension.Width - 140,
                            backgroundColor: requestType === 1 ? data ? '#db8f8f' : (isPressed ? '#db8f8f' : '#f63b3b') : (requestType === 2 ? data ? '#9D9CE8' : (isPressed ? '#9D9CE8' : '#4035C2') : data ? '#FFD4B0' : (isPressed ? '#FFD4B0' : '#ff7500')),
                            borderRadius: 250,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {requestType === 1 ? <FontAwesome name="hands-helping" size={140} color="white" /> : (requestType === 2 ? <FontAwesome name="shield-alt" size={140} color="white" /> : <FontAwesome name="fire" size={140} color="white" />)}
                        </View>
                    </View>
                }}
            </Pressable>
        </Center>
    );
};

export default memo(RequestButton);
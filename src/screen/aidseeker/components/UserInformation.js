import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Heading, HStack, Pressable, Avatar } from "native-base"

import { auth, db } from "../../../../config";

import FileFetch from "../../../components/fileFetch";

const UserInformation = ({ nav }) => {
    const [data, dataSet] = useState({});

    const goToProfile = useCallback(() => {
        nav.navigate("Profile");
    }, []);

    useEffect(() => {
        const refSeeker = 'aid_seeker/' + auth.currentUser.uid + '/'
        const rootRefSeeker = db.ref(refSeeker)
        rootRefSeeker.on('value', async snap => {
            if (snap.exists()) {
                const userInformation = snap.val();
                const fetchProfileURL = await FileFetch(!userInformation.profile ? "profile/index.jpg" : "profile/" + userInformation.profile);
                userInformation["profile"] = fetchProfileURL;
                dataSet(userInformation);
            } else {
                dataSet({});
            }
        });
    }, []);

    const memoizedUserInfo = useMemo(() => {
        return (
            <Box bg="white" shadow={2} p="3" rounded="xl">
                <HStack space={2}>
                    <Pressable onPress={goToProfile}>
                        <Avatar
                            bg="white"
                            size="lg"
                            source={{
                                uri: data.profile
                            }}
                            style={{ borderWidth: 4, borderColor: '#f63b3b', padding: 3 }}
                        >
                            {data.fullname}
                        </Avatar>
                    </Pressable>
                    <Box>
                        <Heading
                            mt="1"
                            ml="3"
                            fontWeight="900"
                            fontSize={25}
                        >
                            {data.fullname}
                        </Heading>
                        <Heading
                            ml="3"
                            fontWeight="medium"
                            size="sm"
                            color="coolGray.600"
                        >
                            {data.email}
                        </Heading>
                    </Box>
                </HStack>
            </Box>
        )
    }, [data]);

    return memoizedUserInfo
}

export default UserInformation
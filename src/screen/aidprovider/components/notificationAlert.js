import * as React from "react";
import {
    Modal, Button, Box, Select, CheckIcon, Spinner, VStack, Heading,
    Text
} from "native-base";
import { View, Image, StyleSheet } from "react-native";
import { db, auth } from "../../../../config";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Sound from 'react-native-sound';
import Sounds from "../../../assets/img/alert.mp3";

Sound.setCategory("Playback");

const musicPlay = () => {
    const sound = new Sound("alert.mp3", Sound.MAIN_BUNDLE, error => {
        if (error) {
            console.log("Failed to load sound", error);
            return;
        }

        sound.play();
    });
}

const NotiAlert = ({userType}) => {
    const [modal, modalSet] = React.useState(false);
    const [reference, referSet] = React.useState("");
    const [data, dataSet] = React.useState([]);

    const closeModal = React.useCallback(async () => {
        await db.ref("incedent/" + reference + "/").update({ checkViewed: data });
        modalSet(false);
        referSet([]);
        dataSet([]);
    }, [reference, data]);

    React.useEffect(() => {
        const rootRef = db.ref("incedent/");
        const handleSnapshot = async (snapshot) => {
            if (!snapshot.exists()) {
                modalSet(false);
                return;
            }

            const { aid_provider_id, checkViewed, status, serviceType} = snapshot.val();
            const key = snapshot.key;

            if (typeof checkViewed === "boolean" && status === 1 && serviceType == userType) {
                referSet(key);
                modalSet(true);
                musicPlay();
                dataSet([auth.currentUser.uid]);
            } else {
                if(serviceType == userType){
                    const arry = checkViewed;
                    if (!arry.includes(auth.currentUser.uid) && status === 1) {
                        arry.push(auth.currentUser.uid);
                        referSet(key);
                        modalSet(true);
                        musicPlay(arry);
                        dataSet(arry);
                    }
                }
            }
        };

        rootRef.on("child_added", handleSnapshot);
        return () => rootRef.off("child_added", handleSnapshot);

    }, []);

    return (
        <Modal isOpen={modal} onClose={closeModal}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Body bg="white">
                    <Box style={styles.boxContainer}>
                        <VStack alignItems="center" space={2}>
                            <FontAwesome5 name="exclamation-triangle" size={100} color="#f63b3b" />
                            <Text fontSize="25" textAlign="center" style={styles.title}>
                                Emergency Alert!
                            </Text>
                            <Text fontSize="14" textAlign="center">
                                Medical assistance is urgently needed. Please bring any necessary medical supplies or equipment you have with you. Your prompt response could help save a life. Thank you.
                            </Text>
                            <Button
                                mt="6"
                                style={{ height: 48, width: "100%" }}
                                fontWeight="600"
                                colorScheme="red"
                                fontSize="lg"
                                onPress={closeModal}>
                                OK
                            </Button>
                        </VStack>
                    </Box>
                </Modal.Body>
            </Modal.Content >
        </Modal >
    );
}

const styles = StyleSheet.create({
    image: {
        width: 160,
        height: 80,
    },
    title: {
        fontWeight: 900,
        marginTop: 20
    },
    boxContainer: {
        marginTop: 50
    }
});

export default NotiAlert;

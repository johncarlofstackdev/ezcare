import * as React from "react";
import {
    Modal, Button, Box, Select, CheckIcon, Spinner, VStack, Heading,
    Text
} from "native-base";
import Ambulance from "../../../assets/img/ambualance1.png";
import { View, Image, StyleSheet } from "react-native";
import { db, auth } from "../../../../config";

const CheckRequest = (props) => {
    const { functions } = props;
    const [modal, modalSet] = React.useState(false);
    const [referenceAmbuID, referenceAmbuIDSet] = React.useState(""); 

    React.useEffect(() => {
        const fetchRequest = () => {
            const ref = 'ambulance/';
            const rootRef = db.ref(ref);

            const userId = auth.currentUser.uid;

            rootRef.on('value', snap => {
                if (!snap.exists()) {
                    modalSet(false);
                    return false;
                }

                const data = {};

                snap.forEach(childSnapshot => {
                    const childData = childSnapshot.val();
                    if (childData.provider_id === userId && childData.status && !childData.readStatus) {
                        data[childSnapshot.key] = childData;
                    }
                });

                if (Object.keys(data).length !== 0) {
                    referenceAmbuIDSet(Object.keys(data)[0]);
                    modalSet(true);
                    return;
                }

                modalSet(false);
            });
        };

        fetchRequest();
    }, []);

    return (
        <Modal isOpen={modal} onClose={() => functions.closeModal(referenceAmbuID)}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Body bg="white">
                    <Box style={styles.boxContainer}>
                        <VStack alignItems="center" space={2}>
                            <Image
                                source={Ambulance}
                                style={styles.image}
                            />
                            <Text fontSize="25" textAlign="center" style={styles.title}>
                                Ambulance is on the way!
                            </Text>
                            <Text fontSize="14" textAlign="center">
                                We kindly request that you speak in a calm and reassuring manner to the person in need until the ambulance arrives. Your words can help alleviate their anxiety and provide comfort during this stressful time. Thank you for your cooperation.
                            </Text>
                            <Button mt="6" style={{ height: 48, width: "100%" }} fontWeight="600" colorScheme="red" fontSize="lg" onPress={() => functions.closeModal(referenceAmbuID)}>
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

export default CheckRequest;
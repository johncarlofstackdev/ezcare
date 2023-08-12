import * as React from "react";
import { Modal, Button, Box, Select, CheckIcon, TextArea, Text, Heading } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const confirmationRequest = (props) => {
    const { states, functions } = props;
    return (
        <Modal isOpen={states.requestConfirmation} onClose={functions.closeRequest}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Confirmation</Modal.Header>
                <Modal.Body bg="white">
                    <Box alignItems="center" my="3">
                        <FontAwesome5 name="exclamation-triangle" size={40} color="#f63b3b" />
                        <Heading mt="5">Are you sure?</Heading>
                        <Text textAlign="center" mt="2">You won't be able to revert this once requested.</Text>
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={functions.closeRequest}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" onPress={functions.request}>
                            Yes, Request
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content >
        </Modal >
    );
};

export default React.memo(confirmationRequest);
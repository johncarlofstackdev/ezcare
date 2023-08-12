import * as React from "react";
import { Modal, Button, Box, Select, CheckIcon, Spinner } from "native-base";

const Success = (props) => {
    const { states } = props;
    return (
        <Modal isOpen={states.successState}>
            <Modal.Content maxWidth="400px">
                <Modal.Body bg="white">
                    <Box width="100%" my="3">
                        <Spinner size="sm" color="error.600" />
                    </Box>
                </Modal.Body>
            </Modal.Content >
        </Modal >
    );
};

export default React.memo(Success);
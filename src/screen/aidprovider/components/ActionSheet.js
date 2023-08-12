// == React | React Native == //
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';

// == Template == //
import { Box, Button, Text, Heading, HStack, Center, NativeBaseProvider, Avatar, Spinner, Actionsheet } from "native-base";

// == Actionsheet Information == //
import RequestInfo from "./fetchRequestInfo"

const ActionSheet = forwardRef((props, Ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const [actionSheetRef, eventCodeRef] = Ref;

    useImperativeHandle(actionSheetRef, () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false)
    }), []);

    const closeModal = () => {
        setIsOpen(false)
    }

    return (
        <Actionsheet isOpen={isOpen} onClose={closeModal}>
            <Actionsheet.Content>
                <Box w="100%" px={4} mb="4" justifyContent="center">
                    <Text fontSize="16" color="coolGray.600">
                        Request Information
                    </Text>
                </Box>
                <RequestInfo eventCode={eventCodeRef.current} />
            </Actionsheet.Content >
        </Actionsheet >
    );
});

export default ActionSheet
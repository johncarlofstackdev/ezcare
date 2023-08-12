import { Text, HStack, VStack, Toast, Alert } from "native-base";

const AlertToast = (mssg, scheme, status, postion) => {
    return Toast.show({
        render: () => {
            return (
                <Alert w="100%" colorScheme={scheme} status={status}>
                    <VStack space={2} flexShrink={1} w="100%">
                        <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                            <HStack space={2} flexShrink={1} alignItems="center">
                                <Alert.Icon />
                                <Text>
                                    {mssg}
                                </Text>
                            </HStack>
                        </HStack>
                    </VStack>
                </Alert>
            );
        },
        placement: postion
    })
}

export default AlertToast
import React, { useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
    Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider,
    Pressable, Icon, Checkbox, Modal, WarningOutlineIcon, Alert, IconButton, CloseIcon, Select,
    CheckIcon
} from "native-base";
import { auth, db, storage } from "../../config"
import { ref, set } from "firebase/database";
import { View } from "react-native";

import Dimension from "../components/Dimension";
import DocumentPicker from 'react-native-document-picker';
import AlertToast from "../components/toast";
import TrackingCode from "../components/codeGenerator";
import Logout from "../components/logout";

const AidProviderRegisration = ({ navigation }) => {
    const [errorDisplay, errorDisplaySet] = useState({ status: false, message: "" });
    // For Password Hide and Show
    const [show, setShow] = useState(false)
    // For Modal
    const [showModal, setShowModal] = useState(false)

    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [serviceType, serviceTypeSet] = useState('');

    const [document, setDocument] = useState(null);

    /// for temers and agreement fucntion
    const [term, termSet] = useState(false);



    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            setDocument(result);
        } catch (error) {
            console.log(error);
        }
    }

    const uploadFile = async (fileUri, fileName) => {
        const response = await fetch(fileUri);
        const blob = await response.blob();

        // rename file with timestamp and default name
        const splitedName = fileName.split(".")
        const newFileName = "ATATCHMENT-" + Date.now() + "." + splitedName[splitedName.length - 1];

        // reference where to store the renamed file
        const ref = storage.ref().child(`attachments/${newFileName}`);

        // upload file to firebase storage
        await ref.put(blob);

        // return donwload URL
        // return await ref.getDownloadURL();
        return newFileName;
    };

    const handleSignUp = async () => {

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const currentDate = month + "/" + day + "/" + year;

        if (!document) {
            errorDisplaySet({ status: true, message: "Please select a document/files." });
            messageRemover();
            return;
        }

        if (!term) {
            errorDisplaySet({ status: true, message: "Please on Agree Terms & conditions." });
            messageRemover();
            return;
        }

        try {
            const crendetials = await auth.createUserWithEmailAndPassword(email, password);
            const resUploadFile = await uploadFile(document[0].uri, document[0].name);

            const newUser = {
                code: TrackingCode(10),
                fullname: fullname,
                email: crendetials.user.email,
                phone: phone,
                status: false,
                profile: false,
                serviceType: serviceType,
                type: 1,
                verified_status: false,
                data_added: currentDate
            };

            const FileData = { attachment: resUploadFile };
            const fileReference = "attachments/" + crendetials.user.uid + "/";
            await db.ref(fileReference).set(FileData);

            const reference = "aid_provider/" + crendetials.user.uid + "/";
            await db.ref(reference).set(newUser);

            AlertToast("Your account has been successfully registered!", "success", "success", "top");

            setTimeout(() => {
                navigation.navigate("Login");
            }, 2000);
        } catch (error) {

            let reponse = error.message;
            const start = reponse.indexOf("(");
            const end = reponse.indexOf(")");
            let newStr = reponse.substring(0, start) + reponse.substring(end + 1);
            const errorResponse = newStr.replace("Firebase:", "Error:").replace(" .", "");

            errorDisplaySet({ status: true, message: errorResponse });
            messageRemover();
        }
    }

    const termsAndAgree = () => {
        if (!term) {
            termSet(true);
            return;
        }

        termSet(false);
    }

    const messageRemover = () => {
        setTimeout(() => {
            errorDisplaySet({ status: false, message: "" });
        }, 3000);
    }

    return (
        <NativeBaseProvider>

            <View style={{
                height: Dimension.Height,
                width: Dimension.Width,
                backgroundColor: "white",
            }}>
                <Center flex={1} px="3">
                    <Box safeArea p="2" py="8" w="90%" maxW="340">
                        <Heading size="md" fontWeight="900" color="#f63b3b" fontSize={30}>
                            Aid Provider Registration
                        </Heading>
                        <Heading mt="1" _dark={{
                            color: "warmGray.200"
                        }} color="coolGray.600" fontWeight="medium" size="md" fontSize={24}>
                            Create your account!
                        </Heading>

                        <VStack space={3} mt="8">

                            {errorDisplay.status && (
                                <Alert maxW="400" status="error" isOpen={false}>
                                    <VStack space={1} flexShrink={1} w="100%">
                                        <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                            <HStack flexShrink={1} space={2} alignItems="center">
                                                <Alert.Icon />
                                                <Text fontSize="md" fontWeight="medium" _dark={{
                                                    color: "coolGray.800"
                                                }}>
                                                    {errorDisplay.message}
                                                </Text>
                                            </HStack>
                                            <IconButton variant="unstyled" _focus={{
                                                borderWidth: 0
                                            }} icon={<CloseIcon size="3" />} _icon={{
                                                color: "coolGray.600"
                                            }} onPress={() => errorDisplaySet(false)} />
                                        </HStack>
                                    </VStack>
                                </Alert>
                            )}

                            <FormControl>
                                <Input
                                    variant="filled"
                                    placeholder="Full Name"
                                    InputLeftElement={
                                        <Icon as={<MaterialIcons name="person" />} size={6} ml="2" color="muted.400" />
                                    }
                                    onChangeText={text => setFullName(text)}
                                    value={fullname}
                                    style={{ height: 50 }}
                                    size="lg"
                                />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="md" />}>
                                    This field is required.
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <FormControl>
                                <Input
                                    variant="filled"
                                    placeholder="sample@gmail.com"
                                    InputLeftElement={<Icon as={<MaterialIcons name="email" />} size={6} ml="2" color="muted.400" />}
                                    onChangeText={text => setEmail(text)}
                                    value={email}
                                    style={{ height: 50 }}
                                    size="lg"
                                />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="md" />}>
                                    This field is required.
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <FormControl>
                                <Input
                                    variant="filled"
                                    keyboardType='numeric'
                                    placeholder="Number"
                                    InputLeftElement={
                                        <Icon as={<MaterialIcons name="phone" />} size={6} ml="2" color="muted.400" />
                                    }
                                    onChangeText={text => setPhone(text)}
                                    value={phone}
                                    style={{ height: 50 }}
                                    size="lg"
                                />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="md" />}>
                                    This field is required.
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <FormControl>
                                <Select
                                    style={{ height: 50 }}
                                    variant="filled"
                                    selectedValue={serviceType}
                                    accessibilityLabel="Gender"
                                    placeholder="Type"
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size="5" />
                                    }}
                                    size="lg"
                                    onValueChange={itemValue => serviceTypeSet(itemValue)}>
                                    <Select.Item label="First Aider" value="1" />
                                    <Select.Item label="Police" value="2" />
                                    <Select.Item label="Bureau of fire protection" value="3" />
                                </Select>
                            </FormControl>
                            <FormControl>
                                <Input variant="filled" type={show ? "text" : "password"}
                                    InputRightElement={
                                        <Pressable onPress={() => setShow(!show)}>
                                            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={6} mr="2" color="muted.400" />
                                        </Pressable>
                                    }
                                    InputLeftElement={<Icon as={<MaterialIcons name="lock" />} size={6} ml="2" color="muted.400" />}
                                    onChangeText={text => setPassword(text)}
                                    value={password}
                                    placeholder="Password"
                                    style={{ height: 50 }}
                                    size="lg"
                                />
                                <FormControl.HelperText ml="2">
                                    Must be atleast 6 characters.
                                </FormControl.HelperText>
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="md" />}>
                                    This field is required.
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <Button colorScheme="green" style={{ height: 50 }} onPress={pickDocument}>
                                Select File
                            </Button>
                            <FormControl>
                                <Checkbox value="danger"
                                    onPress={termsAndAgree}
                                    mt="2"
                                    ml="2"
                                    _text={{
                                        fontSize: "lg",
                                        fontWeight: "500"
                                    }} colorScheme="red">
                                    Agree with
                                    <Link
                                        onPress={() => setShowModal(true)}
                                        _text={{
                                            fontSize: "lg",
                                            fontWeight: "500",
                                            color: "#f63b3b"
                                        }}>
                                        Terms & Condtions
                                    </Link>.
                                </Checkbox>
                            </FormControl>
                            <Button mt="6" colorScheme="red" style={{ height: 50 }} onPress={handleSignUp}>
                                REGISTER
                            </Button>
                            <HStack mt="5" justifyContent="center">
                                <Text
                                    fontSize="lg"
                                    color="coolGray.600"
                                    _dark={{
                                        color: "warmGray.200"
                                    }}>
                                    Sign up as Aid-Seeker instead?{" "}
                                </Text>
                                <Link
                                    _text={{
                                        color: "#f63b3b",
                                        fontWeight: "medium",
                                        fontSize: "lg"
                                    }}
                                    onPress={() => navigation.goBack()}
                                >
                                    Click Here
                                </Link>
                            </HStack>
                        </VStack>
                    </Box>
                </Center>
            </View>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{ _dark: { bg: "coolGray.800" }, bg: "black" }}>
                <Modal.Content maxWidth="350" maxH="400">
                    <Modal.CloseButton />
                    <Modal.Header>Terms & Condtions</Modal.Header>
                    <ModalBody />
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => {
                                setShowModal(false);
                            }} colorScheme="secondary">
                                Agree
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal >
        </NativeBaseProvider >
    )
}

const ModalBody = () => {
    return (
        <Modal.Body>
            Create a 'Return Request' under “My Orders” section of App/Website.
            Follow the screens that come up after tapping on the 'Return’
            button. Please make a note of the Return ID that we generate at the
            end of the process. Keep the item ready for pick up or ship it to us
            basis on the return mode.
        </Modal.Body>
    )
}

export default AidProviderRegisration
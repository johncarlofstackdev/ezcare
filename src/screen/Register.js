import React, { useState } from "react"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import {
    Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider,
    Pressable, Icon, Checkbox, Modal, WarningOutlineIcon, Alert, IconButton, CloseIcon, CheckIcon,
    Select
} from "native-base"

import { View } from "react-native";
import Dimension from "../components/Dimension";

// import { ref, set, update, onValue, remove } from "firebase/database";
import { auth, db } from "../../config";
import AlertToast from "../components/toast";
import TrackingCode from "../components/codeGenerator";

const Register = ({ navigation }) => {
    // For Password Hide and Show
    const [show, setShow] = useState(false);
    // For Modal
    const [showModal, setShowModal] = useState(false);

    /// for temers and agreement fucntion
    const [term, termSet] = useState(false);

    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [age, ageSet] = useState("");
    const [gender, genderSet] = useState("");
    const [date, dateSet] = useState("");

    const [errorDisplay, errorDisplaySet] = useState({ status: false, message: "" });

    const handleSignUp = async () => {

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const currentDate = month + "/" + day + "/" + year;

        if (!term) {
            errorDisplaySet({ status: true, message: "Please on Agree Terms & conditions." });
            messageRemover();
            return;
        }

        try {
            const crendetials = await auth.createUserWithEmailAndPassword(email, password);

            const newUser = {
                code: TrackingCode(10),
                fullname: fullname,
                email: crendetials.user.email,
                phone: phone,
                age: age,
                gender: gender,
                dateOfBirth: date,
                status: true,
                profile: false,
                type: 2,
                data_added: currentDate
            };

            const reference = "aid_seeker/" + crendetials.user.uid + "/";
            await db.ref(reference).set(newUser);
            AlertToast("Your account has been successfully registered!", "success", "success", "top");
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
                <Center w="100%" flex={1} px="3" >
                    <Box safeArea p="2" py="8" w="90%" maxW="340">
                        <Heading size="xl" fontSize={50} fontWeight="900" color="#f63b3b" >
                            REGISRATION
                        </Heading>
                        <Heading mt="1" _dark={{
                            color: "warmGray.200"
                        }} color="coolGray.600" fontSize={24} fontWeight="medium" size="xs">
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
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
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
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
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
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    This field is required.
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <HStack space={2}>
                                <FormControl w="49%">
                                    <Input
                                        variant="filled"
                                        keyboardType='numeric'
                                        placeholder="Age"
                                        onChangeText={text => ageSet(text)}
                                        value={age}
                                        style={{ height: 50 }}
                                        size="lg"
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        This field is required.
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl w="49%">
                                    <Select
                                        style={{ height: 50 }}
                                        variant="filled"
                                        selectedValue={gender}
                                        accessibilityLabel="Gender"
                                        placeholder="Gender"
                                        _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }}
                                        size="lg"
                                        onValueChange={itemValue => genderSet(itemValue)}>
                                        <Select.Item label="Female" value="Female" />
                                        <Select.Item label="Male" value="Male" />
                                    </Select>
                                </FormControl>
                            </HStack>
                            <FormControl>
                                <Input
                                    variant="filled"
                                    placeholder="Date of Birth"
                                    onChangeText={text => dateSet(text)}
                                    value={date}
                                    style={{ height: 50 }}
                                    size="lg"
                                />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    This field is required.
                                </FormControl.ErrorMessage>
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
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    This field is required.
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <FormControl>
                                <Checkbox
                                    value="danger"
                                    mt="2"
                                    ml="2"
                                    onPress={termsAndAgree}
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
                            <Button mt="6" colorScheme="red" fontSize="md" style={{ height: 50 }} onPress={handleSignUp}>
                                REGISTER
                            </Button>
                            <HStack mt="5" justifyContent="center">
                                <Text
                                    fontSize="lg"
                                    color="coolGray.600"
                                    _dark={{
                                        color: "warmGray.200"
                                    }}>
                                    Already have an account?{" "}
                                </Text>
                                <Link
                                    _text={{
                                        color: "#f63b3b",
                                        fontWeight: "medium",
                                        fontSize: "lg"
                                    }}
                                    onPress={() => navigation.goBack()}
                                >
                                    Login
                                </Link>
                            </HStack>
                            <HStack justifyContent="center">
                                <Text
                                    fontSize="lg"
                                    color="coolGray.600"
                                    _dark={{
                                        color: "warmGray.200"
                                    }}>
                                    OR
                                </Text>
                            </HStack>
                            <HStack justifyContent="center">
                                <Text
                                    fontSize="md"
                                    color="coolGray.600"
                                    _dark={{
                                        color: "warmGray.200"
                                    }}>
                                    Sign up as Aid-Provider?{" "}
                                </Text>
                                <Link
                                    _text={{
                                        color: "#f63b3b",
                                        fontWeight: "medium",
                                        fontSize: "lg"
                                    }}
                                    onPress={() => navigation.navigate('AidProviderRegisration')}
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
                            }} colorScheme="red">
                                Okay, I agree.
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

export default Register
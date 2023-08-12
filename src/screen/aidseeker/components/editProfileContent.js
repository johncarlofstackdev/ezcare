import React, { useMemo, useState, memo } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
    Box, Heading, VStack, FormControl, Input, Button, HStack, Center,
    Pressable, Icon, Avatar, Divider, useToast, Alert, Select, CheckIcon
} from "native-base";

import DocumentPicker from 'react-native-document-picker';
import { auth, db } from "../../../../config";
import uploadFile from "../../../components/fileUploader";

import AlertToast from "../../../components/toast";

const EditProfileContent = ({ nav, userData }) => {
    const toast = useToast();

    const [imagePreviewer, imagePreviewerSet] = useState("");

    // For Password Hide and Show
    const [show, setShow] = useState(false);
    // For Modal
    const [showModal, setShowModal] = useState(false);

    const [fullname, setFullName] = useState(userData.fullname);
    const [phone, setPhone] = useState(userData.phone);
    const [age, setAge] = useState(userData.age);
    const [date, setDate] = useState(userData.dateOfBirth);
    const [gender, setGender] = useState(userData.gender);


    const SetProfileImage = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            imagePreviewerSet(result);
        } catch (error) {
            console.log(error);
        }
    }

    const updateProfileInfo = async () => {
        const _uid = auth.currentUser.uid;
        try {
            const dataInfo = { fullname: fullname, phone: phone, age: age, dateOfBirth: date, gender: gender};
            if (imagePreviewer !== "") {
                dataInfo["profile"] = await uploadFile(imagePreviewer[0].uri, imagePreviewer[0].name);
            }
            await db.ref(`aid_seeker/${_uid}`).update(dataInfo);
            AlertToast("Profile Successfully Updated!", "success", "success", "bottom");
        } catch (error) {
            AlertToast(error, "success", "success", "bottom");
        }
    }

    

    return (
        <Box>
            <HStack space={5} alignItems="center">
                <Pressable onPress={() => nav.goBack()}>
                    <FontAwesome5 name="arrow-left" size={25} color="#f63b3b" />
                </Pressable >
                <Heading fontWeight="600" fontSize={25} >
                    Settings
                </Heading>
            </HStack >
            <Center my="5">
                <Avatar
                    bg="white"
                    size="2xl"
                    source={{
                        uri: imagePreviewer === "" ? userData.profile : imagePreviewer[0].uri
                    }}
                    style={{ borderWidth: 4, borderColor: '#f63b3b', padding: 3 }}
                >
                </Avatar>
                <Pressable style={{
                    width: 38,
                    height: 38,
                    backgroundColor: "#f63b3b",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 50,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    marginTop: -35,
                    marginLeft: 70
                }} onPress={SetProfileImage}>
                    <MaterialIcons name="edit" size={20} color="white" />
                </Pressable>
            </Center>
            <Divider />
            <Box>
                <VStack space={3} mt="8">
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
                    </FormControl>

                    <FormControl>
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
                            onValueChange={itemValue => setGender(itemValue)}>
                            <Select.Item label="Female" value="Female" />
                            <Select.Item label="Male" value="Male" />
                        </Select>
                    </FormControl>
                    <FormControl>
                        <Input
                            variant="filled"
                            keyboardType='numeric'
                            placeholder="Age"
                            onChangeText={text => setAge(text)}
                            value={age}
                            style={{ height: 50 }}
                            size="lg"
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            variant="filled"
                            placeholder="Date of birth"
                            onChangeText={text => setDate(text)}
                            value={date}
                            style={{ height: 50 }}
                            size="lg"
                        />
                    </FormControl>
                    <Button mt="6" colorScheme="red" fontSize="md" style={{ height: 50 }} onPress={updateProfileInfo}>
                        UPDATE PROFILE
                    </Button>
                    <Button colorScheme="gray" fontSize="md" style={{ height: 50 }} onPress={() => nav.goBack()}>
                        CANCEL
                    </Button>
                </VStack>
            </Box>
        </Box >
    );
}

export default memo(EditProfileContent);

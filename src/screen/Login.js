import React, { useState } from "react"
import { View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import {
  Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider,
  Pressable, Icon, Alert, IconButton, CloseIcon
} from "native-base";

import { auth, db } from "../../config"
import { ref, set } from "firebase/database"

import Dimension from "../components/Dimension";
import AlertToast from "../components/toast";
import Logout from "../components/logout";

const Login = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState({ status: false, message: "" });

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const authResponse = await auth.signInWithEmailAndPassword(email, password);
      const refSeeker = "aid_seeker/" + authResponse.user.uid + "/";
      const rootRefSeeker = db.ref(refSeeker)
      rootRefSeeker.once("value", snap => {

        if (snap.exists()) {
          const aidSeeker = snap.val()

          if (!aidSeeker.status) {
            Logout();
          }

          return false;
        }

        const refProvider = "aid_provider/" + authResponse.user.uid + "/";
        const rootRefProvider = db.ref(refProvider);
        rootRefProvider.once("value", snap => {
          const aidProvider = snap.val()
          if (!aidProvider.status) {
            Logout();
          }
        });

      });
    } catch (error) {

      let reponse = error.message;
      const start = reponse.indexOf("(");
      const end = reponse.indexOf(")");
      let newStr = reponse.substring(0, start) + reponse.substring(end + 1);
      const errorResponse = newStr.replace("Firebase:", "Error:").replace(" .", "");
      setShow2({ status: true, message: errorResponse });
      messageRemover();

    }
  }

  const messageRemover = () => {
    setTimeout(() => {
      setShow2({ status: false, message: "" });
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
            <Heading fontWeight="900" fontSize={60} color="#f63b3b" >
              WELCOME
            </Heading>
            <Heading mt="1" _dark={{
              color: "warmGray.200"
            }} color="coolGray.600" fontSize={24} fontWeight="medium" size="xs">
              Sign in to continue!
            </Heading>

            <VStack space={3} mt="8">
              {show2.status && (
                <Alert maxW="400" status="error" isOpen={false}>
                  <VStack space={1} flexShrink={1} w="100%">
                    <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                      <HStack flexShrink={1} space={2} alignItems="center">
                        <Alert.Icon />
                        <Text fontSize="md" fontWeight="medium" _dark={{
                          color: "coolGray.800"
                        }}>
                          {show2.message}
                        </Text>
                      </HStack>
                      <IconButton variant="unstyled" _focus={{
                        borderWidth: 0
                      }} icon={<CloseIcon size="3" />} _icon={{
                        color: "coolGray.600"
                      }} onPress={() => setShow2(false)} />
                    </HStack>
                  </VStack>
                </Alert>
              )}

              <FormControl>
                <Text fontSize="lg" mb="2" fontWeight="medium">
                  Email
                </Text>
                <Input variant="filled"
                  style={{ height: 50 }}
                  size="lg"
                  placeholder="sample@gmail.com"
                  InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={6} ml="2" color="muted.400" />}
                  onChangeText={text => setEmail(text)}
                  value={email}
                />
              </FormControl>
              <FormControl>
                <Text fontSize="lg" mb="2" fontWeight="medium">
                  Password
                </Text>
                <Input
                  variant="filled"
                  type={show ? "text" : "password"}
                  style={{ height: 50 }}
                  InputRightElement={
                    <Pressable onPress={() => setShow(!show)} >
                      <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />}
                        size={6} mr="2" color="muted.400" />
                    </Pressable>
                  }
                  InputLeftElement={
                    <Icon as={<MaterialIcons name="lock" />} size={6} ml="2" color="muted.400" />
                  }
                  size="lg"
                  onChangeText={text => setPassword(text)}
                  value={password}
                  placeholder="Password"
                />
                <Link _text={{
                  fontSize: "lg",
                  fontWeight: "500",
                  color: "#f63b3b"
                }} alignSelf="flex-end" mt="2">
                  Forget Password?
                </Link>
              </FormControl>
              <Button mt="6" style={{ height: 48 }} fontWeight="600" colorScheme="red" fontSize="lg" onPress={handleLogin}>
                LOGIN
              </Button>
              <HStack mt="10" justifyContent="center">
                <Text fontSize="lg" color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }}>
                  Don't have an account yet?{" "}
                </Text>
                <Link _text={{
                  color: "#f63b3b",
                  fontWeight: "medium",
                  fontSize: "lg"
                }}
                  onPress={() => navigation.navigate('Register')}
                >
                  Create Account
                </Link>
              </HStack>
            </VStack>
          </Box>
        </Center>
      </View>
    </NativeBaseProvider >
  );
}

export default Login;

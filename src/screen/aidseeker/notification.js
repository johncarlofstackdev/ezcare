import * as React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
  Box, Text, Heading, VStack, HStack, Center, NativeBaseProvider, ScrollView
} from "native-base";
import { View, StyleSheet, Image } from 'react-native';
import Loader from 'react-native-spinkit';
import Dimension from "../../components/Dimension";
import { auth, db, storage } from "../../../config";
import moment from "moment";
import RealTimeAgo from "../../components/agoRealTime";
import emtpy from "../../assets/img/notification-icon.png";

const fetchUserData = async (id) => {
  const userDataRef = db.ref(`aid_provider/${id}/`);
  const userData = await userDataRef.once("value");
  return userData.val();
}

const Notification = ({ navigation }) => {

  const [data, dataSet] = React.useState({ status: false, set: null });

  React.useEffect(() => {
    const rootRef = db.ref("incedent");
    const handleSnapshot = async (snapshot) => {
      if (!snapshot.exists()) {
        dataSet({ status: false, set: [] });
        return;
      }

      const response = snapshot.val();
      let arrData = [];

      for (const keyName in response) {
        if (response[keyName].aid_seeker_id === auth.currentUser.uid && response[keyName].status === 4) {
          response[keyName].aidInfo = await fetchUserData(response[keyName].aid_provider_id);
          response[keyName].timestamp = moment(`${response[keyName].date_close} ${response[keyName].time_close}`, "M/D/YYYY H:mm").valueOf();
          arrData = [...arrData, response[keyName]];
        }
      }

      arrData.sort((a, b) => b.timestamp - a.timestamp);
      dataSet({ status: true, set: arrData });
    };

    rootRef.on("value", handleSnapshot);
    return () => rootRef.off("value", handleSnapshot);
  }, []);

  if (!data.status && data.set === null) {
    return (
      <NativeBaseProvider>
        <Center flex={1} px="3" bg="muted.50">
          <Center w="100%">
            <HStack space={2} justifyContent="center">
              <Loader isVisible={true} size={Dimension.Width - 360} type="ThreeBounce" color="#f63b3b" />
            </HStack>
          </Center>
        </Center>
      </NativeBaseProvider >
    );
  }

  if (data.set.length === 0) {
    return (
      <NativeBaseProvider>
        <View style={styles.container}>

          <Box>
            <HStack space={5} alignItems="center">
              <Pressable onPress={() => navigation.goBack()}>
                <FontAwesome5 name="arrow-left" size={25} color="#f63b3b" />
              </Pressable >
              <Heading fontWeight="600" fontSize={25} >
                Notification
              </Heading>
            </HStack >
          </Box >

          <Box h={Dimension.Height - 180}>
            <Center flex={1} px="3">
              <VStack space={5}>
                <Image
                  source={emtpy}
                  style={{ width: 150, height: 150 }}
                />
                <Text
                  fontSize="13"
                  fontWeight="700"
                  color="light.400"
                >
                  NO NOTIFICATION AVAILABLE
                </Text>
              </VStack>
            </Center>
          </Box>

        </View>
      </NativeBaseProvider >
    );
  }

  return (
    <NativeBaseProvider>
      <View style={styles.container}>

        <Box>
          <HStack space={5} alignItems="center">
            <Pressable onPress={() => navigation.goBack()}>
              <FontAwesome5 name="arrow-left" size={25} color="#f63b3b" />
            </Pressable >
            <Heading fontWeight="600" fontSize={25} >
              Notification
            </Heading>
          </HStack >
        </Box >

        <Box mt="5" h={Dimension.Height - 200}>
          <ScrollView>
            <VStack space={2} alignItems="center">
              {data.set.map((value, i) => (
                <Box w="100%" p="3" bg="rose.50" rounded="md" shadow={3} key={i}>
                  <HStack space={3} alignItems="center">
                    <Box>
                      <Heading color="green.700">
                        Success!
                      </Heading>
                      <Text
                        fontSize="15"
                        fontWeight="400"
                      >
                        {value.aidInfo.fullname} has completed the service.
                      </Text>
                    </Box>
                  </HStack>
                  <Box style={styles.ago}>
                    <Text
                      fontSize="15"
                      fontWeight="400"
                      color="rose.800"
                    >
                      <RealTimeAgo dateRequested={value.date_close} timeRequested={value.time_close} />
                    </Text>
                  </Box>
                </Box>
              ))}
            </VStack>
          </ScrollView>
        </Box >
      </View>
    </NativeBaseProvider >
  );
};

const styleData = {
  container: {
    height: Dimension.Height,
    width: Dimension.Width,
    backgroundColor: "white",
    padding: 25,
    paddingTop: 30
  },
  ago: {
    position: "absolute",
    right: 10,
    top: 4
  }
}

const styles = StyleSheet.create(styleData);

export default Notification;

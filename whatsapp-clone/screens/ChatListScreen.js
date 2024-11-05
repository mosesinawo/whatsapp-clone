import React, { useEffect, useLayoutEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import CustomHeaderButton from "../components/CustomHeaderButton";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChatListScreen = (props) => {
  const selectedUser = props.route?.params?.selectedUserId;
  const userData = useSelector((state) => state.auth.userData);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <CustomHeaderButton>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("NewChat")}
          >
            <Ionicons name="create-outline" size={30} color="black" />
          </TouchableOpacity>
        </CustomHeaderButton>
      ),
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    const chatUsers = [selectedUser, userData.userId];

    const navigationProps = {
        newChatData:{users:chatUsers},
    }

    props.navigation.navigate("ChatScreen", navigationProps);
  }, [props.route?.params]);

  return (
    <View style={styles.container}>
      <Text>Chat list screen</Text>

      <Button
        title="Go to chat screen"
        onPress={() => props.navigation.navigate("ChatScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatListScreen;

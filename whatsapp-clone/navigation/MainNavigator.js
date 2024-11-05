import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../utils/firebaseHelper";
import { child, get, off, onValue, ref } from "firebase/database";
import { setStoredUsers } from "../store/userSlice";
import { setChatsData } from "../store/chatSlice";
import { setChatMessages, setStarredMessages } from "../store/messagesSlice";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: "",
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () =>{
  return (
    <Stack.Navigator options={{ headerShown: false }}>
    <Stack.Group>
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerTitle: "",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="ChatSettings"
        component={ChatSettingsScreen}
        options={{
          headerTitle: "Settings",
          headerBackTitle: "Back",
        }}
      />
    </Stack.Group>
    <Stack.Group options={{presentation:'modal'}}>
      <Stack.Screen name="NewChat" component={NewChatScreen} />
    </Stack.Group>
  </Stack.Navigator>
  )
}

const MainNavigator = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  const { storedUsers } = useSelector((state) => state.users);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch()

  useEffect(() => {
    console.log("Subscribing to Firebase listeners");
  
    const dbRef = ref(database);
    const userChatsRef = child(dbRef, `userChats/${userData.userId}`);
    const refs = [userChatsRef];
  
    // Listener for userChats
    const unsubscribeUserChats = onValue(userChatsRef, (querySnapshot) => {
      try {
        const chatIdsData = querySnapshot.val() || {};
        const chatIds = Object.values(chatIdsData);
  
        const chatsData = {};
        let chatsFoundCount = 0;
  
        chatIds.forEach((chatId) => {
          const chatRef = child(dbRef, `chats/${chatId}`);
          refs.push(chatRef);
  
          const unsubscribeChat = onValue(chatRef, (chatSnapshot) => {
            try {
              chatsFoundCount++;
  
              const data = chatSnapshot.val();
              if (data && data.users.includes(userData.userId)) {
                data.key = chatSnapshot.key;
  
                data.users.forEach((userId) => {
                  if (!storedUsers[userId]) {
                    const userRef = child(dbRef, `users/${userId}`);
  
                    get(userRef)
                      .then((userSnapshot) => {
                        const userSnapshotData = userSnapshot.val();
                        dispatch(setStoredUsers({ newUsers: { [userId]: userSnapshotData } }));
                      })
                      .catch((error) => console.error("Error fetching user data:", error));
  
                    refs.push(userRef);
                  }
                });
  
                chatsData[chatSnapshot.key] = data;
              }
  
              if (chatsFoundCount >= chatIds.length) {
                dispatch(setChatsData({ chatsData }));
                setIsLoading(false);
              }
            } catch (error) {
              console.error("Error in chat listener:", error);
            }
          });
  
          refs.push(chatRef);
  
          const messagesRef = child(dbRef, `messages/${chatId}`);
          refs.push(messagesRef);
  
          const unsubscribeMessages = onValue(messagesRef, (messagesSnapshot) => {
            try {
              const messagesData = messagesSnapshot.val();
              dispatch(setChatMessages({ chatId, messagesData }));
            } catch (error) {
              console.error("Error in messages listener:", error);
            }
          });
  
          refs.push(messagesRef);
        });
  
        if (chatsFoundCount === 0) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in userChats listener:", error);
      }
    });
  
    // Listener for userStarredMessages
    const userStarredMessagesRef = child(dbRef, `userStarredMessages/${userData.userId}`);
    refs.push(userStarredMessagesRef);
  
    const unsubscribeStarredMessages = onValue(userStarredMessagesRef, (querySnapshot) => {
      try {
        const starredMessages = querySnapshot.val() ?? {};
        dispatch(setStarredMessages({ starredMessages }));
      } catch (error) {
        console.error("Error in starred messages listener:", error);
      }
    });
  
    refs.push(userStarredMessagesRef);
  
    return () => {
      console.log("Unsubscribing Firebase listeners");
      refs.forEach((ref) => off(ref));
    };
  }, [database, userData, storedUsers]);
  
  return (
   <StackNavigator/>
  );
};

export default MainNavigator;

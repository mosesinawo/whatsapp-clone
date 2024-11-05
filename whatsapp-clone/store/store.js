import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import usersReducer from "./userSlice"
import chatsReducer from './chatSlice'
import messagesReducer from './messagesSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
        chats:chatsReducer ,
        messages:messagesReducer // Add userSlice here for user management slice.  See userSlice.js for example.  Replace 'users' with your slice name.  This is a basic example.  You may need to customize this further based on your application's needs.  For example, you might want to handle errors and loading states in a more robust way.  You could also consider using a library like Redux Toolkit or Redux Saga for more complex state management.  These would
    }
});
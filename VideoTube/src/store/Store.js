import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice.js';

const store = configureStore({
    reducer: {
        userInfo: userReducer
    }
});

export default store;

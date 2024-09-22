import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../features/login/loginSlice';
import centerReducer from "../features/centers/centerSlice";
import memberReducer from "../features/members/memberSlice";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer ,
    center:centerReducer,
    member:memberReducer,
    counter:counterReducer
  },
});

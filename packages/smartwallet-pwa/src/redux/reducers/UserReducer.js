import { createSlice, createAction, current } from "@reduxjs/toolkit";
import {
  LS_USER_KEY,
  credential_mobil,
  credential_email,
  credential_address,
  credential_birthday,
  initialState,
} from "../../Const";
export const update = createAction("update");
const addDynamicField = createAction("add-dynamic-field");
const updateDynamicField = createAction("update-dynamic-field");
const loadStoreData = createAction("load_store_data");
export const addArticles = createAction("add-articles");

const UserReducer = createSlice({
  name: "user",
  initialState,
  extraReducers: {
    //const field = state[action.payload.id] || {}

    [update]: (state, action) => {
      let newState;
      const { payload } = action;
      console.log(current(state));
      console.log(action.payload);
      const field = { ...state[payload.id], ...payload };
      newState = { ...state, [payload.id]: field };
      localStorage.setItem(LS_USER_KEY, JSON.stringify(newState));
      return newState;
    },

    [addDynamicField]: (state, action) => {
      let newState;
      const { payload } = action;
      console.log(current(state));
      console.log(action.payload);
      newState = {
        ...state,
        dynamicFields: state.dynamicFields.concat(payload),
      };
      localStorage.setItem(LS_USER_KEY, JSON.stringify(newState));
      return newState;
    },

    [updateDynamicField]: (state, action) => {
      let newState;
      const { payload } = action;
      console.log(current(state));
      console.log(action.payload);
      newState = {
        ...state,
        dynamicFields: state.dynamicFields.map((field) => {
          if (field.id === payload.id) {
            return { ...field, ...payload };
          }
          return field;
        }),
      };
      localStorage.setItem(LS_USER_KEY, JSON.stringify(newState));
      return newState;
    },

    [addArticles]: (state, action) => {
      let newState = {
        ...state,
        articles: [...state.articles, action.payload],
      };
      localStorage.setItem(LS_USER_KEY, JSON.stringify(newState));
      return newState;
    },

    [loadStoreData]: (state, action) => {
      return action.payload;
    },
  },
});

export default UserReducer.reducer;

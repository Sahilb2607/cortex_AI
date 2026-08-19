import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  Artifacts: [],
  isLoading:false
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    get_messages: (state, action) => {
      state.messages = action.payload;
    },
    set_messages: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setArtifacts: (state,action) => {
      state.Artifacts = action.payload;
    },
     setisLoading: (state,action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { get_messages, set_messages, clearMessages,setArtifacts,setisLoading} =
  messagesSlice.actions;
export default messagesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversation: [],
  selectedConv: null,
};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    get_Conversation: (state, action) => {
      state.conversation = Array.isArray(action.payload) ? action.payload : [];
    },
    set_Conversation: (state, action) => {
      const incoming = action.payload;
      if (!incoming) return;
      const exists = state.conversation.some((conv) => conv?._id === incoming?._id);
      if (!exists) {
        state.conversation = [incoming, ...state.conversation];
      }
    },
    setSelectedConversation: (state, action) => {
      state.selectedConv = action.payload;
    },
    setConvtitle: (state, action) => {
      const { conversationId, title } = action.payload;
      state.conversation = state.conversation.map((conv) =>
        conv?._id === conversationId ? { ...conv, title } : conv,
      );

      if (state.selectedConv?._id === conversationId) {
        state.selectedConv = { ...state.selectedConv, title };
      }
    },
  },
});

export const { set_Conversation, get_Conversation, setSelectedConversation, setConvtitle } = conversationSlice.actions;
export default conversationSlice.reducer;

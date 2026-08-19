import api from "../utils/axios.js";
export const getmessages = async (conversationId) => {
  try {
    const data = await api.get(`/api/chat/messages/${conversationId}`);
    return data.data;
  } catch (error) {
    console.log(error);
    return []
  }
};

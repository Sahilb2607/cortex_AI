import api from "../utils/axios.js";

export const sendmessage = async (payload) => {
  try {
    const  data  = await api.post("/api/agent/chat", payload);
    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

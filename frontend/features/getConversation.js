import api from "../utils/axios.js"
export const getConversation=async ()=>{
try {
     const response=await api.get("/api/chat/get-conversations")
     return response.data
} catch (error) {
    console.log(error)
    return []
}
}
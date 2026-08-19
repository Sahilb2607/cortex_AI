import api from "../utils/axios.js"
export const setConversation=async ()=>{
try {
     const response=await api.get("/api/chat/create-conversations")
     return response.data
} catch (error) {
    console.log(error)
    return []
}
}
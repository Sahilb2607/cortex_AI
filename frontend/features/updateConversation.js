import api from "../utils/axios"

export const updateConversation=async (payload)=>{
    try {
        const data=await api.post("/api/chat/conversations",payload)
        return data.data
    } catch (error) {
        console.log(error)
        return []
    }
}
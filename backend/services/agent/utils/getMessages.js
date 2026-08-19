import axios from "axios"
export const getMessages=async (conversationId)=>{
 try {
       const data=await axios.get(`${process.env.CHAT_URI}/messages/${conversationId}`)
       return data.data
 } catch (error) {
       console.log(error)
       return null
 }
}
import api from "../utils/axios.js"
export const CreateOrder=async (plan)=>{
try {
     const response=await api.post("/api/billing/createOrder",{plan})
     return response.data
} catch (error) {
    console.log(error)
    return []
}
}
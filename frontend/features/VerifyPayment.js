import api from "../utils/axios.js"
export const VerifyPayment=async (payload)=>{
try {
     const response=await api.post("/api/billing/verifyPayment",payload)
     return response.data
} catch (error) {
    console.log(error)
    return []
}
}
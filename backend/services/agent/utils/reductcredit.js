import axios from "axios"
export const reductCredit=async (userId,agent)=>{
    try {
       const {data}=await axios.post(`${process.env.AUTH_URI}/reduct`,{userId,agent})
       return data
    } catch (error) {
        console.log(error)
        return null
    }
}

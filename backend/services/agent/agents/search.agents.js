import { tool } from "../config/tavily.js"
import { reductCredit } from "../utils/reductcredit.js";
import { checkAgentLimit } from "../config/checkLimit.js";
export const SearchAgent= async (state)=>{
try {
    await checkAgentLimit(state.userId,"search")
    const data=await tool.invoke({ query: state.prompt });
    await reductCredit(state.userId,"search")
    return{
        ...state,
        searchResponse:data,
        images:data.images
    }
} catch (error) {
   console.log(error);
       return{
        ...state,
        AImessage: error?.data?.message || "Failed to generate response!!!..",
        searchResponse:[],
        images:[]
    }
}  
}
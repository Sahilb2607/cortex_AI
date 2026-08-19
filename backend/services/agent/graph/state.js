import {Annotation} from "@langchain/langgraph"

export const State=Annotation.Root({
    prompt:Annotation(),
    AImessage:Annotation(),
    agent:Annotation(),
    conversationId:Annotation(),
    searchResponse:Annotation(),
    images:Annotation(),
    // images isiliye store kar rhe h taki ham usko frontend pe bheje
    Artifacts:Annotation(),
    userId:Annotation(),
    file:Annotation()
   
})
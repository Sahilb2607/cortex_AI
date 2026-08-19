import React from "react";
import Navbar from "./Navbar.jsx";
import Messagearea from "./Messagearea.jsx";
import Chatinput from "./Chatinput.jsx";
import { getmessages } from "../../features/getmessages.js";
import { clearMessages, get_messages, setArtifacts } from "../redux/messageSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function Chatarea() {
  const { selectedConv } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();
  useEffect(() => {
    const setmessages = async () => {
      dispatch(clearMessages())
      dispatch(setArtifacts([]));
      if (selectedConv?._id) {
        if(selectedConv.title=="New Chat") return;
        // matlab iske andar mssg nhi h kyunki jiske andar mssg h uska title 
        // upadete kar rhe h

        const response = await getmessages(selectedConv?._id);
        dispatch(get_messages(response));
        const latestArtifact=[...response].reverse().find(mssg=>mssg.Artifacts && mssg.Artifacts.length>0)
        dispatch(setArtifacts(latestArtifact.Artifacts || []))
      }
    };
    setmessages();
  }, [selectedConv?._id]);
 
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* 
      My prompt:-link will oveflowing means it was going beyond 
      screen but when we add min-e-0 in chatarea it got perfect how?
      By default, flex items in a flex container don’t shrink below their content size.

That means if you have a long word or link, the flex child refuses to shrink, and it overflows outside the container.

⚙️ What min-w-0 Does
min-w-0 sets:

css
min-width: 0;
This tells the flex item:
👉 “You are allowed to shrink smaller than your content if needed.” */}
      <Navbar />
      <Messagearea />
      <Chatinput />
    </div>
  );
}

export default Chatarea;

import React from "react";
import {
  PanelLeftIcon,
  PenSquare,
  Plus,
  MessageSquare,
  User,
  Coins,
  PanelRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversation } from "../../features/getConversation.js";
import { setConversation } from "../../features/setConversation.js";
import PaymentDrawer from "./PaymentDrawer.jsx";
import {
  get_Conversation,
  set_Conversation,
  setSelectedConversation,
} from "../redux/conversationSlice.js";
import { setUserdata } from "../redux/userSlice.js";
import { logout } from "../../features/logout.js";

function Sidebar() {
  const [hide, sethide] = useState(false);
  const dispatch = useDispatch();
  const [error, seterror] = useState(false);
  const [visible, setvisible] = useState(false);
  const [mobileOpen,setMobileOpen]=useState(false)
  const { conversation = [], selectedConv } = useSelector(
    (state) => state.conversation || { conversation: [], selectedConv: null },
  );
  const { userdata } = useSelector((state) => state.user || { userdata: null });
  //   in useSelector we write hte name of slice(or the name kept in store)
  // and in {} exact name of state inside it
  useEffect(() => {
    const getconv = async () => {
      const data = await getConversation();
      dispatch(get_Conversation(data));
    };
    getconv();
  }, [userdata?._id]);

  const setconv = async () => {
    const data = await setConversation();
    dispatch(set_Conversation(data));
  };
  if (hide) {
    return (
      <div className="flex h-screen w-14 flex-col items-center gap-2 border-r border-white/[0.06] bg-[#0d0f14] px-2 py-3">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
          onClick={() => sethide(false)}
        >
          <PanelRight size={17} />
        </button>
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
          onClick={() => dispatch(setSelectedConversation(null))}
        >
          <Plus size={17} />
        </button>

        <div className="mt-2 flex w-full flex-1 flex-col items-center gap-1 overflow-y-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(Array.isArray(conversation) ? conversation : []).map((conv, i) => {
            const isActive = selectedConv?._id == conv?._id;
            return (
              <div
                key={conv?._id || i}
                onClick={() => dispatch(setSelectedConversation(conv))}
                className={`flex items-center justify-center w-9 h-9 cursor-pointer rounded-[10px] border transition-colors duration-150 ${
                  isActive
                    ? "bg-indigo-500/10 border-indigo-500/[0.18] text-indigo-400"
                    : "bg-transparent border-transparent text-slate-500"
                }`}
              >
                <MessageSquare size={14} />
              </div>
            );
          })}
        </div>

        <div className="relative shrink-0">
          {userdata?.avatar && !error ? (
            <img
              className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
              src={userdata?.avatar}
              alt="image"
              onError={() => seterror(true)}
            />
          ) : (
            <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
              <User size={15} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <>
      <button 
      onClick={()=>setMobileOpen(true)}
      className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer">
        <Menu size={14} />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
      )}

      <div
        className={` fixed lg:static inset-y-0 left-0 z-50
w-[270px] h-screen shrink-0
bg-[#0d0f14] border-r border-white/[0.06]
transition-transform duration-250
${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
            <div
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500
          hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent
          border-none cursor-pointer"
              onClick={() => {
                sethide(true);
              }}
            >
              <PanelLeftIcon />
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500
hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent
border-none cursor-pointer"
            >
              <X/>
            </button>
            <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
              CortexAI
            </span>

            <span
              className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border
  border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide"
            >
              {userdata?.plan}
            </span>
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500
  hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent
  border-none cursor-pointer"
              onClick={() => dispatch(setSelectedConversation(null))}
            >
              <PenSquare size={15} />
            </button>
          </div>
          <div className="px-4 pt-4 pb-1">
            <button
              className="w-full flex items-center justify-center gap-2
    text-sm font-medium text-white bg-linear-to-br from-indigo-500
    to-violet-700 rounded-xl py-[10px] border-none cursor-pointer
    hover:opacity-90 transition-opacity duration-150"
              onClick={() => dispatch(setSelectedConversation(null))}
            >
              <Plus size={15} />
              New Chat
            </button>
          </div>
          {conversation.length == 0 ? (
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              NO RECENT CONVERSATIONS
            </div>
          ) : (
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              RECENT
            </div>
          )}
          <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {conversation.map((conv, i) => {
              const isActive = selectedConv?._id == conv?._id;
              return (
                <div
                  key={conv?._id}
                  //  Key is imp for react to identify elements
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
        ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]" : "bg-transparent border-transparent"}`}
                >
                  <div
                    className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150
  ${
    isActive
      ? "bg-indigo-500/15 text-indigo-400"
      : "bg-white/[0.05] text-slate-500"
  }`}
                  >
                    <MessageSquare size={13} />
                  </div>

                  <span
                    className={`text-[13px] font-medium truncate ${isActive ? "text-slate-100" : "text-slate-300"}`}
                  >
                    {conv?.title || "New Chat"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mx-2.5 h-px bg-white/[0.06]" />

          <div className="px-3.5 py-3.5">
            {userdata ? (
              <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150">
                <div className="relative shrink-0">
                  {userdata.avatar && !error ? (
                    <img
                      className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                      src={userdata?.avatar}
                      alt="image"
                      onError={() => seterror(true)}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                      <User size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-100 truncate">
                    {userdata?.name || "user"}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-px">
                    {userdata?.plan}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setvisible(true)}
                    className="flex items-center justify-center w-7 h-7 rounded-[7px]
  border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150"
                  >
                    <Coins size={16} />
                  </button>
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-[7px]
  border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150"
                    onClick={() => {
                      logout();
                      dispatch(setUserdata(null));
                    }}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="w-full flex items-center justify-center 
            gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] 
            border border-white/[0.08] rounded-xl py-[11px] cursor-pointer
             hover:bg-white/[0.08] transition-colors duration-150"
              >
                Login
              </button>
            )}
          </div>
        </div>
        
      </div>
      <PaymentDrawer
          open={visible}
          onClose={() => {
            setvisible(false);
          }}
        />
    </>
  );
}

export default Sidebar;

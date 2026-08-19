import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase.js";
import api from "../../utils/axios.js";
import { FcGoogle } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import { setUserdata } from "../redux/userSlice.js";
import Sidebar from "../components/sidebar.jsx";
import Chatarea from "../components/chatarea.jsx";
import Artifact from "../components/artifact.jsx";

const Home = () => {
  const { userdata } = useSelector((state) => state.user);
  // It means user slice ke andar userdata do
  // as one slice can conatin many types of data
  // so we are destructuring it to get the userData from the state.user which is the user slice
  const dispatch = useDispatch();

  const handleLogin = async (token) => {
    try {
      const data = await api.post("/api/auth/login", { token });
      dispatch(setUserdata(data.data));
      //   this we are doing to remove the popup immediately as
      // earlier the popup was going during refrsh only but here it iell go after login as well
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  const Google = async () => {
    const data = await signInWithPopup(auth, provider);
    const token = await data.user.getIdToken();
    console.log(token);
    await handleLogin(token);
    console.log(data);
  };
  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
      {!userdata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to CortexAI
              </h2>
              <p className="text-[13px] text-slate-500">
                Please login to continue using the app.
              </p>
              <button
                className="w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-violet-700 hover:from-indigo-400 hover:to-violet-600 active:from-indigo-600 active:to-violet-800 border border-indigo-500/30 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-150 cursor-pointer"
                onClick={Google}
              >
                <FcGoogle size={15} className="text-white" />
                Continue With Google
              </button>
            </div>
          </div>
        </div>
      )}
      <Sidebar />
      <Chatarea />
      <Artifact />
    </div>
  );
};

export default Home;

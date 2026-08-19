import React from 'react'
import getCurrentUser from "../features/getcurrentuser.js";
import { useEffect } from 'react';
import Home from './pages/Home.jsx';
import { useDispatch } from 'react-redux';
import { setUserdata } from './redux/userSlice.js';
function App() {
const dispatch = useDispatch();
useEffect(()=>{
  const getUser= async () => {
    const userData = await getCurrentUser();
    dispatch(setUserdata(userData))
}
getUser()
}, []);

  return (
<>
<Home/>
</>
  )
}

export default App

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userdata: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserdata: (state, action) => {
      state.userdata = action.payload
    }
  }
})

export const { setUserdata } = userSlice.actions
export default userSlice.reducer
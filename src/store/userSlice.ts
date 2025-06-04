import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  email: string | null;
  name: string | null;
}

const initialState: UserState = {
  email: null,
  name: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ email: string; name: string }>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    clearUser: (state) => {
      state.email = null;
      state.name = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

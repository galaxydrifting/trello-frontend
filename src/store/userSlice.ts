import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  token: string | null;
  email: string | null;
  name: string | null;
}

const initialState: UserState = {
  token: null,
  email: null,
  name: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ token: string; email: string; name: string }>) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    clearUser: (state) => {
      state.token = null;
      state.email = null;
      state.name = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

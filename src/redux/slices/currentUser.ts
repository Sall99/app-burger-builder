import { createSlice } from '@reduxjs/toolkit';

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: null,
    reducers: {
        setCurrentUser(state, action) {
            return action.payload;
        },
        clearCurrentUser(state) {
            return null;
        }
    }
});

export const { setCurrentUser, clearCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;

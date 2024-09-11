'use client';
import { RootState } from '../store';

const selectCurrentUser = (state: RootState) => state.rootReducer.currentUser;

export { selectCurrentUser };

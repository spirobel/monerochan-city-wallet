import { createSlice } from "@reduxjs/toolkit";

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState: {
        route: ["root"]
    },
    reducers: {
        navigate: (state, action) => {
            state.route.push(action.payload);
        }
    }
});
export const { navigate } = navigationSlice.actions;

export const selectCurrentPage = state => state.navigation.route[state.navigation.route.length - 1];

export default navigationSlice.reducer;
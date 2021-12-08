import { createSlice } from "@reduxjs/toolkit";

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState: {
        route: ["root"]
    },
    reducers: {
        navigate: (state, action) => {
            state.route += action.payload;
        }
    }
});
export const { navigate } = navigationSlice.actions;

export const selectCurrentPage = state => state.route[state.route.length - 1];

export default navigationSlice.reducer;
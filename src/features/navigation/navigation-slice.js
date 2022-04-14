import { createSlice } from "@reduxjs/toolkit";

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState: {
        route: [{ destination: "home" }]
    },
    reducers: {
        navigate: (state, action) => {
            let target = action.payload
            if (typeof (action.payload) === 'string') {
                target = { destination: action.payload }
            }
            state.route.push(target);
        },
        go_back: (state) => {
            state.route.pop()
        }
    }
});
export const { navigate, go_back } = navigationSlice.actions;

export const selectCurrentPage = state => state.navigation.route[state.navigation.route.length - 1];

export default navigationSlice.reducer;
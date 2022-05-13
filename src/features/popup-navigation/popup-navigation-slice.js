import { createSlice } from "@reduxjs/toolkit";

export const popupNavigationSlice = createSlice({
    name: 'popup_navigation',
    initialState: {
        route: [{ destination: "home" }]
    },
    reducers: {
        navigate_popup: (state, action) => {
            let target = action.payload
            if (typeof (action.payload) === 'string') {
                target = { destination: action.payload }
            }
            state.route.push(target);
        },
        go_back_popup: (state) => {
            state.route.pop()
        }
    }
});
export const { navigate_popup, go_back_popup } = popupNavigationSlice.actions;

export const selectCurrentPagePopup = state => state.popup_navigation.route[state.popup_navigation.route.length - 1];

export default popupNavigationSlice.reducer;
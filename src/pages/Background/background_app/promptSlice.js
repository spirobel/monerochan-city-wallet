import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tabId: null,
}

export const promptSlice = createSlice({
    name: 'prompt',
    initialState,
    reducers: {
        setPromptTabId: (state, action) => {
            state.tabId = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setPromptTabId } = promptSlice.actions

export default promptSlice.reducer
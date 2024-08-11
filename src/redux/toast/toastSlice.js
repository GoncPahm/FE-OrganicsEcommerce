import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    start: false,
    typeToast: "notifi",
    content: "",
};

export const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        startAction: (state) => {
            state.loading = true;
        },
        startToast: (state, action) => {
            state.start = true;
            state.typeToast = action.payload.typeToast;
            state.content = action.payload.content;
        },
        timeoOutToast: (state) => {
            state.loading = false;
            state.start = false;
            state.typeToast = "notifi";
            state.content = "";
        },
        closeToast: (state) => {
            state.loading = false;
            state.start = false;
            state.typeToast = "notifi";
            state.content = "";
        },
    },
});

export const { startAction, startToast, timeoOutToast, closeToast } = toastSlice.actions;

export default toastSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: "modal",
    initialState: {
      isOpen: false,
      content: null,
    },
    reducers: {
      openModal: (state, action) => {
        state.isOpen = true;
        state.content = action.payload;
      },
      closeModal: (state) => {
        state.isOpen = false;
        state.content = null;
      },
    },
  });
  
  export const { openModal, closeModal } = modalSlice.actions;
  export default modalSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WalletData = {
    address: string;
    hasNFT: boolean;
    wrongChain: boolean;
}

const initialState: WalletData = {
    address: "",
    hasNFT: false,
    wrongChain: false
}

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
        },

        setHasNFT: (state, action: PayloadAction<boolean>) => {
            state.hasNFT = action.payload;
        },
        setWrongChain: (state, action: PayloadAction<boolean>) => {
            state.wrongChain = action.payload;
        }

    }
})

export const  { setHasNFT, setAddress, setWrongChain } = walletSlice.actions;
export default walletSlice.reducer;
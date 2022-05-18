import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import walletReducer from './slices/walletSlice';

const persistWalletConfig = {
    key: "wallet",
    storage
}

const persistedWalletReducer = persistReducer(persistWalletConfig, walletReducer);

const store = configureStore({
    reducer: {
        wallet: persistedWalletReducer
    }
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
import { createReducer, on } from "@ngrx/store";
import { loadQbanks, loadQbanksSuccess, loadQbanksFailure,loadSelectedQbank,loadSelectedQbankSuccess,loadSelectedQbankFailure } from "./qbank.actions";
import { Qbank, FullQbank } from "../models/qbank.model";

export interface QbankState {
    qbanks: Qbank[];
    loading: boolean;
    error: any;
    selectedQbank: FullQbank | null;
    selectedLoading: boolean;
    selectedError: any;
}

export const initialState: QbankState = {
    qbanks: [],
    loading: false,
    error: null,
    selectedQbank: null,
    selectedLoading: false,
    selectedError: null
};

export const qbankReducer = createReducer(
    initialState,
    on(loadQbanks, (state) => ({ ...state, loading: true })),
    on(loadQbanksSuccess, (state, { qbanks }) => ({ ...state, qbanks, loading: false })),
    on(loadQbanksFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(loadSelectedQbank, (state) => ({ ...state, selectedLoading: true })),
    on(loadSelectedQbankSuccess, (state, { fullQbank }) => ({ ...state, selectedQbank: fullQbank, selectedLoading: false })),
    on(loadSelectedQbankFailure, (state, { error }) => ({ ...state, selectedError: error, selectedLoading: false }))
);

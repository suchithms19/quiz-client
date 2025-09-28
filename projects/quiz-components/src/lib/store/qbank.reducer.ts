import { createReducer, on } from "@ngrx/store";
import { loadQbanks, loadQbanksSuccess, loadQbanksFailure } from "./qbank.actions";
import { Qbank } from "../models/qbank.model";

export interface QbankState {
    qbanks: Qbank[];
    loading: boolean;
    error: any;
}

export const initialState: QbankState = {
    qbanks: [],
    loading: false,
    error: null
};

export const qbankReducer = createReducer(
    initialState,
    on(loadQbanks, (state) => ({ ...state, loading: true })),
    on(loadQbanksSuccess, (state, { qbanks }) => ({ ...state, qbanks, loading: false })),
    on(loadQbanksFailure, (state, { error }) => ({ ...state, error, loading: false }))
);

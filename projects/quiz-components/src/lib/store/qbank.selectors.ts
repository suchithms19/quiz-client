import { QbankState } from "./qbank.reducer";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const selectQbankState = createFeatureSelector<QbankState>('qbank');  
export const selectQbanks = createSelector(selectQbankState, (state) => state.qbanks);
export const selectQbankLoading = createSelector(selectQbankState, (state) => state.loading);
export const selectQbankError = createSelector(selectQbankState, (state) => state.error);

export const selectSelectedQbank = createSelector(selectQbankState, (state) => state.selectedQbank);
export const selectSelectedQbankLoading = createSelector(selectQbankState, (state) => state.selectedLoading);
export const selectSelectedQbankError = createSelector(selectQbankState, (state) => state.selectedError);

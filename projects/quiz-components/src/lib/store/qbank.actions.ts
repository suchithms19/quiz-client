import { createAction, props } from "@ngrx/store";
import { Qbank, FullQbank } from "../models/qbank.model";

export const loadQbanks = createAction(
    '[Qbank] Load Qbanks'
);

export const loadQbanksSuccess = createAction(
    '[Qbank] Load Qbanks Success', 
    props<{ qbanks: Qbank[] }>()
);

export const loadQbanksFailure = createAction(
    '[Qbank] Load Qbanks Failure',
    props<{ error: string }>()
);
export const loadSelectedQbank = createAction(
    '[Qbank] Load Selected Qbank',
    props<{ qbankId: string }>()
    
);
export const loadSelectedQbankSuccess = createAction(
    '[Qbank] Load Selected Qbank Success',
    props<{ fullQbank: FullQbank }>()
);
export const loadSelectedQbankFailure = createAction(
    '[Qbank] Load Selected Qbank Failure',
    props<{ error: string }>()
);
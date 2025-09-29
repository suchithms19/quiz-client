import { createReducer, on } from "@ngrx/store";
import { loadQbanks, loadQbanksSuccess, loadQbanksFailure } from "./qbank.actions";
import { Qbank } from "../models/qbank.model";
import { 
    loadQbankById,
    loadQbankByIdSuccess,
    loadQbankByIdFailure,
    updateQbank,
    updateQbankSuccess,
    updateQbankFailure,
    clearCurrentQbank
} from "./qbank.actions";
import { QbankWithQuestions } from "../models/qbank.model";

export interface QbankState {
    qbanks: Qbank[];
    currentQbank: QbankWithQuestions | null; 
    loading: boolean;
    currentQbankLoading: boolean; 
    error: any;
}

export const initialState: QbankState = {
    qbanks: [],
    currentQbank: null,
    loading: false,
    error: null,
    currentQbankLoading: false,
};

export const qbankReducer = createReducer(
    initialState,
    
    on(loadQbanks, (state) => ({ ...state, loading: true, error: null })),
    on(loadQbanksSuccess, (state, { qbanks }) => ({ ...state, qbanks, loading: false })),
    on(loadQbanksFailure, (state, { error }) => ({ ...state, error, loading: false })),
    
    // Load Qbank by ID actions
    on(loadQbankById, (state) => ({ ...state, currentQbankLoading: true, error: null })),
    on(loadQbankByIdSuccess, (state, { qbank }) => ({ 
        ...state, 
        currentQbank: qbank, 
        currentQbankLoading: false 
    })),
    on(loadQbankByIdFailure, (state, { error }) => ({ 
        ...state, 
        error, 
        currentQbankLoading: false 
    })),
    
    
    on(updateQbank, (state) => ({ ...state, currentQbankLoading: false, error: null })),
    on(updateQbankSuccess, (state, { qbank }) => ({ 
        ...state, 
        currentQbankLoading: false,
        
        qbanks: state.qbanks.map(q => q._id === qbank.id ? { ...q, ...qbank } : q)
    })),
    on(updateQbankFailure, (state, { error }) => ({ 
        ...state, 
        error, 
        currentQbankLoading: false 
    })),
    
    
    on(clearCurrentQbank, (state) => ({ ...state, currentQbank: null }))
);

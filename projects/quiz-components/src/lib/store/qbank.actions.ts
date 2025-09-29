import { createAction, props } from "@ngrx/store";
import { Qbank, QbankWithQuestions } from "../models/qbank.model";
import { BackendQuizData, QuizResponse } from "../models/quiz.model";

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
export const loadQbankById = createAction(
    '[Qbank] Load Qbank By ID',
    props<{ qbankId: string }>()
);

export const loadQbankByIdSuccess = createAction(
    '[Qbank] Load Qbank By ID Success',
    props<{ qbank: QbankWithQuestions }>()
);

export const loadQbankByIdFailure = createAction(
    '[Qbank] Load Qbank By ID Failure',
    props<{ error: string }>()
);

export const updateQbank = createAction(
    '[Qbank] Update Qbank',
    props<{ qbankId: string; quizData: BackendQuizData }>()
);

export const updateQbankSuccess = createAction(
    '[Qbank] Update Qbank Success',
    props<{ qbank: QuizResponse }>()
);

export const updateQbankFailure = createAction(
    '[Qbank] Update Qbank Failure',
    props<{ error: string }>()
);

export const clearCurrentQbank = createAction(
    '[Qbank] Clear Current Qbank'
);

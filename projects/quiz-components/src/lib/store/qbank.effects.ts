import { createEffect, ofType, Actions } from "@ngrx/effects";
import { catchError, map, mergeMap } from "rxjs/operators";
import { loadQbanks, loadQbanksSuccess, loadQbanksFailure,loadSelectedQbank,loadSelectedQbankSuccess,loadSelectedQbankFailure } from "./qbank.actions";
import { Qbank, FullQbank } from "../models/qbank.model";
import { 
    loadQbankById,
    loadQbankByIdSuccess,
    loadQbankByIdFailure,
    updateQbank,
    updateQbankSuccess,
    updateQbankFailure
} from "./qbank.actions";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { Injectable, inject } from "@angular/core";
import { QuizService } from "../services/quiz.service";

@Injectable()
export class QbankEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);
    private quizService = inject(QuizService);

    loadQbanks$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadQbanks),
            mergeMap(() =>
              this.http.get<Qbank[]>('https://quiz-server-39z8.onrender.com/api/qbanks').pipe(
                map((qbanks) => loadQbanksSuccess({ qbanks })),
                catchError((error) => of(loadQbanksFailure({ error })))
              )
            )
          )
        );
        loadSelectedQbank$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadSelectedQbank),
            mergeMap(({ qbankId }) =>
              this.http.get<FullQbank>(`https://quiz-server-39z8.onrender.com/api/qbanks/${qbankId}`).pipe(
                map((fullQbank) => loadSelectedQbankSuccess({ fullQbank })),
                catchError((error) => of(loadSelectedQbankFailure({ error })))
              )
            )
          )
        );      

    loadQbankById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadQbankById),
            mergeMap(({ qbankId }) =>
                this.quizService.getQbankById(qbankId).pipe(
                    map((qbank) => loadQbankByIdSuccess({ qbank })),
                    catchError((error) => of(loadQbankByIdFailure({ error: error.message })))
                )
            )
        )
    );

    updateQbank$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateQbank),
            mergeMap(({ qbankId, quizData }) =>
                this.quizService.updateQuizBank(qbankId, quizData).pipe(
                    map((qbank) => updateQbankSuccess({ qbank })),
                    catchError((error) => of(updateQbankFailure({ error: error.message })))
                )
            )
        )
    );
}

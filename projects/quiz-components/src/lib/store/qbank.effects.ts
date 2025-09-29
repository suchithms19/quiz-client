import { createEffect, ofType, Actions } from "@ngrx/effects";
import { catchError, map, mergeMap } from "rxjs/operators";
import { loadQbanks, loadQbanksSuccess, loadQbanksFailure,loadSelectedQbank,loadSelectedQbankSuccess,loadSelectedQbankFailure } from "./qbank.actions";
import { Qbank, FullQbank } from "../models/qbank.model";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { Injectable, inject } from "@angular/core";

@Injectable()
export class QbankEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);

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
}

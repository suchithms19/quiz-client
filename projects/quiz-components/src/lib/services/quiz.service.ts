import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment.prod';
import { BackendQuizData, QuizResponse, ApiError } from '../models/quiz.model';
import { QbankWithQuestions } from '../models/qbank.model';
import { AnalyticsData } from '../models/analytics.model';


@Injectable({
    providedIn: 'root'
})

export class QuizService {
    private readonly apiUrl = environment.API_URL;

    constructor(private http: HttpClient) { }

    createQuizBank(quizData: BackendQuizData): Observable<QuizResponse> {
        return this.http.post<QuizResponse>(
            `${this.apiUrl}/createQbanks`,
            quizData
        ).pipe(
            catchError(this.handleError)
        );
    }

    getQbankById(qbankId: string): Observable<QbankWithQuestions> {
        return this.http.get<QbankWithQuestions>(
            `${this.apiUrl}/qbanks/${qbankId}`
        ).pipe(
            catchError(this.handleError)
        );
    }

    updateQuizBank(qbankId: string, quizData: BackendQuizData): Observable<QuizResponse> {
        return this.http.put<QuizResponse>(
            `${this.apiUrl}/qbanks/${qbankId}`,
            quizData
        ).pipe(
            catchError(this.handleError)
        );
    }

    getAnalytics(): Observable<AnalyticsData> {
        return this.http.get<AnalyticsData>(
            `${this.apiUrl}/analytics`
        ).pipe(
            catchError(this.handleError)
        );
    }

    private handleError = (error: HttpErrorResponse): Observable<never> => {

        const apiError: ApiError = error.error || {};
        let errorMessage = 'An unexpected error occurred. Please try again.';

        if (apiError.error) {
            errorMessage = apiError.error;
        } else if (apiError.errors && apiError.errors.length > 0) {
            const firstError = apiError.errors[0];
            errorMessage = `${firstError.field}: ${firstError.message}`;
        } else if (error.status === 0) {
            errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (error.status >= 500) {
            errorMessage = 'Server error occurred. Please try again later.';
        } else if (error.status === 404) {
            errorMessage = 'The requested resource was not found.';
        }

        return throwError(() => new Error(errorMessage));
    };
}

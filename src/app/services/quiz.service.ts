import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BackendQuizData, QuizResponse, ApiError } from '../types/quiz.types';


@Injectable({
    providedIn: 'root'
})

export class QuizService {
    private readonly api_url = environment.API_URL;

    constructor(private http: HttpClient) { }

    create_quiz_bank(quiz_data: BackendQuizData): Observable<QuizResponse> {
        return this.http.post<QuizResponse>(
            `${this.api_url}/createQbanks`,
            quiz_data
        ).pipe(
            catchError(this.handle_error)
        );
    }

    private handle_error = (error: HttpErrorResponse): Observable<never> => {
        console.error('Quiz Service Error:', error);

        const api_error: ApiError = error.error || {};
        let error_message = 'An unexpected error occurred. Please try again.';

        if (api_error.error) {
            error_message = api_error.error;
        } else if (api_error.errors && api_error.errors.length > 0) {
            const first_error = api_error.errors[0];
            error_message = `${first_error.field}: ${first_error.message}`;
        } else if (error.status === 0) {
            error_message = 'Unable to connect to server. Please check your internet connection.';
        } else if (error.status >= 500) {
            error_message = 'Server error occurred. Please try again later.';
        } else if (error.status === 404) {
            error_message = 'The requested resource was not found.';
        }

        return throwError(() => new Error(error_message));
    };
}

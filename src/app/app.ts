import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header, Navbar, QuizStoreInterface } from 'quiz-components';
import { QuizStoreService } from './services/quiz-store.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Navbar],
  providers: [
    { provide: QuizStoreInterface, useClass: QuizStoreService }
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('quiz-client');
}

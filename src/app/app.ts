import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header, Navbar } from 'quiz-components';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Navbar],
  providers: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('quiz-client');
}

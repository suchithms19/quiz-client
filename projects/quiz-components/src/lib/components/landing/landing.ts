import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { QuizService } from '../../services/quiz.service';
import { AnalyticsData } from '../../models/analytics.model';

@Component({
  selector: 'qc-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit {
  analytics$: Observable<AnalyticsData> | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  private loadAnalytics(): void {
    this.isLoading = true;
    this.error = null;
    
    this.analytics$ = this.quizService.getAnalytics();
    
    this.analytics$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.message || 'Failed to load analytics data';
      }
    });
  }

  refreshAnalytics(): void {
    this.loadAnalytics();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { QbankState } from '../../store';
import { selectCurrentQbank, selectCurrentQbankLoading, selectQbankError } from '../../store/qbank.selectors';
import { loadQbankById } from '../../store/qbank.actions';
import { QbankWithQuestions } from '../../models/qbank.model';

@Component({
  selector: 'qc-view-qbank-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './view-qbank-details.html',
  styleUrls: ['./view-qbank-details.scss']
})
export class ViewQbankDetails implements OnInit {
  qbank$: Observable<QbankWithQuestions | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(
    private store: Store<{ qbank: QbankState }>,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.qbank$ = this.store.select(selectCurrentQbank);
    this.loading$ = this.store.select(selectCurrentQbankLoading);
    this.error$ = this.store.select(selectQbankError);
  }

  ngOnInit(): void {
    const qbankId = this.route.snapshot.paramMap.get('id');
    if (qbankId) {
      this.store.dispatch(loadQbankById({ qbankId }));
    }
  }

  on_back(): void {
    this.location.back();
  }
}
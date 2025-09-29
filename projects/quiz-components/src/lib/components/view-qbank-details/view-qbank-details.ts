import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { QbankState } from '../../store';
import { selectSelectedQbank, selectSelectedQbankLoading, selectSelectedQbankError } from '../../store/qbank.selectors';
import { loadSelectedQbank } from '../../store/qbank.actions';
import { FullQbank } from '../../models/qbank.model';

@Component({
  selector: 'qc-view-qbank-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './view-qbank-details.html',
  styleUrls: ['./view-qbank-details.scss']
})
export class ViewQbankDetails implements OnInit {
  qbank$: Observable<FullQbank | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(
    private store: Store<{ qbank: QbankState }>,
    private route: ActivatedRoute
  ) {
    this.qbank$ = this.store.select(selectSelectedQbank);
    this.loading$ = this.store.select(selectSelectedQbankLoading);
    this.error$ = this.store.select(selectSelectedQbankError);
  }

  ngOnInit(): void {
    const qbankId = this.route.snapshot.paramMap.get('id');
    if (qbankId) {
      this.store.dispatch(loadSelectedQbank({ qbankId }));
    }
  }
}
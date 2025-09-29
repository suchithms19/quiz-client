import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { QbankState } from '../../store';
import { selectQbankError, selectQbankLoading, selectQbanks } from '../../store/qbank.selectors';
import { Store } from '@ngrx/store';
import { loadQbanks } from '../../store/qbank.actions';
import { Qbank } from '../../models/qbank.model';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'qc-view-qbanks',
  standalone: true,
  imports: [CommonModule, MatTabsModule, DatePipe],
  templateUrl: './view-qbanks.html',
  styleUrl: './view-qbanks.scss'
})
export class ViewQbanks implements OnInit {
  qbanks$: Observable<Qbank[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  activeTab: 'active' | 'inactive' = 'active';

  constructor(
    private store: Store<{ qbank: QbankState }>,
    private router: Router
  ) {
    this.qbanks$ = this.store.select(selectQbanks);
    this.loading$ = this.store.select(selectQbankLoading);
    this.error$ = this.store.select(selectQbankError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadQbanks());
  }
  
  setTab(tab: 'active' | 'inactive'): void {
    this.activeTab = tab;
  }

  onModifyQbank(qbank: Qbank): void {
    this.router.navigate(['/create-qbank'], {
      queryParams: {
        mode: 'edit',
        id: qbank._id
      }
    });
  }
}

import { Component, ChangeDetectionStrategy, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router }                                                                from '@angular/router';

import { AuthModelService }                                                      from './auth';
import { TransferState }                                                         from '../modules/transfer-state'


@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'root',
  //styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    public _auth: AuthModelService,
    public _router: Router,
    private _tcache: TransferState
  ){}

  ngOnInit() {
    this._tcache.set('cached', true);
    this._auth.initAuth();
  }

}

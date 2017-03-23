import { Subscription }                                                     from 'rxjs/Subscription'

import { Component, ChangeDetectionStrategy, OnDestroy, ViewEncapsulation } from '@angular/core'
import { Router }                                                           from '@angular/router'

import { AuthModelService, AuthUser }                                       from '../../../auth'
import { Dropdown, DropdownToggle }                                         from '../../'


@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'main-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class MainNavComponent implements OnDestroy {

  public authUser: AuthUser = null;

  private authUserSubscription: Subscription;

  constructor(
    public _auth: AuthModelService,
    private _router: Router
  ) {
    this.authUserSubscription = this._auth.current$.subscribe(user => this.authUser = user);
  }

  ngOnDestroy(): void {
    this.authUserSubscription.unsubscribe();
  }

  isAuthenticated() {
    return this.authUser && this.authUser != null;
  }

  logout() {
    this._auth.logout();
    this._router.navigate(['/login']);
  }

}
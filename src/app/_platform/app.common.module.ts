import '../shared/lib/rxjs-operators'

import { NgModule }            from '@angular/core'
import { HttpModule }          from '@angular/http'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { RouterModule }        from '@angular/router'

import { AppModule }           from '../'
import { SharedModule }        from '../shared'
import {BrowserModule} from "@angular/platform-browser";


@NgModule({
	imports: [
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot([], { useHash: false }),
    SharedModule.forRoot(),
    AppModule,
    FormsModule,
    BrowserModule
	]
})
export class CommonAppModule {}

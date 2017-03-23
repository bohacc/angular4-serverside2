import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import {Home} from "./home/home.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '',
        component: Home,
      },
      {
        path: ':code',
        component: Home,
      },
      { path: ':code/search/:searchStr', component: Home },
      { path: ':code/konfigurator/:redirect', component: Home },
      { path: ':code/konfigurator2/:redirect', component: Home },
    ])
  ],
})
export class AppRoutingModule {}

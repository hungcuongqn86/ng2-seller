import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {StorefrontsComponent} from './storefronts.component';
import {DetailComponent} from './detail.component';

const routes: Routes = [
  {path: '', component: StorefrontsComponent},
  {path: 'add', component: DetailComponent},
  {path: ':id', component: DetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule]
})

export class StorefrontsRoutingModule {
  constructor() {
  }
}

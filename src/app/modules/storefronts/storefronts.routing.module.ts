import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {StorefrontsComponent} from './storefronts.component';

const routes: Routes = [
    {path: '', component: StorefrontsComponent}
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

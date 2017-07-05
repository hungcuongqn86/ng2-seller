import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CampaignsComponent} from './campaigns.component';
import {DetailComponent} from './detail.component';

const routes: Routes = [
    {path: '', component: CampaignsComponent},
    {path: ':id', component: DetailComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [],
    exports: [RouterModule]
})

export class CampaignsRoutingModule {
    constructor() {
    }
}

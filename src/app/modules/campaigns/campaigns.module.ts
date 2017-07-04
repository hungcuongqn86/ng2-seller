import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {CampaignsComponent} from './campaigns.component';
import {CampaignsRoutingModule} from './campaigns.routing.module';

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, CampaignsRoutingModule],
    declarations: [
        CampaignsComponent,
    ],
    exports: [],
    providers: []
})
export class CampaignsModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {CampaignsService} from './campaigns.service';
import {CampaignsComponent} from './campaigns.component';
import {CampaignsRoutingModule} from './campaigns.routing.module';

import {CampaignDirective} from '../../directive/campaign.directive';

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, CampaignsRoutingModule],
    declarations: [
        CampaignsComponent,
        CampaignDirective
    ],
    exports: [],
    providers: [CampaignsService]
})
export class CampaignsModule {
}

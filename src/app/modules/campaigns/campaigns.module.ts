import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {QuillModule} from 'ngx-quill';
import {Select2Module} from 'ng2-select2';

import {CampaignsService} from './campaigns.service';
import {CampaignsComponent} from './campaigns.component';
import {DetailComponent} from './detail.component';
import {EditComponent} from './detail/edit.component';
import {CampaignsRoutingModule} from './campaigns.routing.module';

import {CampaignDirective} from '../../directive/campaign.directive';
import {CountLeftDirective} from '../../directive/countLeft.directive';

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, CampaignsRoutingModule, QuillModule, Select2Module],
    declarations: [
        CampaignsComponent,
        DetailComponent,
        EditComponent,
        CampaignDirective,
        CountLeftDirective
    ],
    exports: [],
    providers: [
        CampaignsService
    ]
})
export class CampaignsModule {
}

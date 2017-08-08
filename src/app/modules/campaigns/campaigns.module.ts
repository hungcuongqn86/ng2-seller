import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {QuillModule} from 'ngx-quill';
import {Select2Module} from 'ng2-select2';
import {Ng2PaginationModule} from 'ng2-pagination';
import {JWBootstrapSwitchModule} from 'jw-bootstrap-switch-ng2';

import {CampaignsService} from './campaigns.service';
import {UploadService} from '../../public/upload.service';
import {CampaignsComponent} from './campaigns.component';
import {DetailComponent} from './detail.component';
import {EditComponent} from './detail/edit.component';
import {ProductsComponent} from './detail/products.component';
import {MockupsComponent} from './detail/mockups.component';
import {CampaignsRoutingModule} from './campaigns.routing.module';

import {CampaignDirective} from '../../directive/campaign.directive';
import {CountLeftDirective} from '../../directive/countLeft.directive';
import {SharedModule} from '../../public/shared.module';

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, CampaignsRoutingModule, SharedModule, QuillModule,
        Select2Module, Ng2PaginationModule, JWBootstrapSwitchModule],
    declarations: [
        CampaignsComponent,
        DetailComponent,
        EditComponent,
        ProductsComponent,
        MockupsComponent,
        CampaignDirective,
        CountLeftDirective
    ],
    exports: [],
    providers: [
        CampaignsService,
        UploadService
    ]
})
export class CampaignsModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {QuillModule} from 'ngx-quill';
import {Ng2PaginationModule} from 'ng2-pagination';
import {TooltipModule} from 'ng2-tooltip';

import {StorefrontsService} from './storefronts.service';
import {UploadService} from '../../public/upload.service';
import {StorefrontsComponent} from './storefronts.component';
import {DetailComponent} from './detail.component';
import {StorefrontsRoutingModule} from './storefronts.routing.module';
import {SharedModule} from '../../public/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, HttpModule, StorefrontsRoutingModule, QuillModule, Ng2PaginationModule, SharedModule, TooltipModule],
  declarations: [
    StorefrontsComponent,
    DetailComponent
  ],
  exports: [],
  providers: [StorefrontsService, UploadService]
})
export class StorefrontsModule {
}

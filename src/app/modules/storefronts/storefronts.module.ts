import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {StorefrontsComponent} from './storefronts.component';
import {StorefrontsRoutingModule} from './storefronts.routing.module';

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, StorefrontsRoutingModule],
    declarations: [
        StorefrontsComponent,
    ],
    exports: [],
    providers: []
})
export class StorefrontsModule {
}

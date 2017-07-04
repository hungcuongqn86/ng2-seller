import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {PromotionsComponent} from './promotions.component';
import {PromotionsRoutingModule} from './promotions.routing.module';

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, PromotionsRoutingModule],
    declarations: [
        PromotionsComponent,
    ],
    exports: [],
    providers: []
})
export class PromotionsModule {
}

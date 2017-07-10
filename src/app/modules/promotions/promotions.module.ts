import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {JWBootstrapSwitchModule} from 'jw-bootstrap-switch-ng2';
import {Ng2PaginationModule} from 'ng2-pagination';

import {DebounceDirective} from '../../directive/debounce.directive';

import {PromotionsComponent} from './promotions.component';
import {PromotionsRoutingModule} from './promotions.routing.module';
import {PromotionsService} from './promotions.service';

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, PromotionsRoutingModule, JWBootstrapSwitchModule, Ng2PaginationModule],
    declarations: [
        PromotionsComponent,
        DebounceDirective
    ],
    exports: [],
    providers: [PromotionsService]
})
export class PromotionsModule {
}

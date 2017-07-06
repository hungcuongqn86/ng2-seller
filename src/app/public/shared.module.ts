import {NgModule, ModuleWithProviders} from '@angular/core';
import {ProductDirective} from '../directive/product.directive';
import {ColorDirective} from '../directive/color.directive';
@NgModule({
    imports: [],
    declarations: [ProductDirective, ColorDirective],
    exports: [ProductDirective, ColorDirective],
    providers: []
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }

    constructor() {

    }
}

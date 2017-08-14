import {NgModule, ModuleWithProviders} from '@angular/core';
import {ProductDirective} from '../directive/product.directive';
import {ColorDirective} from '../directive/color.directive';
import {CountLeftDirective} from '../directive/countLeft.directive';
import {DebounceDirective} from '../directive/debounce.directive';
import {CampaignDirective} from '../directive/campaign.directive';

@NgModule({
  imports: [],
  declarations: [ProductDirective, ColorDirective, CountLeftDirective, DebounceDirective, CampaignDirective],
  exports: [ProductDirective, ColorDirective, CountLeftDirective, DebounceDirective, CampaignDirective],
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

import {ModuleWithProviders, NgModule} from '@angular/core';
import {ProductDirective} from '../directive/product.directive';
import {DebounceDirective} from '../directive/debounce.directive';
import {CampaignDirective} from '../directive/campaign.directive';
import {CharLeftDirective} from 'charactersleft';

@NgModule({
  imports: [],
  declarations: [ProductDirective, DebounceDirective, CampaignDirective, CharLeftDirective],
  exports: [ProductDirective, DebounceDirective, CampaignDirective, CharLeftDirective],
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

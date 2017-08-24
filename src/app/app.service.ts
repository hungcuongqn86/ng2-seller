import {Injectable} from '@angular/core';

@Injectable()
export class AppService {
  public svConfig = {
    'system.ecomerce.domain.name': null,
    'system.manage.domain.name': null,
    'campaign.detail.uri.prefix': null,
    'store.detail.uri.prefix': null,
    'product.fulfillment.location': null,
    'product.two.sides.printing.price': null,
    'product.one.side.printing.price': null
  };

  constructor() {
  }

  public addCampaign() {
    const url = 'http://' + this.svConfig['system.manage.domain.name'];
    window.open(url, '_blank');
  }
}

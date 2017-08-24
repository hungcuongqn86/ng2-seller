import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorefrontsService} from './storefronts.service';
import {store_states} from '../../lib/const';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-storefronts',
  templateUrl: './storefronts.component.html',
  styleUrls: ['./storefronts.component.css']
})

export class StorefrontsComponent implements OnInit {
  private subs: any;
  public StorefrontsData: any = {};
  public states = store_states;
  public stateName = '';

  constructor(public StorefrontsService: StorefrontsService, private router: Router, private AppService: AppService) {

  }

  ngOnInit() {
    for (const item of this.states) {
      if (item.id === this.StorefrontsService.search.state) {
        this.stateName = item.name;
        break;
      }
    }
    this.getStorefronts();
  }

  public getStorefronts() {
    this.StorefrontsService.http.startLoad();
    this.subs = this.StorefrontsService.getStorefronts(this.StorefrontsService.search).subscribe(
      data => {
        this.StorefrontsData = data;
        this.StorefrontsService.http.endLoad();
      },
      error => {
        this.StorefrontsService.http.endLoad();
      }
    );
  }

  public selState(state) {
    this.stateName = state.name;
    this.StorefrontsService.search.state = state.id;
    this.getStorefronts();
  }

  public goDetail = store => this.router.navigate([`/storefronts/${store.id}`]);
  public addStorefront = () => this.router.navigate([`/storefronts/add`]);
  public genStoreDetailUrl = uri => 'http://' + this.AppService.svConfig['system.ecomerce.domain.name']
    + this.AppService.svConfig['store.detail.uri.prefix'] + '/' + uri.split('/').join('');
  public goView = store => window.open(this.genStoreDetailUrl(store.url), '_blank');
}

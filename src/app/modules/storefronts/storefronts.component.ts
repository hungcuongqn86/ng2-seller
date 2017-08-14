import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorefrontsService} from './storefronts.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-storefronts',
  templateUrl: './storefronts.component.html',
  styleUrls: ['./storefronts.component.css']
})

export class StorefrontsComponent implements OnInit {
  private subs: any;
  public StorefrontsData: any = {};

  constructor(public StorefrontsService: StorefrontsService, private router: Router) {

  }

  ngOnInit() {
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

  public goDetail(store) {
    this.router.navigate([`/storefronts/${store.id}`]);
  }

  public addStorefront() {
    this.router.navigate([`/storefronts/add`]);
  }
}

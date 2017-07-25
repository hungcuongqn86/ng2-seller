import {Component, OnInit, OnDestroy} from '@angular/core';
import {CampaignsService} from '../campaigns.service';
import {ColorComponent} from '../../../public/color.component';
import {ConfirmComponent} from '../../../public/confirm.component';
import {AddproductComponent} from '../../../public/addproduct.component';
import {Observable} from 'rxjs/Rx';
import {Ds} from '../../../lib/ds';

@Component({
    selector: 'app-campaign-detail-mockups',
    templateUrl: './mockups.component.html',
    styleUrls: ['./mockups.component.css']
})

export class MockupsComponent implements OnInit, OnDestroy {
    public face = 'front';
    private subs: any;
    private DialogSubs: any;
    public product: any = {base: {name: ''}};

    constructor(public CampaignsService: CampaignsService) {
    }

    ngOnInit() {
        if (!this.product.id) {
            this.setProduct(this.CampaignsService.campaign.products[0]);
        }
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }

    public setProduct(item) {
        this.product = item;
        console.log(item);
    }
}

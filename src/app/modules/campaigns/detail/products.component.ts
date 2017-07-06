import {Component, Input, ViewChild, OnInit} from '@angular/core';
import {CampaignsService} from '../campaigns.service';
import {Observable} from 'rxjs/Rx';
import {DsLib} from '../../../lib/lib';

@Component({
    selector: 'app-campaign-detail-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
    @Input('campaign')
    public campaign: any;
    public mainOpt = [];
    public face = 'front';

    constructor(private CampaignsService: CampaignsService) {
    }

    ngOnInit() {
        this.mainOpt = this.getMainOpt();
        this.face = this.getFace();
    }

    private getMainOpt(): any {
        for (let index = 0; index < this.campaign.products.length; index++) {
            const check = this.campaign.products[index].designs.findIndex(x => x.main === true);
            if (check >= 0) {
                return DsLib.getOpt(this.campaign.products[index], this.face);
            }
        }
        return [];
    }

    private getFace(): any {
        const check = this.campaign.products.findIndex(x => x.default === true);
        if (check >= 0) {
            if (this.campaign.products[check].back_view) {
                return 'back';
            }
        }
        return 'front';
    }
}

import {Component, OnInit} from '@angular/core';
import {CampaignsService} from './campaigns.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-campaigns',
    templateUrl: './campaigns.component.html',
    styleUrls: ['./campaigns.component.css']
})

export class CampaignsComponent implements OnInit {
    public CampaignData: any = {};

    constructor(private CampaignsService: CampaignsService) {

    }

    ngOnInit() {
        this.getCampaigns();
    }

    getCampaigns() {
        this.CampaignsService.getCampaigns('launching').subscribe(
            data => {
                this.CampaignData = data;
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }
}

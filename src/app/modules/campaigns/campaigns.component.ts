import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CampaignsService} from './campaigns.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-campaigns',
    templateUrl: './campaigns.component.html',
    styleUrls: ['./campaigns.component.css']
})

export class CampaignsComponent implements OnInit {
    public CampaignData: any = {};

    constructor(private CampaignsService: CampaignsService, private router: Router) {

    }

    ngOnInit() {
        this.getCampaigns();
    }

    getCampaigns() {
        this.CampaignsService.http.startLoad();
        this.CampaignsService.getCampaigns('launching').subscribe(
            data => {
                this.CampaignData = data;
                this.CampaignsService.http.endLoad();
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    goDetail(camp) {
        this.router.navigate([`/campaigns/${camp.id}`]);
    }
}

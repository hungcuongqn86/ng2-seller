import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CampaignsService} from './campaigns.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-campaign-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit {
    private CampaignId;
    public CampaignData: any;
    private sub: any;

    constructor(private CampaignsService: CampaignsService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.CampaignId = params['id'];
        });
        this.getCampaign();
    }

    getCampaign() {
        this.CampaignsService.http.startLoad();
        this.CampaignsService.getCampaign(this.CampaignId).subscribe(
            data => {
                console.log(data.desc);
                // data.desc = decodeURIComponent(decodeURIComponent(data.desc));
                this.CampaignData = data;
                this.CampaignsService.http.endLoad();
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }
}

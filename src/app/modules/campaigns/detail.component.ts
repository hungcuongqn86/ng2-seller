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
    public tab = 'detail';
    private sub: any;

    constructor(private CampaignsService: CampaignsService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.CampaignId = params['id'];
        });
        this.getCampaign();
    }

    private getCampaign() {
        this.CampaignsService.http.startLoad();
        this.CampaignsService.getCampaign(this.CampaignId).subscribe(
            data => {
                data.desc = decodeURIComponent(data.desc);
                data.desc = data.desc.split('%20').join(' ');
                this.CampaignData = data;
                this.CampaignsService.http.endLoad();
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    public selectTab(tab) {
        this.tab = tab;
    }
}

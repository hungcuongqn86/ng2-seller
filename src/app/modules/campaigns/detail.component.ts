import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CampaignsService} from './campaigns.service';

@Component({
    selector: 'app-campaign-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit, OnDestroy {
    private CampaignId;
    public tab = 'detail';
    private subs: any;

    constructor(public CampaignsService: CampaignsService, private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.CampaignId = params['id'];
        });
        this.getBaseTypes();
        this.getCampaign();
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }

    private getCampaign() {
        this.CampaignsService.http.startLoad();
        this.subs = this.CampaignsService.getCampaign(this.CampaignId).subscribe(
            data => {
                data.desc = decodeURIComponent(data.desc);
                data.desc = data.desc.split('%20').join(' ');
                this.CampaignsService.campaign = data;
                this.CampaignsService.http.endLoad();
            },
            error => {
                this.subs.unsubscribe();
            }
        );
    }

    public selectTab(tab) {
        this.tab = tab;
    }

    private getBaseTypes() {
        const sub = this.CampaignsService.getBaseTypes().subscribe(
            data => {
                this.CampaignsService.arrBaseTypes = data;
                sub.unsubscribe();
            },
            error => {
                sub.unsubscribe();
            }
        );
    }

    public goBack() {
        this.router.navigate([`/campaigns`]);
    }
}

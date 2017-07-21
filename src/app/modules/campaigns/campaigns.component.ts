import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {CampaignsService} from './campaigns.service';
import {Observable} from 'rxjs/Rx';
import {campaign_url, design_url} from '../../lib/const';

@Component({
    selector: 'app-campaigns',
    templateUrl: './campaigns.component.html',
    styleUrls: ['./campaigns.component.css']
})

export class CampaignsComponent implements OnInit, OnDestroy {
    @ViewChild('api') api: any;
    public CampaignData: any = {};
    public search = {title: '', private: -1, state: 'launching', page_size: 10, page: 1};
    private subs: any;

    constructor(private CampaignsService: CampaignsService, private router: Router) {

    }

    ngOnInit() {
        this.getCampaigns();
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }

    public getCampaigns() {
        this.CampaignsService.http.startLoad();
        this.subs = this.CampaignsService.getCampaigns(this.search).subscribe(
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

    public addCampaign() {
        window.open(design_url, '_blank');
    }

    public goDetail(camp) {
        this.router.navigate([`/campaigns/${camp.id}`]);
    }

    public goView(camp) {
        window.open(this.genCampaignDetailUrl(camp.url), '_blank');
    }

    public getPage(page: number) {
        this.search.page = page;
        this.getCampaigns();
    }

    public genCampaignDetailUrl(uri) {
        const uricv = uri.split('/').join('');
        return campaign_url + uricv;
    }
}

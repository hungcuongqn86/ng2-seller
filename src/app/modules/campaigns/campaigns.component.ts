import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {CampaignsService} from './campaigns.service';
import {Observable} from 'rxjs/Rx';
import {AppService} from '../../app.service';

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

    constructor(private CampaignsService: CampaignsService, public AppService: AppService, private router: Router) {

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
        return 'http://' + this.AppService.svConfig['system.ecomerce.domain.name']
            + this.AppService.svConfig['campaign.detail.uri.prefix']
            + '/' + uri.split('/').join('');
    }
}

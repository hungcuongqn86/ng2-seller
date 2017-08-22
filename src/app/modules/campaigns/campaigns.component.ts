import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CampaignsService} from './campaigns.service';
import {AppService} from '../../app.service';
import {campaign_states, myMultiSelectText, mySMultiSelectSettings} from '../../lib/const';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})

export class CampaignsComponent implements OnInit, OnDestroy {
  @ViewChild('api') api: any;
  public CampaignData: any = {};
  private subs: any;
  public states = campaign_states;

  public mySSettings = mySMultiSelectSettings;
  public myText = myMultiSelectText;
  public statesModel: Array<any>;

  constructor(public CampaignsService: CampaignsService, public AppService: AppService, private router: Router) {
    this.CampaignsService.campaign = null;
  }

  ngOnInit() {
    this.myText.defaultTitle = 'Select all';
    this.statesModel = [this.CampaignsService.search.state];
    this.getCampaigns();
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  public searchCampaigns() {
    this.CampaignsService.search.page = 1;
    this.getCampaigns();
  }

  public getCampaigns() {
    this.CampaignsService.http.startLoad();
    this.subs = this.CampaignsService.getCampaigns(this.CampaignsService.search).subscribe(
      data => {
        this.CampaignData = data;
        this.CampaignsService.http.endLoad();
      },
      error => {
        this.CampaignsService.http.endLoad();
      }
    );
  }

  public goDetail = camp => this.router.navigate([`/campaigns/${camp.id}`]);
  public goView = camp => window.open(this.genCampaignDetailUrl(camp.url), '_blank');

  public getPage(page: number) {
    this.CampaignsService.search.page = page;
    this.getCampaigns();
  }

  public genCampaignDetailUrl = uri => 'http://' + this.AppService.svConfig['system.ecomerce.domain.name']
    + this.AppService.svConfig['campaign.detail.uri.prefix'] + '/' + uri.split('/').join('');

  public selState() {
    this.CampaignsService.search.state = this.statesModel.join(',');
    this.getCampaigns();
  }
}

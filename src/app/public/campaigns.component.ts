import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
import {PublicService} from './public.service';

export interface PromptModel {
  Campaigns: any;
}

@Component({
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsdlComponent extends DialogComponent<PromptModel, string> implements PromptModel, OnInit {
  Campaigns: any = [];
  public campaigns_sl: any = [];
  public campaignsid_sl = [];
  private subs: any;
  private search = {title: '', private: -1, state: 'launching', page_size: 10, page: 1};
  public CampaignData: any = {};

  constructor(dialogService: DialogService, private PublicService: PublicService) {
    super(dialogService);
  }

  ngOnInit() {
    for (let i = 0; i < this.Campaigns.length; i++) {
      this.selectCampaign(this.Campaigns[i]);
    }
    this.getCampaigns();
  }

  public getCampaigns() {
    this.PublicService.http.startLoad();
    this.subs = this.PublicService.getCampaigns(this.search).subscribe(
      data => {
        this.CampaignData = data;
        this.PublicService.http.endLoad();
      },
      error => {
        this.PublicService.http.endLoad();
      }
    );
  }

  public selectCampaign(item) {
    const indexx = this.campaignsid_sl.indexOf(item.id);
    if (indexx < 0) {
      this.campaignsid_sl.push(item.id);
      this.campaigns_sl.push(item);
    } else {
      this.campaignsid_sl.splice(indexx, 1);
      this.campaigns_sl.splice(indexx, 1);
    }
  }

  public confirm() {
    this.result = this.campaigns_sl;
    this.close();
  }

  public mdClose() {
    this.close();
  }
}

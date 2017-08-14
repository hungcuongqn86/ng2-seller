import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CampaignsService} from './campaigns.service';
import {ConfirmComponent} from '../../public/confirm.component';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit, OnDestroy {
  private CampaignId;
  public tab = 'detail';
  private subs: any;
  private DialogSubs: any;

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

  public setState(state) {
    this.DialogSubs = this.CampaignsService.http.dialogService.addDialog(ConfirmComponent, {
      title: 'Confirm change state',
      message: 'You sure want to change state!'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.CampaignsService.campaign.state = state;
          this.updateCampaign();
        }
        this.DialogSubs.unsubscribe();
      });
    setTimeout(() => {
      this.DialogSubs.unsubscribe();
    }, 10000);
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

  private updateCampaign() {
    this.CampaignsService.http.startLoad();
    const cpU: any = {};
    Object.keys(this.CampaignsService.campaign).map((index) => {
      cpU[index] = this.CampaignsService.campaign[index];
    });
    cpU.desc = encodeURIComponent(cpU.desc);
    this.subs = this.CampaignsService.updateCampaign(cpU).subscribe(
      () => {
        this.getCampaign();
        this.CampaignsService.http.endLoad();
      },
      error => {
        this.CampaignsService.http.endLoad();
      }
    );
  }
}

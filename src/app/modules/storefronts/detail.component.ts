import {Component, ElementRef, Renderer, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NgModel} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {UploadService} from '../../public/upload.service';
import {StorefrontsService} from './storefronts.service';
import {QuillEditorComponent} from 'ngx-quill/src/quill-editor.component';
import {CampaignsdlComponent} from '../../public/campaigns.component';
import {coverSize} from '../../lib/const';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('coverbg')
  coverbg: ElementRef;
  @ViewChild('form') form: NgModel;
  private StorefrontId;
  public tab = 'detail';
  private subs: any;
  private DialogSubs: any;
  private campaigns: Array<any> = [];

  @ViewChild('editor') editor: QuillEditorComponent;
  public quillOption = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{'size': ['small', false, 'large', 'huge']}],
      [{'color': []}, {'background': []}],
      [{'align': []}],
      ['link', 'image']
    ]
  };

  public arrDomains: any = [];
  uri: any = {'uri': '', 'available': true};
  url: string;

  btnUpdateTitle = 'Create storefront';

  constructor(public StorefrontsService: StorefrontsService, private route: ActivatedRoute,
              private router: Router, private UploadService: UploadService, private renderer: Renderer) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.StorefrontId = params['id'];
    });
    if (this.StorefrontId) {
      this.btnUpdateTitle = 'Update storefront';
    }
    this.setupdata();
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  private unsubscribe() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  private setupdata() {
    this.StorefrontsService.http.startLoad();
    const subs = this.getData().subscribe(
      () => {
        if (this.arrDomains.length) {
          if (this.StorefrontsService.storefront.url.domain === '') {
            this.setDomain(this.arrDomains[0]);
          } else {
            Object.keys(this.arrDomains).map((index) => {
              if (this.arrDomains[index].id = this.StorefrontsService.storefront.url.domain) {
                this.setDomain(this.arrDomains[index]);
              }
            });
          }
        }

        if (this.StorefrontsService.storefront.banner !== '') {
          this.resizeCover();
        }
        this.StorefrontsService.http.endLoad();
      },
      error => {
        subs.unsubscribe();
        this.StorefrontsService.http.endLoad();
      }
    );
  }

  private resizeCover() {
    const w = this.coverbg.nativeElement.offsetWidth;
    const h = (coverSize.w / w) * coverSize.h;
    this.renderer.setElementStyle(this.coverbg.nativeElement, 'height', h + 'px');
  }

  private getData(): Observable<any> {
    return Observable.create(observer => {
      const sub1 = this.StorefrontsService.getDomains().subscribe(
        data => {
          this.arrDomains = data;
          observer.next();
          sub1.unsubscribe();
        },
        error => {
          observer.error(error);
          sub1.unsubscribe();
        }
      );

      if (this.StorefrontId) {
        const sub2 = this.StorefrontsService.getDetail(this.StorefrontId).subscribe(
          data => {
            data.desc = decodeURIComponent(data.desc);
            data.desc = data.desc.split('%20').join(' ');
            data.url = {
              domain: data.domain_id,
              uri: data.url.split('/').join('')
            };
            const camp = [];
            this.campaigns = data.campaigns;
            for (let i = 0; i < data.campaigns.length; i++) {
              camp.push(data.campaigns[i].id);
            }
            data.campaigns = camp.join(',');
            this.StorefrontsService.storefront = data;
            observer.next();
            sub2.unsubscribe();
          },
          error => {
            observer.error(error);
            sub2.unsubscribe();
          }
        );
      }
    });
  }

  public setDomain(domail) {
    this.StorefrontsService.storefront.url.domain = domail.id;
    this.url = domail.name;
  }

  public checkSuggestion() {
    if (this.StorefrontsService.storefront.url.uri !== '') {
      this.StorefrontsService.checkSuggestion(this.StorefrontsService.storefront.url.uri, this.StorefrontsService.storefront.id).subscribe(
        res => {
          this.uri = res;
        }
      );
    } else {
      this.uri = {uri: '', available: true};
    }
  }

  public handleFileSelect(evt) {
    this.UploadService.startLoad();
    const files = evt.target.files;
    if (files) {
      this.subs = this.UploadService.makeFileRequest(files, 'store').subscribe(
        (data) => {
          this.StorefrontsService.storefront.banner = data.url;
          if (this.StorefrontsService.storefront.banner !== '') {
            this.resizeCover();
          }
          this.UploadService.endLoad();
          this.unsubscribe();
          this.form['controls']['filePicker'].reset();
        },
        error => {
          const jerror = JSON.parse(error);
          if (jerror.message) {
            this.StorefrontsService.http.alert(jerror.message);
          }
          this.unsubscribe();
          this.UploadService.endLoad();
          this.form['controls']['filePicker'].reset();
        }
      );
    }
  }

  public removeBanner() {
    this.StorefrontsService.storefront.banner = '';
  }

  public setVisibility(val) {
    this.StorefrontsService.storefront.private = val;
  }

  public suggestion() {
    if (this.StorefrontsService.storefront.id === '' && this.StorefrontsService.storefront.title !== '') {
      this.StorefrontsService.suggestion(this.StorefrontsService.storefront.title).subscribe(
        res => {
          this.uri = res;
          this.StorefrontsService.storefront.url.uri = this.uri.uri;
        },
        error => {
          console.error(error.json().message);
          return Observable.throw(error);
        }
      );
    } else {
      this.uri = {uri: '', available: true};
    }
  }

  public changeCampaigns() {
    this.DialogSubs = this.StorefrontsService.http.dialogService.addDialog(CampaignsdlComponent, {
      Campaigns: this.campaigns,
    }).subscribe((campaigns_sl) => {
      this.StorefrontsService.storefront.campaigns = campaigns_sl;
      this.DialogSubs.unsubscribe();
    });
  }

  public goBack() {
    this.router.navigate([`/storefronts`]);
  }

  public updateStorefront() {
    this.StorefrontsService.http.startLoad();
    const sfU: any = {};
    Object.keys(this.StorefrontsService.storefront).map((index) => {
      sfU[index] = this.StorefrontsService.storefront[index];
    });
    sfU.desc = encodeURIComponent(sfU.desc);
    if (sfU.id === '') {
      delete sfU.id;
      this.subs = this.StorefrontsService.createStorefronts(sfU).subscribe(
        () => {
          this.StorefrontsService.http.endLoad();
          this.router.navigate([`/storefronts`]);
        },
        error => {
          this.StorefrontsService.http.endLoad();
        }
      );
    } else {
      this.subs = this.StorefrontsService.updateStorefronts(sfU).subscribe(
        () => {
          this.StorefrontsService.http.endLoad();
          this.router.navigate([`/storefronts`]);
        },
        error => {
          this.StorefrontsService.http.endLoad();
        }
      );
    }
  }

  public seDescription() {
    const toolbar = this.editor.quillEditor.getModule('toolbar');
    const objTooltip = this.editor.quillEditor.theme.tooltip;
    objTooltip.save = function () {
      const value = this.textbox.value;
      switch (this.root.getAttribute('data-mode')) {
        case 'link': {
          const scrollTop = this.quill.root.scrollTop;
          if (this.linkRange) {
            this.quill.formatText(this.linkRange, 'link', value);
            delete this.linkRange;
          } else {
            this.restoreFocus();
            this.quill.format('link', value);
          }
          this.quill.root.scrollTop = scrollTop;
          break;
        }
        case 'image': {
          this.quill.format('image', value);
          break;
        }
        default:
      }
      this.textbox.value = '';
      this.hide();
    };
    toolbar.addHandler('image', function (value) {
      if (value) {
        this.quill.theme.tooltip.edit('image', '');
      } else {
        this.quill.format('image', '');
      }
    });
  }
}

import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NgModel} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {UploadService} from '../../public/upload.service';
import {StorefrontsService} from './storefronts.service';
import {ConfirmComponent} from '../../public/confirm.component';
import {QuillEditorComponent} from 'ngx-quill/src/quill-editor.component';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: NgModel;
  private StorefrontId;
  public tab = 'detail';
  private subs: any;
  private DialogSubs: any;

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
  public domain = '';
  uri: any = {'uri': '', 'available': true};
  url: string;

  constructor(public StorefrontsService: StorefrontsService, private route: ActivatedRoute,
              private router: Router, private UploadService: UploadService) {
  }

  ngOnInit() {
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
        this.StorefrontsService.http.endLoad();
      },
      error => {
        subs.unsubscribe();
        this.StorefrontsService.http.endLoad();
      }
    );
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
    if (this.StorefrontsService.storefront.title !== '') {
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
      //
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

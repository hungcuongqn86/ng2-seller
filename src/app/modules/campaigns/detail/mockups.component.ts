import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {NgModel} from '@angular/forms';
import {CampaignsService} from '../campaigns.service';
import {UploadService} from '../../../public/upload.service';
import {ColorComponent} from '../../../public/color.component';
import {ConfirmComponent} from '../../../public/confirm.component';
import {AddproductComponent} from '../../../public/addproduct.component';
import {Observable} from 'rxjs/Rx';
import {Ds} from '../../../lib/ds';

@Component({
    selector: 'app-campaign-detail-mockups',
    templateUrl: './mockups.component.html',
    styleUrls: ['./mockups.component.css']
})

export class MockupsComponent implements OnInit, OnDestroy {
    @ViewChild('form') form: NgModel;
    public face = 'front';
    private subs: any;
    private DialogSubs: any;
    public product: any = {base: {name: ''}};
    public fMockup = {};
    private variants = [];

    constructor(public CampaignsService: CampaignsService, private UploadService: UploadService) {
    }

    ngOnInit() {
        if (!this.product.id) {
            this.setProduct(this.CampaignsService.campaign.products[0]);
        }
    }

    private convertMockup() {
        for (let index = 0; index < this.product.variants.length; index++) {
            this.product.variants[index].mockupsConvert = [];
            this.product.variants[index].mockupsConvert.push({
                id: 'f',
                type: 'ds',
                'url': this.product.variants[index].image.front
            });
            if (this.product.variants[index].image.back !== '') {
                this.product.variants[index].mockupsConvert.push({
                    id: 'b',
                    type: 'ds',
                    'url': this.product.variants[index].image.back
                });
            }
            if (this.product.variants[index].mockups) {
                for (let i = 0; i < this.product.variants[index].mockups.length; i++) {
                    this.product.variants[index].mockupsConvert.push({
                        id: this.product.variants[index].mockups[i].id,
                        type: 'mup',
                        'url': this.product.variants[index].mockups[i].image.url
                    });
                }
            }

            const len = this.product.variants[index].mockupsConvert.length;
            const max = 4;
            if (len < max) {
                for (let j = len; j < max; j++) {
                    this.product.variants[index].mockupsConvert.push({
                        id: '',
                        type: 'add',
                        'url': ''
                    });
                }
            }
        }
    }

    ngOnDestroy() {
        this.unsubscribe();
    }

    private unsubscribe() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }

    public setProduct(item) {
        this.product = item;
        this.convertMockup();
    }

    public selectVariant(variant) {
        this.variants = [];
        this.variants.push(variant.id);
    }

    public handleFileSelect(evt) {
        this.UploadService.startLoad();
        const files = evt.target.files;
        if (files) {
            this.subs = this.UploadService.makeFileRequest(files).subscribe(
                (data) => {
                    // console.log(this.variants);
                    this.addMockup(this.variants, data);
                    this.UploadService.endLoad();
                    this.unsubscribe();
                    this.form['controls']['filePicker'].reset();
                },
                error => {
                    const jerror = JSON.parse(error);
                    if (jerror.message) {
                        this.CampaignsService.http.alert(jerror.message);
                    }
                    this.unsubscribe();
                    this.UploadService.endLoad();
                    this.form['controls']['filePicker'].reset();
                }
            );
        }
    }

    private addMockup(variants, file) {
        this.CampaignsService.http.startLoad();
        const listVar = variants.join(',');
        const image = {'url': file.url};
        this.CampaignsService.addMockup(listVar, image).subscribe(
            (data) => {
                this.getCampaign();
                this.CampaignsService.http.endLoad();
            },
            error => {
                this.CampaignsService.http.endLoad();
            }
        );
    }

    private getCampaign() {
        this.CampaignsService.http.startLoad();
        this.subs = this.CampaignsService.getCampaign(this.CampaignsService.campaign.id).subscribe(
            data => {
                data.desc = decodeURIComponent(data.desc);
                data.desc = data.desc.split('%20').join(' ');
                this.CampaignsService.campaign = data;
                for (let index = 0; index < this.CampaignsService.campaign.products.length; index++) {
                    if (this.CampaignsService.campaign.products[index].id === this.product.id) {
                        this.setProduct(this.CampaignsService.campaign.products[index]);
                        break;
                    }
                }
                this.CampaignsService.http.endLoad();
            },
            error => {
                this.CampaignsService.http.endLoad();
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    public deleteMockup(mockup) {
        this.CampaignsService.http.startLoad();
        if (mockup.id && mockup.type === 'mup') {
            this.subs = this.CampaignsService.deleteMockup(mockup.id).subscribe(
                data => {
                    this.getCampaign();
                },
                error => {
                    console.error(error.json().message);
                    return Observable.throw(error);
                }
            );
        }
    }
}

import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {NgModel} from '@angular/forms';
import {CampaignsService} from '../campaigns.service';
import {UploadService} from '../../../public/upload.service';
import {VariantsComponent} from '../../../public/variants.component';
import {ConfirmComponent} from '../../../public/confirm.component';
import {TempmockupComponent} from '../../../public/tempmockup.component';
import {Observable} from 'rxjs/Rx';

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
    private multi = false;

    constructor(public CampaignsService: CampaignsService, private UploadService: UploadService) {
    }

    ngOnInit() {
        this.getCampaign();
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
        this.multi = false;
        this.variants = [];
        this.variants.push(variant.id);
    }

    public setSelectMulti() {
        this.multi = true;
    }

    public handleFileSelect(evt) {
        this.UploadService.startLoad();
        const files = evt.target.files;
        if (files) {
            this.subs = this.UploadService.makeFileRequest(files, 'mockup').subscribe(
                (data) => {
                    if (this.multi) {
                        this.openVariants(data);
                    } else {
                        const mockup = {
                            campaign: {
                                'id': this.CampaignsService.campaign.id,
                                'url': this.CampaignsService.campaign.url
                            },
                            variants: this.variants.join(','),
                            type: 'front',
                            image: {
                                url: data.url
                            }
                        };
                        this.addMockup(mockup);
                    }
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

    public openTemplate() {
        document.body.style.overflow = 'hidden';
        this.DialogSubs = this.CampaignsService.http.dialogService.addDialog(TempmockupComponent, {
            campaign: this.CampaignsService.campaign
        }).subscribe((data: any) => {
            if (data) {
                const variants: Array<string> = [];
                for (let index = 0; index < this.product.variants.length; index++) {
                    variants.push(this.product.variants[index].id);
                }
                const mockup = {
                    campaign: {
                        'id': this.CampaignsService.campaign.id,
                        'url': this.CampaignsService.campaign.url
                    },
                    variants: variants.join(','),
                    type: data.type,
                    template: {
                        id: data.id
                    }
                };
                this.addMockup(mockup);
            }
            document.body.style.overflow = 'auto';
            this.DialogSubs.unsubscribe();
        });
    }

    private openVariants(data) {
        document.body.style.overflow = 'hidden';
        this.DialogSubs = this.CampaignsService.http.dialogService.addDialog(VariantsComponent, {
            variants: this.product.variants
        }).subscribe((variants) => {
            if (variants) {
                const mockup = {
                    campaign: {
                        'id': this.CampaignsService.campaign.id,
                        'url': this.CampaignsService.campaign.url
                    },
                    variants: variants,
                    type: 'front',
                    image: {
                        url: data.url
                    }
                };
                this.addMockup(mockup);
            }
            document.body.style.overflow = 'auto';
            this.DialogSubs.unsubscribe();
        });
    }

    private addMockup(mockup) {
        this.CampaignsService.http.startLoad();
        this.CampaignsService.addMockup(mockup).subscribe(
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
                if (!this.product.id) {
                    this.setProduct(this.CampaignsService.campaign.products[0]);
                } else {
                    for (let index = 0; index < this.CampaignsService.campaign.products.length; index++) {
                        if (this.CampaignsService.campaign.products[index].id === this.product.id) {
                            this.setProduct(this.CampaignsService.campaign.products[index]);
                            break;
                        }
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

    public deleteMockup(item) {
        this.DialogSubs = this.CampaignsService.http.dialogService.addDialog(ConfirmComponent, {
            title: 'Confirm delete mockup',
            message: 'You sure want to delete this record!'
        })
            .subscribe((isConfirmed) => {
                if (isConfirmed) {
                    this._deleteMockup(item);
                }
                this.DialogSubs.unsubscribe();
            });
        setTimeout(() => {
            this.DialogSubs.unsubscribe();
        }, 10000);
    }

    public _deleteMockup(mockup) {
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

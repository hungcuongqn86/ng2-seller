import {Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {QuillEditorComponent} from 'ngx-quill/src/quill-editor.component';
import {Select2OptionData} from 'ng2-select2';
import {CampaignsService} from '../campaigns.service';
import {ProductdfComponent} from '../../../public/productdf.component';
import {Observable} from 'rxjs/Rx';
import {Ds} from '../../../lib/ds';
import {DsLib} from '../../../lib/lib';

@Component({
    selector: 'app-campaign-detail-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit, OnDestroy {
    @ViewChild('form') form: any;
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
    public placeholder = '...';
    public arrDomains: any = [];
    public domain = '';

    public options: Select2Options = {
        multiple: true
    };
    public arrCategories: Array<Select2OptionData> = [];
    public arrCatValue: string[];

    public timeLength: Array<any>;
    public timeEnd: any = [];

    public product: any;
    public face = 'front';
    public color: any = null;

    private subs: any;
    private DialogSubs: any;

    constructor(public CampaignsService: CampaignsService) {
    }

    ngOnInit() {
        this.getDomains();
        this.getCategories();
        this.timeLength = DsLib.getTimeLength();
        this.setTimeLength(this.timeLength[0]);
        this.product = this.getProductDefault();
        this.face = this.getFace();
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }

    public setTimeLength(timeItem: any) {
        this.timeEnd = timeItem;
        this.CampaignsService.campaign.length = this.timeEnd.number;
    }

    private getDomains() {
        this.subs = this.CampaignsService.getDomains().subscribe(
            res => {
                this.arrDomains = res.domains;
                if (this.arrDomains) {
                    const myjs = this;
                    const dm = this.arrDomains.filter(function (el) {
                        return (el.id === myjs.CampaignsService.campaign.domain_id);
                    });
                    if (dm.length) {
                        this.domain = dm[0].name;
                    }
                }
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    public touchedCat() {
        this.form.form.controls.sel_categories.markAsTouched();
    }

    public categoriesSelect(data: { value: string[] }) {
        this.CampaignsService.campaign.categories = data.value.join(',');
    }

    private getCategories() {
        this.subs = this.CampaignsService.getCategories(true).subscribe(
            res => {
                this.arrCategories = this.convertCat(res.categories);
                if (this.CampaignsService.campaign.categories) {
                    this.arrCatValue = this.CampaignsService.campaign.categories.split(',');
                }
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    private convertCat(arrCat) {
        Object.keys(arrCat).map((index) => {
            arrCat[index]['text'] = arrCat[index].name;
        });
        return arrCat;
    }

    public setVisibility(val) {
        this.CampaignsService.campaign.private = val;
    }

    private getProductDefault(): any {
        let check = this.CampaignsService.campaign.products.findIndex(x => x.default === true);
        if (check < 0) {
            check = 0;
        }
        const prod: any = [];
        Object.keys(this.CampaignsService.campaign.products[check]).map((index) => {
            prod[index] = this.CampaignsService.campaign.products[check][index];
        });
        return prod;
    }

    public getOldOpt(product): any {
        return Ds._getMainOpt(product.base.type.id, 'front', this.CampaignsService.arrBaseTypes, this.CampaignsService.campaign);
    }

    private getFace(): any {
        const check = this.CampaignsService.campaign.products.findIndex(x => x.default === true);
        if (check >= 0) {
            if (this.CampaignsService.campaign.products[check].back_view) {
                return 'back';
            }
        }
        return 'front';
    }

    public changeProduct() {
        this.DialogSubs = this.CampaignsService.http.dialogService.addDialog(ProductdfComponent, {
            title: 'Select product',
            campaign: this.CampaignsService.campaign,
            arrbasetypes: this.CampaignsService.arrBaseTypes
        }).subscribe((product) => {
            if (product) {
                this.mergProduct(product);
            }
            this.DialogSubs.unsubscribe();
        });
    }

    private mergProduct(product: any) {
        if (product) {
            Object.keys(this.CampaignsService.campaign.products).map((index) => {
                if (this.CampaignsService.campaign.products[index].id === product.id) {
                    this.CampaignsService.campaign.products[index].default = true;
                    this.CampaignsService.campaign.products[index].back_view = product.back_view;
                    this.CampaignsService.campaign.products[index].colors = product.colors;
                } else {
                    this.CampaignsService.campaign.products[index].default = false;
                }
            });
            if (product.back_view) {
                this.face = 'back';
            } else {
                this.face = 'front';
            }
            this.product = this.getProductDefault();
            let indexColor = this.product.colors.findIndex(x => x.default === true);
            if (indexColor < 0) {
                indexColor = 0;
            }
            this.color = this.product.colors[indexColor];
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

    public updateCampaign() {
        this.CampaignsService.http.startLoad();
        const cpU: any = {};
        Object.keys(this.CampaignsService.campaign).map((index) => {
            cpU[index] = this.CampaignsService.campaign[index];
        });
        cpU.desc = encodeURIComponent(cpU.desc);
        this.subs = this.CampaignsService.updateCampaign(cpU).subscribe(
            () => {
                this.CampaignsService.http.endLoad();
            },
            error => {
                this.CampaignsService.http.endLoad();
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }
}

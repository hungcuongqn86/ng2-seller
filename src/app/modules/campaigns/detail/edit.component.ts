import {Component, Input, ViewChild, OnInit} from '@angular/core';
import {QuillEditorComponent} from 'ngx-quill/src/quill-editor.component';
import {Select2OptionData} from 'ng2-select2';
import {CampaignsService} from '../campaigns.service';
import {Observable} from 'rxjs/Rx';
import {DsLib} from '../../../lib/lib';

@Component({
    selector: 'app-campaign-detail-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
    @ViewChild('form') form: any;
    @Input('campaign')
    public campaign: any;
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

    constructor(private CampaignsService: CampaignsService) {
    }

    ngOnInit() {
        this.getDomains();
        this.getCategories();
        this.timeLength = DsLib.getTimeLength();
        this.setTimeLength(this.timeLength[0]);
    }

    public setTimeLength(timeItem: any) {
        this.timeEnd = timeItem;
        this.campaign.length = this.timeEnd.number;
    }

    private getDomains() {
        this.CampaignsService.getDomains().subscribe(
            res => {
                this.arrDomains = res.domains;
                if (this.arrDomains) {
                    const myjs = this;
                    const dm = this.arrDomains.filter(function (el) {
                        return (el.id === myjs.campaign.domain_id);
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
        this.campaign.categories = data.value.join(',');
    }

    private getCategories() {
        this.CampaignsService.getCategories(true).subscribe(
            res => {
                this.arrCategories = this.convertCat(res.categories);
                if (this.campaign.categories) {
                    this.arrCatValue = this.campaign.categories.split(',');
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
        this.campaign.private = val;
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

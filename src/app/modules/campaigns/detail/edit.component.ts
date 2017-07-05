import {Component, Input, ViewChild, OnInit} from '@angular/core';
import {QuillEditorComponent} from 'ngx-quill/src/quill-editor.component';
import {CampaignsService} from '../campaigns.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-campaign-detail-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
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

    constructor(private CampaignsService: CampaignsService) {
    }

    ngOnInit() {
        console.log(this.campaign);
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

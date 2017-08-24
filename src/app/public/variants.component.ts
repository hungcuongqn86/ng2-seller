import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';

export interface PromptModel {
    variants: any;
}

@Component({
    templateUrl: './variants.component.html',
    styleUrls: ['./variants.component.css']
})
export class VariantsComponent extends DialogComponent<PromptModel, string> implements PromptModel, OnInit {
    variants: any;
    public variants_sl = [];

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    ngOnInit() {
    }

    public selectVar(item) {
        const indexx = this.variants_sl.indexOf(item.id);
        if (indexx < 0) {
            this.variants_sl.push(item.id);
        } else {
            this.variants_sl.splice(indexx, 1);
        }
    }

    public confirm() {
        this.result = this.variants_sl.join(',');
        this.close();
    }

    public mdClose() {
        this.close();
    }
}

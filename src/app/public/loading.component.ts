import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
export interface PromptModel {
    status: string;
}

@Component({
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css']
})
export class LoadingComponent extends DialogComponent<PromptModel, string> implements PromptModel, OnInit {
    status: string;

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    ngOnInit() {

    }

    public mdClose() {
        this.close();
    }
}

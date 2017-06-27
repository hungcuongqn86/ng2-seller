import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
export interface PromptModel {
    alert: string;
}

@Component({
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent extends DialogComponent<PromptModel, string> implements PromptModel, OnInit {
    alert: string;

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    ngOnInit() {

    }

    public mdClose() {
        this.close();
    }
}

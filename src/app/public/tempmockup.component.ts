import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
import {PublicService} from './public.service';

import {Observable} from 'rxjs/Rx';

export interface PromptModel {
    campaign: any;
}

@Component({
    templateUrl: './tempmockup.component.html',
    styleUrls: ['./tempmockup.component.css']
})
export class TempmockupComponent extends DialogComponent<PromptModel, string> implements PromptModel, OnInit {
    campaign: any;

    arrMockupCategories: any = [];
    categories: any = [];
    arrTypes: any = [];
    type: any = [];
    arrTemplate: any = [];

    constructor(dialogService: DialogService, private PublicService: PublicService) {
        super(dialogService);
    }

    ngOnInit() {
        this.getMockupCategories();
        this.getMockupTypes();
        this.getTemplates();
    }

    private getMockupCategories() {
        this.PublicService.getMockupCategories().subscribe(
            data => {
                this.arrMockupCategories = data;
                if (this.arrMockupCategories.length) {
                    this.categories = this.arrMockupCategories[0];
                }
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    public setCategories(categories) {
        this.categories = categories;
        this.getTemplates();
    }

    private getMockupTypes() {
        this.PublicService.getMockupTypes().subscribe(
            data => {
                this.arrTypes = data;
                if (this.arrTypes.length) {
                    this.type = this.arrTypes[0];
                }
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    public setType(type) {
        this.type = type;
        this.getTemplates();
    }

    public getTemplates() {
        this.PublicService.getMockupTemplates(this.type.id, this.categories.id).subscribe(
            data => {
                this.arrTemplate = data;
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    public selectTemp(temp) {
        this.result = temp;
        this.close();
    }

    public mdClose() {
        this.close();
    }
}

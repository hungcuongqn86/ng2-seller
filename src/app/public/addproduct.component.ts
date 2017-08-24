import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
import {PublicService} from './public.service';

import {Observable} from 'rxjs/Rx';

export interface PromptModel {
    campaign: any;
}

@Component({
    templateUrl: './addproduct.component.html',
    styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent extends DialogComponent<PromptModel, string> implements PromptModel, OnInit {
    campaign: any;
    status = 'baseType';

    arrBaseTypes: any = [];
    baseType: any = [];
    arrBase: any = [];

    constructor(dialogService: DialogService, private PublicService: PublicService) {
        super(dialogService);
    }

    ngOnInit() {
        this.getBaseTypes();
    }

    public getBaseTypes() {
        this.PublicService.getBaseTypes().subscribe(
            data => {
                this.arrBaseTypes = data;
                this.baseType = [];
                this.status = 'baseType';
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    public loadBase(sBaseType) {
        this.baseType = sBaseType;
        this.PublicService.getBases(sBaseType.id).subscribe(
            data => {
                this.arrBase = data;
                this.status = 'base';
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    public hasBase(id) {
        for (let index = 0; index < this.campaign.products.length; index++) {
            if (this.campaign.products[index].base.id === id) {
                return index;
            }
        }
        return -1;
    }

    public selectProductBase(objBase) {
        this.result = objBase;
        this.close();
    }

    public mdClose() {
        this.close();
    }
}

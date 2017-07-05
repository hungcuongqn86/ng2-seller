import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
import {DsLib} from '../lib/lib';
import {Observable} from 'rxjs/Rx';

export interface PromptModel {
    title;
    campaign;
}

@Component({
    templateUrl: './productdf.component.html',
    styleUrls: ['./productdf.component.css']
})
export class ProductdfComponent extends DialogComponent<PromptModel, string> implements PromptModel, OnInit {
    title;
    campaign: any;
    public product: any;
    public mainOpt = [];
    public face = 'front';

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    ngOnInit() {
        this.product = this.getProductDefault();
        this.mainOpt = this.getMainOpt();
        this.face = this.getFace();
    }

    private getProductDefault(): any {
        let check = this.campaign.products.findIndex(x => x.default === true);
        if (check < 0) {
            check = 0;
        }
        return this.campaign.products[check];
    }

    private getMainOpt(): any {
        for (let index = 0; index < this.campaign.products.length; index++) {
            const check = this.campaign.products[index].designs.findIndex(x => x.main === true);
            if (check >= 0) {
                return DsLib.getOpt(this.campaign.products[index], 'front');
            }
        }
        return [];
    }

    private getFace(): any {
        const check = this.campaign.products.findIndex(x => x.default === true);
        if (check >= 0) {
            if (this.campaign.products[check].back_view) {
                return 'back';
            }
        }
        return 'front';
    }

    public selectProduct(prod) {
        this.product = prod;
    }

    public changeColor() {

    }

    public mdClose() {
        this.close();
    }

    public confirm() {
        this.result = '';
        this.close();
    }
}

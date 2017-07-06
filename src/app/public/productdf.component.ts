import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
import {DsLib} from '../lib/lib';

export interface PromptModel {
    title;
    campaign;
}

@Component({
    templateUrl: './productdf.component.html',
    styleUrls: ['./productdf.component.css']
})
export class ProductdfComponent extends DialogComponent<PromptModel, string> implements PromptModel, OnInit {
    public title;
    public campaign: any;
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
                return DsLib.getOpt(this.campaign.products[index], this.face);
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
        if (this.product.id !== prod.id) {
            this.product = prod;
        }
    }

    public changeColor(itemColor) {
        const prod: any = [];
        Object.keys(this.product).map((index) => {
            prod[index] = this.product[index];
        });

        Object.keys(prod.colors).map((index) => {
            if (prod.colors[index].id === itemColor.id) {
                prod.colors[index].default = true;
            } else {
                prod.colors[index].default = false;
            }
        });
        this.product = prod;
    }

    public setFace(face) {
        this.face = face;
        this.mainOpt = this.getMainOpt();
        const prod: any = [];
        Object.keys(this.product).map((index) => {
            prod[index] = this.product[index];
        });
        if (this.face === 'front') {
            prod.back_view = false;
        } else {
            prod.back_view = true;
        }
        this.product = prod;
    }

    public mdClose() {
        this.close();
    }

    public confirm() {
        this.result = this.product;
        this.close();
    }
}

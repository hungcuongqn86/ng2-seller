import {Component, Input, ViewChild, OnInit} from '@angular/core';
import {CampaignsService} from '../campaigns.service';
import {ColorComponent} from '../../../public/color.component';
import {AddproductComponent} from '../../../public/addproduct.component';
import {Observable} from 'rxjs/Rx';
import {DsLib} from '../../../lib/lib';

@Component({
    selector: 'app-campaign-detail-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
    @Input('campaign')
    public campaign: any;
    public mainOpt = [];
    public face = 'front';

    constructor(private CampaignsService: CampaignsService) {
    }

    ngOnInit() {
        this.mainOpt = this.getMainOpt();
        this.face = this.getFace();
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

    public openColors(product) {
        this.CampaignsService.http.dialogService.addDialog(ColorComponent, {
            oProduct: product,
            mainOpt: this.mainOpt,
            face: this.face
        }, {closeByClickingOutside: true}).subscribe(() => {
            this.updateCampaign();
        });
    }

    public openBases() {
        this.CampaignsService.http.dialogService.addDialog(AddproductComponent, {
            title: ''
        }, {closeByClickingOutside: true}).subscribe((base) => {
            if (base) {
                this.addProduct(base);
            }
        });
    }

    private addProduct(base) {
        const newProduct: any = {};
        newProduct.base = {id: base.id};
        newProduct.colors = [];
        newProduct.colors.push({id: base.colors[0].id});
        newProduct.position = this.campaign.products.length + 1;
        this.campaign.products.push(newProduct);
        // console.log(this.campaign);
        this.updateCampaign();
    }

    public updateCampaign() {
        this.CampaignsService.http.startLoad();
        const cpU: any = {};
        Object.keys(this.campaign).map((index) => {
            cpU[index] = this.campaign[index];
        });
        cpU.desc = encodeURIComponent(cpU.desc);
        this.CampaignsService.updateCampaign(cpU).subscribe(
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

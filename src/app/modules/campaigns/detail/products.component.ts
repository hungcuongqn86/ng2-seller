import {Component, Input, OnInit} from '@angular/core';
import {CampaignsService} from '../campaigns.service';
import {ColorComponent} from '../../../public/color.component';
import {ConfirmComponent} from '../../../public/confirm.component';
import {AddproductComponent} from '../../../public/addproduct.component';
import {Observable} from 'rxjs/Rx';
import {DsLib} from '../../../lib/lib';

@Component({
    selector: 'app-campaign-detail-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
    public mainOpt = [];
    public face = 'front';

    constructor(public CampaignsService: CampaignsService) {
    }

    ngOnInit() {
        this.mainOpt = this.getMainOpt();
        this.face = this.getFace();
    }

    public ccProfit(prod) {
        return ( Number(prod.price) - Number(prod.base.cost)).toFixed(2);
    }

    public cctProfit(prod) {
        const profit = ( Number(prod.price) - Number(prod.base.cost)).toFixed(2);
        return Number((prod.sale_expected * Number(profit)).toFixed(2));
    }

    private getMainOpt(): any {
        for (let index = 0; index < this.CampaignsService.campaign.products.length; index++) {
            const check = this.CampaignsService.campaign.products[index].designs.findIndex(x => x.main === true);
            if (check >= 0) {
                return DsLib.getOpt(this.CampaignsService.campaign.products[index], this.face);
            }
        }
        return [];
    }

    private getFace(): any {
        const check = this.CampaignsService.campaign.products.findIndex(x => x.default === true);
        if (check >= 0) {
            if (this.CampaignsService.campaign.products[check].back_view) {
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
        }, {closeByClickingOutside: true}).subscribe((colors) => {
            if (colors) {
                product.colors = colors;
                this.updateCampaign();
            }
        });
    }

    public openBases() {
        document.body.style.overflow = 'hidden';
        this.CampaignsService.http.dialogService.addDialog(AddproductComponent, {
            campaign: this.CampaignsService.campaign
        }, {closeByClickingOutside: true}).subscribe((base) => {
            document.body.style.overflow = 'auto';
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
        newProduct.position = this.CampaignsService.campaign.products.length + 1;
        this.CampaignsService.campaign.products.push(newProduct);
        this.updateCampaign();
    }

    public deleteProduct(item) {
        const disposable = this.CampaignsService.http.dialogService.addDialog(ConfirmComponent, {
            title: 'Confirm delete product',
            message: 'You sure want to delete this record!'
        })
            .subscribe((isConfirmed) => {
                if (isConfirmed) {
                    this.deleteRecord(item);
                }
            });
        setTimeout(() => {
            disposable.unsubscribe();
        }, 10000);
    }

    public deletePro(id) {
        if (this.CampaignsService.campaign.products.length <= 1) {
            return false;
        }
        for (let index = 0; index < this.CampaignsService.campaign.products.length; index++) {
            if (this.CampaignsService.campaign.products[index].base.id === id) {
                this.CampaignsService.campaign.products.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    private deleteRecord(item) {
        if (this.deletePro(item.base.id)) {
            if (this.CampaignsService.campaign.products.findIndex(x => x.default === true) < 0) {
                this.CampaignsService.campaign.products[0].default = true;
            }
            // If delete product main
            const optold = this.getMainOpt();
            if (!optold.length) {
                Object.keys(this.CampaignsService.campaign.products[0].designs).map((index) => {
                    this.CampaignsService.campaign.products[0].designs[index].main = true;
                });
            }
            this.updateCampaign();
        }
    }

    public updateCampaign() {
        this.CampaignsService.http.startLoad();
        const cpU: any = {};
        Object.keys(this.CampaignsService.campaign).map((index) => {
            cpU[index] = this.CampaignsService.campaign[index];
        });
        cpU.desc = encodeURIComponent(cpU.desc);
        this.CampaignsService.updateCampaign(cpU).subscribe(
            (data) => {
                data.desc = decodeURIComponent(data.desc);
                data.desc = data.desc.split('%20').join(' ');
                this.CampaignsService.campaign = data;
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

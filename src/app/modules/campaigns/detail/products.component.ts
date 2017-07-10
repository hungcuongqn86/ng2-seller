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
            // this.updateCampaign();
        });
    }

    public openBases() {
        document.body.style.overflow = 'hidden';
        this.CampaignsService.http.dialogService.addDialog(AddproductComponent, {
            campaign: this.campaign
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
        newProduct.position = this.campaign.products.length + 1;
        this.campaign.products.push(newProduct);
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
        if (this.campaign.products.length <= 1) {
            return false;
        }
        for (let index = 0; index < this.campaign.products.length; index++) {
            if (this.campaign.products[index].base.id === id) {
                this.campaign.products.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    private deleteRecord(item) {
        if (this.deletePro(item.base.id)) {
            if (this.campaign.products.findIndex(x => x.default === true) < 0) {
                this.campaign.products[0].default = true;
            }
            // If delete product main
            const optold = this.getMainOpt();
            if (!optold.length) {
                Object.keys(this.campaign.products[0].designs).map((index) => {
                    this.campaign.products[0].designs[index].main = true;
                });
            }
            this.updateCampaign();
        }
    }

    public updateCampaign() {
        this.CampaignsService.http.startLoad();
        const cpU: any = {};
        Object.keys(this.campaign).map((index) => {
            cpU[index] = this.campaign[index];
        });
        cpU.desc = encodeURIComponent(cpU.desc);
        this.CampaignsService.updateCampaign(cpU).subscribe(
            (data) => {
                data.desc = decodeURIComponent(data.desc);
                data.desc = data.desc.split('%20').join(' ');
                this.campaign = data;
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

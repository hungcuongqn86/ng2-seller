import {Component, OnDestroy, OnInit} from '@angular/core';
import {CampaignsService} from '../campaigns.service';
import {ColorComponent} from '../../../public/color.component';
import {ConfirmComponent} from '../../../public/confirm.component';
import {AddproductComponent} from '../../../public/addproduct.component';
import {Observable} from 'rxjs/Rx';
import {Ds} from '../../../lib/ds';

@Component({
  selector: 'app-campaign-detail-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit, OnDestroy {
  public face = 'front';
  private subs: any;
  private DialogSubs: any;

  constructor(public CampaignsService: CampaignsService) {
  }

  ngOnInit() {
    this.face = Ds.getFace(this.CampaignsService.campaign);
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  public ccProfit = prod => ( Number(prod.price) - Number(prod.base.cost)).toFixed(2);
  public cctProfit = prod => Number((prod.sale_expected * Number(this.ccProfit(prod))).toFixed(2));

  public getOldOpt(product): any {
    if (product.base.type) {
      return Ds._getMainOpt(product.base.type.id, this.face, this.CampaignsService.arrBaseTypes, this.CampaignsService.campaign);
    } else {
      return null;
    }
  }

  public openColors(product) {
    this.DialogSubs = this.CampaignsService.http.dialogService.addDialog(ColorComponent, {
      oProduct: product,
      mainOpt: Ds._getMainOpt(product.base.type.id, 'front', this.CampaignsService.arrBaseTypes, this.CampaignsService.campaign),
      face: this.face
    }, {closeByClickingOutside: true}).subscribe((colors) => {
      if (colors) {
        product.colors = colors;
        this.updateCampaign();
      }
      this.DialogSubs.unsubscribe();
    });
  }

  public openBases() {
    document.body.style.overflow = 'hidden';
    this.DialogSubs = this.CampaignsService.http.dialogService.addDialog(AddproductComponent, {
      campaign: this.CampaignsService.campaign
    }, {closeByClickingOutside: true}).subscribe((base) => {
      document.body.style.overflow = 'auto';
      if (base) {
        this.addProduct(base);
      }
      this.DialogSubs.unsubscribe();
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
    this.DialogSubs = this.CampaignsService.http.dialogService.addDialog(ConfirmComponent, {
      title: 'Confirm delete product',
      message: 'You sure want to delete this record!'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.deleteRecord(item);
        }
        this.DialogSubs.unsubscribe();
      });
    setTimeout(() => {
      this.DialogSubs.unsubscribe();
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
      /*const optold = Ds._getMainOpt(item.base.type.id, 'front', this.CampaignsService.arrBaseTypes, this.CampaignsService.campaign);
       if (!optold.status) {
       Object.keys(this.CampaignsService.campaign.products[0].designs).map((index) => {
       this.CampaignsService.campaign.products[0].designs[index].main = true;
       });
       }*/
      const optold = Ds._getMainOpt(item.base.type.id, 'front', this.CampaignsService.arrBaseTypes, this.CampaignsService.campaign);
      if (!optold.status) {
        const typeGroup = Ds.getBaseGroup(this.CampaignsService.arrBaseTypes, item.base.type.id);
        for (let i = 0; i < this.CampaignsService.campaign.products.length; i++) {
          if (this.CampaignsService.campaign.products[i].base.type) {
            const typeGroupIndex = Ds.getBaseGroup(this.CampaignsService.arrBaseTypes,
              this.CampaignsService.campaign.products[i].base.type.id);
            if (typeGroup === typeGroupIndex) {
              Object.keys(this.CampaignsService.campaign.products[i].designs).map((index) => {
                this.CampaignsService.campaign.products[i].designs[index].main = true;
              });
              break;
            }
          }
        }
      }
      this.updateCampaign();
    }
  }

  private updateCampaign() {
    this.CampaignsService.http.startLoad();
    const cpU: any = {};
    Object.keys(this.CampaignsService.campaign).map((index) => {
      cpU[index] = this.CampaignsService.campaign[index];
    });
    cpU.desc = encodeURIComponent(cpU.desc);
    this.subs = this.CampaignsService.updateCampaign(cpU).subscribe(
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

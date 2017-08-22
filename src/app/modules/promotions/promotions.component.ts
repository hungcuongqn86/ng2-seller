import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmComponent} from '../../public/confirm.component';
import {PromotionsService} from './promotions.service';
import {myGMultiSelectSettings, myMultiSelectText, mySMultiSelectSettings, promotionDiscount} from '../../lib/const';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})

export class PromotionsComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: any;
  @ViewChild('api') api: any;
  public discountTypeData: any = [];
  public promotionsData: any = {};
  public promotion: any = {
    code: '',
    type: '',
    desc: 'desc',
    discount_type: '',
    discount_value: '',
    'state': 'approved'
  };

  public checkcode: any = JSON.parse('{"code":"","available": true}');
  public searchparam: any = {page_size: 10, page: 1};
  private subs: any;

  public promotionDiscount = promotionDiscount;
  public typeModel: number[];
  public discountTypeModel: number[];
  public promotionsTypeData: any = [];
  public myText = myMultiSelectText;
  public mySSettings = mySMultiSelectSettings;
  public myGSettings = myGMultiSelectSettings;

  constructor(private PromotionsService: PromotionsService) {

  }

  ngOnInit() {
    this.myText.defaultTitle = '';
    this.getPromotions();
    this.getPromotionsType();
    this.getDiscountType();
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  public setPromotionType() {
    if (this.typeModel) {
      this.promotion.type = this.typeModel.join(',');
    } else {
      this.promotion.type = '';
    }
  }

  public setDiscountType(item) {
    if (this.discountTypeModel) {
      this.promotion.discount_type = this.discountTypeModel.join(',');
    } else {
      this.promotion.discount_type = '';
    }
  }

  public onSwitchChange(e, promotion) {
    this.PromotionsService.http.startLoad();
    const promo = JSON.parse('{"code":"","type":"","desc":"desc","discount_type":"","discount_value":"","state":"approved"}');
    promo.code = promotion.code;
    promo.type = promotion.type.id;
    if (promotion.discount) {
      promo.discount_type = promotion.discount.id;
      promo.discount_value = promotion.discount.value;
    } else {
      promo.discount_type = '';
      promo.discount_value = '';
    }
    if (e.currentValue) {
      promo.state = 'approved';
    } else {
      promo.state = 'unapproved';
    }
    this.updatePromotions(promotion.id, promo);
  }

  private updatePromotions(id, promotion) {
    this.subs = this.PromotionsService.updatePromotions(id, promotion).subscribe(
      res => {
        this.getPromotions();
        this.PromotionsService.http.endLoad();
      },
      error => {
        this.PromotionsService.http.endLoad();
        console.error(error.json().message);
        return Observable.throw(error);
      }
    );
  }

  public addPromotion() {
    this.PromotionsService.http.startLoad();
    const prU: any = {};
    Object.keys(this.promotion).map((index) => {
      prU[index] = this.promotion[index];
    });
    if (prU.type === '24yQLTr5bg5f5Cor') {
      prU.discount_value = prU.discount_value.toString();
    } else {
      prU.discount_type = '';
      prU.discount_value = '';
    }
    this.subs = this.PromotionsService.createPromotions(prU).subscribe(
      res => {
        this.form.reset();
        this.getPromotions();
        this.PromotionsService.http.endLoad();
      },
      error => {
        this.PromotionsService.http.endLoad();
        console.error(error.json().message);
        return Observable.throw(error);
      }
    );
  }

  public checkDupp() {
    if (this.promotion.code !== '') {
      this.subs = this.PromotionsService.checkDupp(this.promotion.code).subscribe(
        res => {
          this.checkcode = res;
        },
        error => {
          console.error(error.json().message);
          return Observable.throw(error);
        }
      );
    } else {
      this.checkcode = JSON.parse('{"code":"","available": true}');
    }
  }

  public deletePromotion(item) {
    const disposable = this.PromotionsService.http.dialogService.addDialog(ConfirmComponent, {
      title: 'Confirm delete promotion',
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

  public getPage(page: number) {
    this.searchparam.page = page;
    this.getPromotions();
  }

  private deleteRecord(item) {
    this.PromotionsService.http.startLoad();
    this.subs = this.PromotionsService.deletePromotion(item.id).subscribe(
      res => {
        this.getPromotions();
        this.PromotionsService.http.endLoad();
      },
      error => {
        this.PromotionsService.http.endLoad();
        console.error(error.json().message);
        return Observable.throw(error);
      }
    );
  }

  private getDiscountType() {
    this.subs = this.PromotionsService.getDiscountType().subscribe(
      res => {
        this.discountTypeData = res.types;
      },
      error => {
        console.error(error.json().message);
        return Observable.throw(error);
      }
    );
  }

  private getPromotionsType() {
    this.subs = this.PromotionsService.getPromotionsType().subscribe(
      res => {
        this.promotionsTypeData = res.types;
      },
      error => {
        console.error(error.json().message);
        return Observable.throw(error);
      }
    );
  }

  private getPromotions() {
    this.PromotionsService.http.startLoad();
    this.subs = this.PromotionsService.getPromotions(this.searchparam).subscribe(
      res => {
        this.promotionsData = res;
        this.PromotionsService.http.endLoad();
      },
      error => {
        this.PromotionsService.http.endLoad();
        console.error(error.json().message);
        return Observable.throw(error);
      }
    );
  }
}

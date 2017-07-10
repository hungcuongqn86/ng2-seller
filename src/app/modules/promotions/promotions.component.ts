import {Component, ViewChild, OnInit} from '@angular/core';
import {ConfirmComponent} from '../../public/confirm.component';
import {PromotionsService} from './promotions.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-promotions',
    templateUrl: './promotions.component.html',
    styleUrls: ['./promotions.component.css']
})

export class PromotionsComponent implements OnInit {
    @ViewChild('form') form: any;
    public promotionsTypeData: any = [];
    public discountTypeData: any = [];
    public promotionsData: any = {};
    public promotion: any = JSON.parse('{"code":"","type":"","desc":"desc","discount_type":"","discount_value":"","state":"approved"}');
    public discount_type = '';
    public promotion_type = '';
    public checkcode: any = JSON.parse('{"code":"","available": true}');

    constructor(private PromotionsService: PromotionsService) {

    }

    ngOnInit() {
        this.getPromotions();
        this.getPromotionsType();
        this.getDiscountType();
    }

    public setPromotionType(item) {
        this.promotion.type = item.id;
        this.promotion_type = item.name;
    }

    public setDiscountType(item) {
        this.promotion.discount_type = item.id;
        this.discount_type = item.name;
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
        this.PromotionsService.updatePromotions(id, promotion).subscribe(
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
        this.PromotionsService.createPromotions(prU).subscribe(
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
            this.PromotionsService.checkDupp(this.promotion.code).subscribe(
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

    private deleteRecord(item) {
        this.PromotionsService.http.startLoad();
        this.PromotionsService.deletePromotion(item.id).subscribe(
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
        this.PromotionsService.getDiscountType().subscribe(
            res => {
                this.discountTypeData = res.types;
                if (this.discountTypeData.length) {
                    this.setDiscountType(this.discountTypeData[0]);
                }
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    private getPromotionsType() {
        this.PromotionsService.getPromotionsType().subscribe(
            res => {
                this.promotionsTypeData = res.types;
                if (this.promotionsTypeData.length) {
                    this.setPromotionType(this.promotionsTypeData[0]);
                }
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    private getPromotions() {
        this.PromotionsService.http.startLoad();
        this.PromotionsService.getPromotions().subscribe(
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

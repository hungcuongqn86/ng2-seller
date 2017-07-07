import {Injectable} from '@angular/core';
import {URLSearchParams, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '../../lib/http';
import {pspApiUrl} from '../../app.config';

@Injectable()
export class PromotionsService {
    private module = 'promotions';

    constructor(public http: HttpClient) {

    }

    public getPromotionsType() {
        const url = pspApiUrl + `promotion_types`;
        return this.http.get(url).map((res: Response) => res.json());
    }

    public getDiscountType() {
        const url = pspApiUrl + `promotion_discounts`;
        return this.http.get(url).map((res: Response) => res.json());
    }

    public getPromotions() {
        const url = pspApiUrl + this.module;
        return this.http.get(url).map((res: Response) => res.json());
    }

    public createPromotions(promotion): any {
        const url = pspApiUrl + `promotions`;
        const body = JSON.stringify(promotion);
        return this.http.post(url, body).map((res: Response) => res.json());
    }

    public deletePromotion(promotionId) {
        const url = pspApiUrl + this.module + `/${promotionId}`;
        return this.http.delete(url).map((res: Response) => res.json());
    }
}

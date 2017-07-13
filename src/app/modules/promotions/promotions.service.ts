import {Injectable} from '@angular/core';
import {Response, URLSearchParams} from '@angular/http';
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

    public getPromotions(searchparam) {
        const url = pspApiUrl + this.module;
        const params: URLSearchParams = new URLSearchParams();
        Object.keys(searchparam).map((key) => {
            params.set(key, searchparam[key]);
        });
        return this.http.get(url, {search: params}).map((res: Response) => res.json());
    }

    public createPromotions(promotion): any {
        const url = pspApiUrl + `promotions`;
        const body = JSON.stringify(promotion);
        return this.http.post(url, body).map((res: Response) => res.json());
    }

    public updatePromotions(id, promotion) {
        const url = pspApiUrl + `promotions/${id}`;
        const body = JSON.stringify(promotion);
        return this.http.put(url, body).map((res: Response) => res.json());
    }

    public deletePromotion(promotionId) {
        const url = pspApiUrl + this.module + `/${promotionId}`;
        return this.http.delete(url).map((res: Response) => res.json());
    }

    public checkDupp(code: string): any {
        const url = pspApiUrl + `promotions`;
        const params: URLSearchParams = new URLSearchParams();
        params.set('check', code);
        return this.http.get(url, {search: params}).map((res: Response) => res.json());
    }
}

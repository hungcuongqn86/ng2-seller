import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '../../lib/http';

@Injectable()
export class PromotionsService {
    private module = 'promotions';

    constructor(private http: HttpClient) {
    }
}

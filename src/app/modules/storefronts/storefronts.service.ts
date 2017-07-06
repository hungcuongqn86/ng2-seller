import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '../../lib/http';

@Injectable()
export class StorefrontsService {
    private module = 'contract';

    constructor(private http: HttpClient) {
    }
}

import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '../../lib/http';

@Injectable()
export class CampaignsService {
    private module = 'campaigns';

    constructor(private http: HttpClient) {
    }
}

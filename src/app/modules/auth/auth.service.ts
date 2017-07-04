import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '../../lib/http';

@Injectable()
export class AuthService {
    private module = 'auth';

    constructor(private http: HttpClient) {
    }
}

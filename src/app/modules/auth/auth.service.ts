import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {HttpClient} from '../../lib/http';
import {pspApiUrl, aspApiUrl} from '../../app.config';

@Injectable()
export class AuthService {
    constructor(public http: HttpClient) {
    }

    public accLogin(acc: any) {
        const url = aspApiUrl + `tokens`;
        const body = JSON.stringify(acc);
        return this.http.post(url, body).map((res: Response) => res.json());
    }

    public _createSession(tk) {
        const url = pspApiUrl + `sessions`;
        const body = JSON.stringify({token: tk});
        return this.http.post(url, body).map((res: Response) => res.json());
    }

    public accRegister(acc: any) {
        const url = aspApiUrl + `users`;
        const body = JSON.stringify(acc);
        return this.http.post(url, body).map((res: Response) => res.json());
    }
}

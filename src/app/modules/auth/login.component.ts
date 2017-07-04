import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Rx';
import {DsLib} from '../../lib/lib';
import {moduleStart} from '../../lib/const';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
    rError;
    alert;
    fdata: any = JSON.parse('{"source": "general","email":"","password":""}');

    constructor(private AuthService: AuthService, private router: Router) {
        this.AuthService.http.canActive = [];
    }

    public actionLogin() {
        this.AuthService.http.startLoad();
        this.AuthService.accLogin(this.fdata).subscribe(
            res => {
                DsLib.setToken(res);
                this.createSession();
            },
            error => {
                if (error.status === 401) {
                    this.rError = true;
                    this.alert = error.json().message;
                } else {
                    console.error(error.json().message);
                    return Observable.throw(error);
                }
            }
        );
    }

    private createSession() {
        const tooken = DsLib.getToken().id;
        this.AuthService._createSession(tooken).subscribe(
            res => {
                this.AuthService.http.profile = DsLib.getProfile();
                this.AuthService.http.canActive = moduleStart;
                this.AuthService.http.endLoad();
                this.router.navigate(['/campaigns']);
            },
            error => {
                this.AuthService.http.endLoad();
                if (error.status === 401) {
                    this.rError = true;
                    this.alert = error.json().message;
                } else {
                    console.error(error.json().message);
                    return Observable.throw(error);
                }
            }
        );
    }
}

import {Component} from '@angular/core';
import {AuthService} from './auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./login.component.css']
})

export class RegisterComponent {
    rSuccess;
    rError;
    alert;
    fdata: any = JSON.parse('{"source": "general","email":"","password":"","confirm_password":"","action":"regiter"}');

    constructor(private AuthService: AuthService) {
        this.AuthService.http.canActive = [];
    }

    public actionRegister() {
        this.AuthService.accRegister(this.fdata).subscribe(
            res => {
                this.rSuccess = true;
                this.rError = false;
                this.alert = 'Register success!';
            },
            error => {
                this.rSuccess = false;
                this.rError = true;
                this.alert = error.json().message;
            }
        );
    }
}

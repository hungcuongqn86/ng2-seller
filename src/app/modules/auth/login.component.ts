import {Component, OnInit} from '@angular/core';
import {PublicService} from '../../public/public.service';
import {Observable} from 'rxjs/Rx';

declare const $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    type;
    rSuccess;
    rError;
    alert;
    fdata: any = JSON.parse('{"source": "general","email":"","password":"","confirm_password":"","action":"regiter"}');

    constructor(private PublicService: PublicService) {
        this.PublicService.canActive = [];
    }

    ngOnInit() {

    }

    public actionLogin() {

    }
}

import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {PublicService} from './public/public.service';
import {Observable} from 'rxjs/Rx';
import {location} from './app.config';
import {DsLib} from './lib/lib';

declare const $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

    constructor(public PublicService: PublicService, private translate: TranslateService, private router: Router) {
        translate.addLangs([location]);
        translate.use(location);
    }

    ngOnInit() {
        this.getLocation();
    }

    private getLocation() {
        this.PublicService.getConfig('product.fulfillment.location').subscribe(
            data => {
                console.log(data);
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    public logout() {
        this.PublicService.http.startLoad();
        this.PublicService.http.profile = null;
        DsLib.removeToken();
        this.removeSession();
    }

    private removeSession() {
        const ss = DsLib.getSession();
        this.PublicService.removeSession(ss).subscribe(
            () => {
                this.PublicService.http.endLoad();
                this.router.navigate(['/auth/login']);
            },
            error => {
                this.PublicService.http.endLoad();
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    ngAfterViewInit() {
        $('#slide-submenu').on('click', function () {
            $(this).closest('.list-group').fadeOut('slide', function () {
                $('.mini-submenu').fadeIn();
            });
        });

        $('.mini-submenu').on('click', function () {
            $(this).next('.list-group').toggle('slide');
            $('.mini-submenu').hide();
        });
    }
}

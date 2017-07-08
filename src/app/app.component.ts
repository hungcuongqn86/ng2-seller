import {Component, OnInit, AfterViewInit} from '@angular/core';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {PublicService} from './public/public.service';
import {Observable} from 'rxjs/Rx';
import {location} from './app.config';

declare const $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

    constructor(public PublicService: PublicService, private translate: TranslateService) {
        translate.addLangs([location]);
        translate.use(location);
    }

    ngOnInit() {
        this.getLocation();
    }

    private getLocation() {
        this.PublicService.getConfig('product.fulfillment.location').subscribe(
            data => {
                // console.log(data);
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    public logout() {
        this.PublicService.http.logout();
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

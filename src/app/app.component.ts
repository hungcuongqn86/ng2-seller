import {Component, OnInit, AfterViewInit} from '@angular/core';
import {PublicService} from './public/public.service';
import {Observable} from 'rxjs/Rx';

declare const $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'app works!';

    constructor(private PublicService: PublicService) {

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

import {Component, AfterViewInit} from '@angular/core';
import {PublicService} from '../public/public.service';

declare const $: any;

@Component({
    selector: 'app-layouts-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements AfterViewInit {
    constructor(public PublicService: PublicService) {
    }

    ngAfterViewInit() {
        const myjs = this;
        $('#slide-submenu').on('click', function () {
            $(this).closest('.list-group').fadeOut('slide', function () {
                $('.mini-submenu').fadeIn();
                myjs.PublicService.showsidebar = false;
            });
        });

        $('.mini-submenu').on('click', function () {
            $(this).next('.list-group').toggle('slide');
            $('.mini-submenu').hide();
            myjs.PublicService.showsidebar = true;
        });
    }
}

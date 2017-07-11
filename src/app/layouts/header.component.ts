import {Component} from '@angular/core';
import {PublicService} from '../public/public.service';

@Component({
    selector: 'app-layouts-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent {
    constructor(public PublicService: PublicService) {
    }

    public logout() {
        this.PublicService.http.logout();
    }
}

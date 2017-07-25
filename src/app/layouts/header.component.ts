import {Component} from '@angular/core';
import {PublicService} from '../public/public.service';
import {DsLib} from '../lib/lib';

@Component({
    selector: 'app-layouts-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent {
    constructor(public PublicService: PublicService) {
    }

    public addCampaign() {
        DsLib.addCampaign();
    }

    public logout() {
        this.PublicService.http.logout();
    }
}

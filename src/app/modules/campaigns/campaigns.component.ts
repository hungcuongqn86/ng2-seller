import {Component, OnInit} from '@angular/core';
import {PublicService} from '../../public/public.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-storefronts',
    templateUrl: './campaigns.component.html',
    styleUrls: ['./campaigns.component.css']
})

export class CampaignsComponent implements OnInit {
    constructor(private PublicService: PublicService) {

    }

    ngOnInit() {
        // this.PublicService.startLoad();
    }
}

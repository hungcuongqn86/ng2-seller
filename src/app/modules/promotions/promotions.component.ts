import {Component, OnInit} from '@angular/core';
import {PublicService} from '../../public/public.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-promotions',
    templateUrl: './promotions.component.html',
    styleUrls: ['./promotions.component.css']
})

export class PromotionsComponent implements OnInit {
    constructor(private PublicService: PublicService) {

    }

    ngOnInit() {
        // this.PublicService.startLoad();
    }
}

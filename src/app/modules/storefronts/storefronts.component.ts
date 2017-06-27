import {Component, OnInit} from '@angular/core';
import {PublicService} from '../../public/public.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-storefronts',
    templateUrl: './storefronts.component.html',
    styleUrls: ['./storefronts.component.css']
})

export class StorefrontsComponent implements OnInit {
    constructor(private PublicService: PublicService) {

    }

    ngOnInit() {
        this.PublicService.startLoad();
    }
}

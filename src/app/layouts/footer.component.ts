import {Component} from '@angular/core';
import {PublicService} from '../public/public.service';

@Component({
    selector: 'app-layouts-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})

export class FooterComponent {
    constructor(public PublicService: PublicService) {
    }
}

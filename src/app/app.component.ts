import {Component, OnInit} from '@angular/core';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {PublicService} from './public/public.service';
import {Observable} from 'rxjs/Rx';
import {location} from './app.config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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
}

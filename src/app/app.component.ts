import {Component, OnInit} from '@angular/core';
import {PublicService} from './public/public.service';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app works!';

    constructor(public PublicService: PublicService) {
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
}

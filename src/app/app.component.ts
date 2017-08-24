import {Component} from '@angular/core';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {AppService} from './app.service';
import {PublicService} from './public/public.service';
import {location} from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public PublicService: PublicService, private AppService: AppService, private translate: TranslateService) {
    translate.addLangs([location]);
    translate.use(location);
    Object.keys(this.AppService.svConfig).map((index) => {
      this.PublicService.getConfig(index).subscribe(
        data => {
          this.AppService.svConfig[index] = data;
        }
      );
    });
  }
}

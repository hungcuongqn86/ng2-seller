import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppGuard} from './app.guard.service';
import {HttpClient} from './public/http';
import {PublicService} from './public/public.service';


import {routing} from './app.routing.module';

import {BootstrapModalModule} from 'ng2-bootstrap-modal';
import {AlertComponent} from './public/alert.component';

@NgModule({
    declarations: [
        AppComponent,
        AlertComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        BootstrapModalModule,
        routing
    ],
    providers: [
        AppGuard,
        HttpClient,
        PublicService
    ],
    entryComponents: [
        AlertComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

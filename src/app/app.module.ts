import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppGuard} from './app.guard.service';
import {HttpClient} from './lib/http';
import {PublicService} from './public/public.service';
import {routing} from './app.routing.module';

import {BootstrapModalModule} from 'ng2-bootstrap-modal';
import {AlertComponent} from './public/alert.component';
import {LoadingComponent} from './public/loading.component';

@NgModule({
    declarations: [
        AppComponent,
        AlertComponent,
        LoadingComponent
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
        AlertComponent,
        LoadingComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

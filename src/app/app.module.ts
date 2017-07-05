import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppGuard} from './app.guard.service';
import {HttpClient} from './lib/http';
import {Auth} from './lib/auth';
import {PublicService} from './public/public.service';
import {routing} from './app.routing.module';

import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {BootstrapModalModule} from 'ng2-bootstrap-modal';
import {AlertComponent} from './public/alert.component';
import {LoadingComponent} from './public/loading.component';
import {ProductdfComponent} from './public/productdf.component';

import {AppProductDirective} from './directive/product.directive';
import {ColorDirective} from './directive/color.directive';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateStaticLoader(http, '/assets/i18n', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        AlertComponent,
        LoadingComponent,
        AppProductDirective,
        ColorDirective,
        ProductdfComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        }),
        BootstrapModalModule,
        routing
    ],
    providers: [
        AppGuard,
        HttpClient,
        Auth,
        PublicService
    ],
    entryComponents: [
        AlertComponent,
        LoadingComponent,
        ProductdfComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

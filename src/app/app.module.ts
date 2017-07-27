import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {SidebarComponent} from './layouts/sidebar.component';
import {FooterComponent} from './layouts/footer.component';
import {HeaderComponent} from './layouts/header.component';
import {AppGuard} from './app.guard.service';
import {HttpClient} from './lib/http';
import {Auth} from './lib/auth';
import {PublicService} from './public/public.service';
import {AppService} from './app.service';
import {routing} from './app.routing.module';

import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {ProgressBarModule} from 'ngx-progress-bar';
import {BootstrapModalModule} from 'ng2-bootstrap-modal';
import {AlertComponent} from './public/alert.component';
import {ConfirmComponent} from './public/confirm.component';
import {LoadingComponent} from './public/loading.component';
import {ProductdfComponent} from './public/productdf.component';
import {VariantsComponent} from './public/variants.component';
import {ColorComponent} from './public/color.component';
import {AddproductComponent} from './public/addproduct.component';

import {SharedModule} from './public/shared.module';
import {environment} from '../environments/environment';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateStaticLoader(http, environment.basename + '/assets/i18n', '.json?v=1.0.1');
}

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        FooterComponent,
        HeaderComponent,
        AlertComponent,
        ConfirmComponent,
        LoadingComponent,
        ProductdfComponent,
        VariantsComponent,
        ColorComponent,
        AddproductComponent
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
        ProgressBarModule,
        routing,
        SharedModule.forRoot()
    ],
    providers: [
        AppGuard,
        HttpClient,
        Auth,
        PublicService,
        AppService
    ],
    entryComponents: [
        AlertComponent,
        ConfirmComponent,
        LoadingComponent,
        ProductdfComponent,
        VariantsComponent,
        ColorComponent,
        AddproductComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

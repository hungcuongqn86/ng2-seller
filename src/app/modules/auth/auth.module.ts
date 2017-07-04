import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AuthService} from './auth.service';
import {AuthRoutingModule} from './auth.routing.module';
import {LoginComponent} from './login.component';
import {RegisterComponent} from './register.component';

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, AuthRoutingModule],
    declarations: [
        LoginComponent,
        RegisterComponent
    ],
    exports: [],
    providers: [AuthService]
})
export class AuthModule {
}

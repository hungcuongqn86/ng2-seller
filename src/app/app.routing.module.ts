import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppGuard} from './app.guard.service';

const appRoutes: Routes = [
    {path: '', redirectTo: 'storefronts', pathMatch: 'full'},
    {
        path: 'storefronts',
        loadChildren: './modules/storefronts/storefronts.module#StorefrontsModule',
        canActivate: [AppGuard]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

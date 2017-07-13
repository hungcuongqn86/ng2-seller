import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppGuard} from './app.guard.service';

const appRoutes: Routes = [
    {path: '', redirectTo: 'campaigns', pathMatch: 'full'},
    {path: 'login', redirectTo: 'auth/login', pathMatch: 'full'},
    // {path: 'register', redirectTo: 'auth/register', pathMatch: 'full'},
    {
        path: 'auth',
        loadChildren: './modules/auth/auth.module#AuthModule'
    },
    {
        path: 'storefronts',
        loadChildren: './modules/storefronts/storefronts.module#StorefrontsModule',
        canActivate: [AppGuard]
    },
    {
        path: 'campaigns',
        loadChildren: './modules/campaigns/campaigns.module#CampaignsModule',
        canActivate: [AppGuard]
    },
    {
        path: 'promotions',
        loadChildren: './modules/promotions/promotions.module#PromotionsModule',
        canActivate: [AppGuard]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

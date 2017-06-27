import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CanActivateGuard} from './canactivate.guard.service';
import {DesignComponent} from './design/design.component';
import {PricingComponent} from './pricing/pricing.component';
import {LaunchingComponent} from './launching/launching.component';

const appRoutes: Routes = [
    {path: '', redirectTo: 'design', pathMatch: 'full'},
    {path: 'design', component: DesignComponent, canActivate: [CanActivateGuard]},
    {path: 'design/:id', component: DesignComponent, canActivate: [CanActivateGuard]},
    {
        path: 'pricing', component: PricingComponent, canActivate: [CanActivateGuard]
    },
    {
        path: 'launching', component: LaunchingComponent, canActivate: [CanActivateGuard]
    },
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

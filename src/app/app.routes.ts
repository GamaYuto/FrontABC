import { Routes } from '@angular/router';
import { CLIENT_ROUTES } from './clients/clients.routes';

export const APP_ROUTERS: Routes = [
    {path: '', redirectTo:'/clients',pathMatch:'full'},
    {path: 'clients', children: CLIENT_ROUTES},
    
];

import { Routes } from "@angular/router";
import { ClientListComponent } from "./components/client-list/client-list.component";
import { ClientFormComponent } from "./components/client-form/client-form.component";

export const CLIENT_ROUTES: Routes = [
    {path:'', component: ClientListComponent},
    {path:'new', component: ClientFormComponent},
    {path:'edit/:id', component: ClientFormComponent},

]
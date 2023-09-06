import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShedulerMainComponent } from './medisheduler/sheduler.main/sheduler.main.component';

const routes: Routes = [
  { path: 'sheduler', component: ShedulerMainComponent },
  { path: '', redirectTo: '/sheduler', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShedulerMainComponent } from './medisheduler/sheduler.main/sheduler.main.component';
import { ModalAppComponent} from './medisheduler/modal/app/modalapp.component';
import { ModalInfoComponent } from './medisheduler/modal/info/modalinfo.component';
import { ModalYesComponent } from './medisheduler/modal/yes/modalyes.component';
import { ModalDeleteComponent } from './medisheduler/modal/delete/modaldelete.component';

const routes: Routes = [
  { path: 'sheduler', component: ShedulerMainComponent,
    children: [
      {path: 'modalapp', component: ModalAppComponent},
      {path: 'modalinfo', component: ModalInfoComponent},
      {path: 'modalyes', component: ModalYesComponent},
      {path: 'modaldelete', component: ModalDeleteComponent},
    ] },
  { path: '', redirectTo: '/sheduler', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

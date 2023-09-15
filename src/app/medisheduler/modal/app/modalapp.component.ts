import { Component } from '@angular/core';
import { RepositoryDataService } from '../../service/repository.data.service';
import { UserModel } from '../../model/user.model';
import { CommonService } from '../../shared/common.service';
import { Router } from '@angular/router';
import { AppointmentModel } from '../../model/appointment.model';

@Component({
  selector: 'app-modalapp',
  templateUrl: './modalapp.component.html',
  styleUrls: ['./modalapp.component.scss'],
  styles: [],
})
export class ModalAppComponent {
  public usersData: UserModel[] = [];
  public appExist = false;
  public patientSingle = true;
  public patientsName: string[] = [];
  public intTime = '';
  public patientId = [1, 2];
  public patientChecked!: boolean;
  public modalView = false;
  public modalCreate = false;
  public modalDelete = false;
  public patientNameSelected = '';
  public patientOmsSelected = '';
  private patientDataSelected!: UserModel; 
  private modalDeleteAllowed = false;
  private modalCreateAllowed = false; 
  public patientsData: UserModel[] = [];
  private intervalDate!: Date;
  private resource: any;
  private timerModalYes!: any;
  
  constructor(private repositoryData: RepositoryDataService, private commonService: CommonService,
    private route: Router,) {
    this.appExist = this.commonService.appExist;
    this.patientSingle = this.commonService.patientSingle;
    this.patientsName = this.commonService.patientsName;
    this.intTime = this.commonService.intTime;
    this.modalView = this.commonService.modalView;
    this.modalCreate = this.commonService.modalCreate;
    this.modalDelete = this.commonService.modalDelete;
    this.modalDeleteAllowed = this.commonService.modalDeleteAllowed;
    this.modalCreateAllowed = this.commonService.modalCreateAllowed;
    this.patientsData = this.commonService.patientsData;
    this.intervalDate = new Date(this.commonService.intervalDate);
    this.resource = this.commonService.resource;
  }

  onClickPatientName(i: number) {
    this.modalView = true;
    this.modalDelete = this.modalDeleteAllowed;
    this.patientNameSelected = this.patientsName[i];
    this.patientOmsSelected = this.patientsData[i].userOMS;
    this.patientDataSelected = this.patientsData[i];
  }
  
  clickModalView(event: any) {
    if(this.modalView) {
      this.route.navigateByUrl('/sheduler/modalinfo');
    }
  }

  clickModalCreate(event: any) {
    if(this.modalCreate) {
      let patient = this.commonService.patientSelectedData;
      let int = this.intervalDate;
      this.makeAppointment(patient, int);
    }
  }
  
  clickModalDelete(event: any) {
    if(this.modalDelete) {
      this.route.navigateByUrl('/sheduler/modaldelete');
    }
  }
  
  onModalAppClick(event: any) {
    const div = document.querySelector('#modal-app');
      if(!event.composedPath().includes(div)) {
        this.route.navigateByUrl('/sheduler');
      } 
  }
  
  makeAppointment(patient: UserModel, int: Date) {
    let userId = patient.userId;
    let specId = this.resource.resourceId;
    let maxId = 0;
    let newAppoinment!: AppointmentModel;
    patient.userAppointment.forEach((app: AppointmentModel) => {
      if(app.appId > maxId) {
        maxId = app.appId;
      }
    });
    maxId++;
    newAppoinment = new AppointmentModel(maxId, specId, userId, int);
    this.repositoryData.addUserAppointment(userId, newAppoinment);
    maxId = 0;
    this.resource.resourceAppointment.forEach((app: AppointmentModel) => {
      if(app.appId > maxId) {
        maxId = app.appId;
      }
    });
    maxId++;
    newAppoinment = new AppointmentModel(maxId, specId, userId, int);
    this.repositoryData.addResourceAppointment(specId,newAppoinment);
    this.route.navigateByUrl('/sheduler/modalyes');
    this.timerModalYes = setTimeout(() => {
      this.route.navigateByUrl('/sheduler');
      this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
      this.commonService.emitFilter('filter');
    }, 3000);
    this.commonService.timerModalYes = this.timerModalYes;
  }
  
  onModalYesClick(event: any) {
    this.route.navigateByUrl('/sheduler');
    this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
    this.commonService.emitFilter('filter');
  }
}

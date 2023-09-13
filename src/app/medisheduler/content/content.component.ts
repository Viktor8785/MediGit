import { Component, ViewChild, TemplateRef, EmbeddedViewRef, ViewContainerRef, Input, ChangeDetectorRef } from '@angular/core';
import { RepositoryDataService } from '../service/repository.data.service';
import { CommonService } from '../shared/common.service';
import { Subscription } from 'rxjs';
import { UserModel } from '../model/user.model';
import { AppointmentModel } from '../model/appointment.model';
import { ResourceModel } from '../model/resource.model';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  styles: [
  ]
})
export class ContentComponent {
  @Input() resource!: any;
  @Input() resources!: any;
  @Input() index!: any;
  @ViewChild('dnwork') dnwork!: TemplateRef<any>;
  @ViewChild('holiday') holiday!: TemplateRef<any>;
  @ViewChild('learning') learning!: TemplateRef<any>;
  @ViewChild('documents') documents!: TemplateRef<any>;
  @ViewChild('home') home!: TemplateRef<any>;
  @ViewChild('ill') ill!: TemplateRef<any>;
  @ViewChild('dnapp') dnapp!: TemplateRef<any>;
  @ViewChild('blapp') blapp!: TemplateRef<any>;
  @ViewChild('appointment') appointment!: TemplateRef<any>;
  @ViewChild('isapp') isapp!: TemplateRef<any>;
  @ViewChild('isappquote') isappQuote!: TemplateRef<any>;

  private view!: EmbeddedViewRef<Object>;
  public shedule: string[] = [];
  private appPatientName = '';
  public toolTipText = '';
  public toolTipShow = false;
  public modalAppShow = false;
  public appExist = false;
  public intTime = '';
  public indexFirst = false;
  public indexLast = false;
  private subscr!: Subscription;
  public modalView = false;
  public modalCreate = false;
  public modalDelete = false;
  private intervalDate!: Date;
  public modalYesShow = false;
  public modalInfoShow = false;
  public modalDeleteShow = false;
  private timerModalYes!: any;
  public patientName = '';
  public patientsData: UserModel[] = [];
  public patientsName: string[] = [];
  public patientSingle = true;
  public patientId = [1, 2];
  public patientChecked!: boolean;
  public patientNameSelected = '';
  public patientOmsSelected = '';
  public dateSelected = '';
  private modalDeleteAllowed = false;
  private modalCreateAllowed = false;
  public confirmDelete = false;
  private patientDataSelected!: UserModel;
  private resourceDataSelected!: ResourceModel;
  private patientInQuote: boolean = false;

  constructor(private viewContainerRef: ViewContainerRef, private repositoryData: RepositoryDataService, 
    private commonService: CommonService, private changeDetector: ChangeDetectorRef) {
  }

  deleteAppointment() {
    let patient = this.patientDataSelected;
    let resource = this.resourceDataSelected;
    let userId = this.patientDataSelected.userId;
    let specId = this.resourceDataSelected.resourceId;
    let int = this.intervalDate;
    let patientAppId = 0;
    let resourceAppId = 0;
    patient.userAppointment.forEach((app) => {
      if(app.appDate.getTime() == int.getTime() && app.specId == specId) {
        patientAppId = app.appId;
      }
    });
    resource.resourceAppointment.forEach((app) => {
      if(app.appDate.getTime() == int.getTime() && app.userId == userId) {
        resourceAppId = app.appId;
      }
    });
    this.repositoryData.deleteResourceAppointment(specId, resourceAppId);
    this.repositoryData.deleteUserAppointment(userId, patientAppId);
    this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
    this.commonService.emitFilter('filter');
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
    this.modalAppShow = false;
    
    this.modalYesShow = true;
    this.timerModalYes = setTimeout(() => {
      this.modalYesShow = false;
      this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
      this.commonService.emitFilter('filter');
    }, 3000);
  }
  
  onModalYesClick(event: any) {
    this.modalYesShow = false;
    clearTimeout(this.timerModalYes);
    this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
    this.commonService.emitFilter('filter');
    this.changeDetector.detectChanges();
  }
  
  onModalInfoClick() {
    this.modalInfoShow = false;
  }

  onModalAppClick(event: any) {
    const div = document.querySelector('#modal-app');
    if(this.modalAppShow) {
      if(!event.composedPath().includes(div)) {
        this.modalAppShow = false;
      } 
    }
  }
  
  clickModalView(event: any) {
    if(this.modalView) {
      this.modalAppShow = false;
      this.modalInfoShow = true;
    }
  }

  clickModalCreate(event: any) {
    if(this.modalCreate) {
      let patient = this.commonService.patientSelectedData;
      let int = this.intervalDate;
      this.makeAppointment(patient, int);
    }
  }

  onModalDeleteHrefClick() {
    this.modalDeleteShow = false;
  }
  
  onModalDeleteButtonfClick() {
    this.modalDeleteShow = false;
    this.deleteAppointment();
  }
  
  clickModalDelete(event: any) {
    if(this.modalDelete) {
      this.modalAppShow = false;
      this.modalDeleteShow = true;
    }
  }
  
  makeShedule() {
    const workStart = 8;
    const workEnd = 21;
    const step = this.resource.sheduleStep;
    const intNumber = (workEnd - workStart) * 60 / step;
    let currentShedule = '';
    let currentText = '';
    let currentTime = 0;
    let isShedule = false;
    let controlIntResult = '';
    if(this.changeIntToTime(this.resource.workTimeStart) > workStart * 60) {
      this.shedule.push('Врач не принимает');
    }
    for(let i = 0; i < intNumber; i++) {
      currentTime = workStart * 60 + step * i;
      isShedule = false;
      controlIntResult = this.controlIntQuote(this.resource.shedule[this.resource.date.getDay()].doesNotWork, currentTime, step);
      currentText = 'Врач не работает';
      this.patientInQuote = controlIntPush(controlIntResult, this.shedule, this.patientInQuote);

      controlIntResult = this.controlIntQuote(this.resource.shedule[this.resource.date.getDay()].learning, currentTime, step);
      currentText = 'Обучение';
      this.patientInQuote = controlIntPush(controlIntResult, this.shedule, this.patientInQuote);

      controlIntResult = this.controlIntQuote(this.resource.shedule[this.resource.date.getDay()].documents, currentTime, step);
      currentText = 'Работа с документами';
      this.patientInQuote = controlIntPush(controlIntResult, this.shedule, this.patientInQuote);

      controlIntResult = this.controlIntQuote(this.resource.shedule[this.resource.date.getDay()].homeApp, currentTime, step);
      currentText = 'Прием на дому';
      this.patientInQuote = controlIntPush(controlIntResult, this.shedule, this.patientInQuote);
      
      controlIntResult = this.controlIntApp(this.resource.shedule[this.resource.date.getDay()].appointment, currentTime, step, this.resource.resourceAppointment);
      if(!isShedule) {
        switch(controlIntResult) {
          default:
          case 'Нет':
          break;
          case 'Запись': {
            currentText = this.changeTimeToInt(currentTime);
            if(currentShedule != currentText) {
              currentShedule = currentText;
              this.shedule.push(currentShedule);
            }
          } 
          break;
          case 'Запись 1': {
            currentText = this.changeTimeToInt(currentTime) + ' ' + this.appPatientName;
            if(currentShedule != currentText) {
              currentShedule = currentText;
              this.shedule.push(currentShedule);
            }
          } 
          break;
          case 'Нет записи' : {
            currentText = 'Нет записи';
            if(currentShedule != currentText) {
              currentShedule = currentText;
              this.shedule.push(currentShedule);
            }
          }
          break;
        }
      } else {
        if(controlIntResult == 'Запись 1') {
          currentText = this.changeTimeToInt(currentTime) + ' ' + this.appPatientName + 'quote';
          if(currentShedule != currentText) {
              currentShedule = currentText;
              this.shedule.push(currentShedule);
            }
        }
      }

    }
    if(this.changeIntToTime(this.resource.workTimeEnd) < workEnd * 60) {
      this.shedule.push('Врач не принимает');
    }
    
    function controlIntPush(controlIntResult: string, shedule: string[], patientInQuote: boolean) {
      switch(controlIntResult) {
        default:
        case 'Нет': {
          if(patientInQuote) {
            isShedule = true;
            patientInQuote = false;
          }
        }
        break;
        case 'Квота': {
          isShedule = true;
          patientInQuote = false;
          if(currentShedule != currentText) {
            currentShedule = currentText;
            shedule.push(currentShedule);
          }
        }
        break;
        case 'Нет записи до': {
          isShedule = true;
          patientInQuote = false;
          shedule.push('Нет записи');
          if(currentShedule != currentText) {
            currentShedule = currentText;
            shedule.push(currentShedule);
          }
        }
        break;
        case 'Нет записи после': {
          isShedule = true;
          patientInQuote = false;
          if(currentShedule != currentText) {
            currentShedule = currentText;
            shedule.push(currentShedule);
          }
          shedule.push('Нет записи');
        }
        break;
      }
      return patientInQuote;
    }
  }
  
  controlIntApp(intArray: string[], currentTime: number, step: number, appointment: any[]) {
    let intArrayLength = intArray.length;
    let intStart = 0;
    let intEnd = 0;
    if(!intArrayLength) {
      return 'Нет';
    }
    for(let i = 0; i <= intArrayLength - 2; i+=2) {
      intStart = this.changeIntToTime(intArray[i]);
      intEnd = this.changeIntToTime(intArray[i + 1]);
      if(intStart <= currentTime && intEnd >= currentTime + step) {
        if(appointment.length) {
          let appPatientNameCurrent: string[] = [];
          let k = 0;
          for( let j = 0; j < appointment.length; j++) {
            if(this.compareDates(appointment[j].appDate, this.resource.date, currentTime)) {
              appPatientNameCurrent[k] = this.findPatient(appointment[j].userId);
              k++;
            }
          }
          if(k == 1) {
            this.appPatientName = appPatientNameCurrent[0];
            if(this.appPatientName.length > 14) {
              this.appPatientName = appPatientNameCurrent[0].slice(0, 13) + "\u2026";
            }
            return 'Запись 1'
          }
          if(k >= 2) {
            this.appPatientName = appPatientNameCurrent[0].slice(0, 5) + "\u2026" + ' ' + appPatientNameCurrent[1].slice(0, 5) + "\u2026";
            return 'Запись 1'
          }
        }
        return 'Запись';
      }
      if(intStart > currentTime && intStart < currentTime + step) {
        return 'Нет записи';
      }
      if(intEnd > currentTime && intEnd < currentTime + step) {
        return 'Нет записи';
      }
    }
    return 'Нет';
  }

  controlIntAppQuote(intArray: string[], currentTime: number, step: number, appointment: any[]) {
    let intArrayLength = intArray.length;
    let intStart = 0;
    let intEnd = 0;
    if(!intArrayLength) {
      return false;
    }
    for(let i = 0; i <= intArrayLength - 2; i+=2) {
      intStart = this.changeIntToTime(intArray[i]);
      intEnd = this.changeIntToTime(intArray[i + 1]);
      if(intStart <= currentTime && intEnd >= currentTime + step) {
        if(appointment.length) {
          let appPatientNameCurrent: string[] = [];
          let k = 0;
          for( let j = 0; j < appointment.length; j++) {
            if(this.compareDates(appointment[j].appDate, this.resource.date, currentTime)) {
              appPatientNameCurrent[k] = this.findPatient(appointment[j].userId);
              return true;
            }
          }
        }
        return false;
      }
    }
    return false;
  }

  controlIntQuote(intArray: string[], currentTime: number, step: number) {
    let intArrayLength = intArray.length;
    let intStart = 0;
    let intEnd = 0;
    let isAppQuote = this.controlIntAppQuote(this.resource.shedule[this.resource.date.getDay()].appointment, currentTime, step, this.resource.resourceAppointment);
    if(!intArrayLength) {
      return 'Нет';
    }
    for(let i = 0; i <= intArrayLength - 2; i+=2) {
      intStart = this.changeIntToTime(intArray[i]);
      intEnd = this.changeIntToTime(intArray[i + 1]);
      if(intStart <= currentTime && intEnd >= currentTime + step) {
        if(isAppQuote) {
          this.patientInQuote = true;
          return 'Нет';
        }
        return 'Квота';
      }
      if(intStart > currentTime && intStart < currentTime + step) {
        return 'Нет записи до';
      }  
      if(intEnd > currentTime && intEnd < currentTime + step) {
        return 'Нет записи после';
      }
    }
    return 'Нет';
  }

  changeIntToTime(int: string): number {
    return Number(int.slice(0, int.indexOf(':'))) * 60 + Number(int.slice(int.indexOf(':') + 1));
  }

  changeTimeToInt(time: number): string {
    let hour = Math.trunc(time / 60).toString();
    let min = (time % 60).toString();
    if(hour.length == 1) {
      hour = '0' + hour;
    }
    if(min.length == 1) {
      min = '0' + min;
    }
    return hour + ':' + min;
  }

  compareDates(date1: Date, date2: Date, time: number) {
    if(date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() && 
      date1.getDate() == date2.getDate() && 
      date1.getHours() == Math.trunc(time / 60) &&
      date1.getMinutes() == time % 60
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  findPatient(userId: string): string {
    let patientName = this.repositoryData.getUser(userId).userName;
    return this.shrinkName(patientName);
  }

  shrinkName(patientName: string): string {
    let name = patientName.slice(0, patientName.indexOf(' '));
    name = name + ' ' + patientName.slice(patientName.indexOf(' ') + 1, patientName.indexOf(' ') + 2) + '.' + ' ';
    name = name + patientName.slice(patientName.lastIndexOf(' ') + 1, patientName.lastIndexOf(' ') + 2) + '.'
    return name;
  }
  
  toolTipContent(event: any) {
    let now = new Date();
    let intDate = this.getIntDate(event);
    if(intDate > now) {
      this.toolTipText = 'Время доступно для записи';
      this.toolTipShow = true;
    } else {
      this.toolTipText = 'Запись на прошедший временной интервал недоступна';
      this.toolTipShow = false;
    }
  }
  
  getIntDate(event: any): Date {
    let resourceCopy = Object.assign({}, this.resource);
    let context = event.target.childNodes[0].textContent;
    resourceCopy.date.setHours(this.getHours(context), this.getMinutes(context));
    let intDate = resourceCopy.date;
    return intDate;
  }
  
  getMinutes(text: string): number {
    return Number(text.slice(3, 5));
  }
  
  getHours(text: string): number {
    return Number(text.slice(0, 2));
  }
  
  onMouseOverApp(event: any) {
    this.toolTipContent(event);
  }
  
  onClickModal(event: any) {
    //console.log(event.target);
  }
  
  isPatientAppointmentAlowed() {
    let patient = this.commonService.patientSelectedData;
    let intStart = this.intervalDate;
    let intEnd = new Date(this.intervalDate);
    intEnd.setMinutes(intEnd.getMinutes() + this.resource.sheduleStep);
    let allowed = true;
    patient.userAppointment.forEach((app) => {
      if(app.appDate >= intStart && app.appDate < intEnd) {
        allowed = false;
      }
    });
    return allowed;
  }
 
  isCreateIntervalAllowed(event: any): boolean {
    let now = new Date();
    now.setMinutes(now.getMinutes() + this.resource.sheduleStep);
    let intDate = this.intervalDate;
    if(intDate > now) {
      return true;
    } else {
      return false;
    }
  }
  
  onClickAppointment(event: any) {
    this.modalAppShow = true;
    this.modalView = false;
    this.modalDelete = false;
    this.intervalDate = new Date(this.getIntDate(event));
    this.intervalDate.setSeconds(0);
    this.intervalDate.setMilliseconds(0);
    this.modalCreate = this.isCreateIntervalAllowed(event) && !this.commonService.patientDisabled && this.isPatientAppointmentAlowed();
    this.appExist = false;
    this.intTime = event.target.childNodes[0].textContent + ' - ' + this.makeInterval(event.target.childNodes[0].textContent);
  }

  makeInterval(int: string): string {
    let hours = this.getHours(int);
    let minutes = this.getMinutes(int);
    let step = this.resource.sheduleStep;
    let hoursString = '';
    let minutesString = '';
    minutes = minutes + step;
    if((minutes) == 60) {
      hours += 1;
      minutes = 0;
    }
    hoursString = hours.toString();
    if(hoursString.length == 1) {
      hoursString = '0' + hoursString;
    }
    minutesString = minutes.toString();
    if(minutesString.length == 1) {
      minutesString = '0' + minutesString;
    }
    return hoursString + ':' + minutesString;
  }
  
  onClickPatientName(i: number) {
    this.modalView = true;
    this.modalDelete = this.modalDeleteAllowed;
    this.patientNameSelected = this.patientsName[i];
    this.patientOmsSelected = this.patientsData[i].userOMS;
    this.patientDataSelected = this.patientsData[i];
  }
  
  onClickPatient(event: any, createAllowed: boolean) {
    this.intervalDate = new Date(this.getIntDate(event));
    this.intervalDate.setSeconds(0);
    this.intervalDate.setMilliseconds(0);
    this.resourceDataSelected = this.resource;
    let patients = this.checkNumberOfPatients();
    this.patientsName = [];
    this.patientsData = [];
    patients.forEach((patient) => {
      let user = this.repositoryData.getUser(patient);
      this.patientsData.push(user);
      this.patientsName.push(this.findPatient(patient));
    });
    this.patientSingle = true;
    this.patientDataSelected = this.patientsData[0];
    this.patientNameSelected = this.patientsName[0];
    this.patientOmsSelected = this.patientsData[0].userOMS;
    this.dateSelected = this.formatDateToString(this.resource.date);
    this.modalView = true;
    this.modalDeleteAllowed = this.isCreateIntervalAllowed(event);
    if(createAllowed) {
      this.modalCreateAllowed = this.isCreateIntervalAllowed(event) && !this.commonService.patientDisabled && this.isPatientAppointmentAlowed();
    } else {
      this.modalCreateAllowed = false;
    }
    this.modalDelete = this.modalDeleteAllowed;
    this.modalCreate = this.modalCreateAllowed;
    if(this.patientsName.length > 1) {
      this.patientSingle = false;
      this.modalView = false;
      this.modalDelete = false;
      this.modalCreate = false;
    }
    this.modalAppShow = true;
    this.appExist = true;
  }

  formatDateToString(date: Date): string {
    let value = '';
    let day = date.getDate().toString();
    if(day.length == 1) {
      day = '0' + day;
    }
    let month = (date.getMonth() + 1).toString();
    if(month.length == 1) {
      month = '0' + month;
    }
    value = day + '.' + month + '.' +
    date.getFullYear().toString();
    return value;
  }
  
  checkNumberOfPatients() {
    let patients: string[] = [];
    let intStart = new Date(this.intervalDate);
    let intEnd = new Date(this.intervalDate);
    intEnd.setMinutes(intEnd.getMinutes() + this.resource.sheduleStep);
    this.resource.resourceAppointment.forEach((app: AppointmentModel) => {
      if(app.appDate >= intStart && app.appDate < intEnd) {
        patients.push(app.userId);
      }
    });
    return patients;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.makeShedule();
      this.shedule.forEach((item) => {
        switch(item) {
          default: {
            if(item.length > 5) {
              if(item.includes('quote')) {
                let itemSliced = item.slice(0, item.indexOf('quote'));
                this.view = this.viewContainerRef.createEmbeddedView(this.isappQuote);
                this.view.rootNodes[0].textContent = itemSliced;
              } else {
                this.view = this.viewContainerRef.createEmbeddedView(this.isapp);
                this.view.rootNodes[0].textContent = item;
              }
            } else {
              this.view = this.viewContainerRef.createEmbeddedView(this.appointment);
              this.view.rootNodes[0].textContent = item;
            }
          }
          break;
          case 'Врач не принимает': {
            this.view = this.viewContainerRef.createEmbeddedView(this.dnapp);
          }
          break;
          case 'Врач не работает': {
            this.view = this.viewContainerRef.createEmbeddedView(this.dnwork);
          }
          break;
          case 'Обучение': {
            this.view = this.viewContainerRef.createEmbeddedView(this.learning);
          }
          break;
          case 'Работа с документами': {
            this.view = this.viewContainerRef.createEmbeddedView(this.documents);
          }
          break;
          case 'Прием на дому': {
            this.view = this.viewContainerRef.createEmbeddedView(this.home);
          }
          break;
          case 'Нет записи': {
            this.view = this.viewContainerRef.createEmbeddedView(this.blapp);
          }
          break;
        }
      })
    }, 0);
  }
  
  ngOnDestroy() {
    if(this.subscr) {
      this.subscr.unsubscribe();
    }
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { RepositoryDataService } from '../service/repository.data.service';
import { ResourceModel } from '../model/resource.model';
import { CommonService } from '../shared/common.service';
import { ResourcesNameModel } from '../model/resourcesName.model';
import { UserModel } from '../model/user.model';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ruLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import { DatepickerDateTooltipText } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  styles: [
  ]
})
export class ResourcesComponent {

  public buttonIndex = 0;
  public button0 = true;
  public button1 = false;
  public resources: ResourceModel[];
  public resourcesName: ResourcesNameModel[] = [];
  public resourcesNameCopy: ResourcesNameModel[] = [];
  public resourcesNameList: ResourcesNameModel[] = [];
  public resourcesNameSearch: string[] = [];
  public resourceSelected: string = '';
  public resourcesChecked = 0;
  private specName = new Set();
  public patients: UserModel[];
  public patientNameSearch: string[] = [];
  public patientSelected: string = '';
  public patientSelectedData!: UserModel;
  public patientName: string = '';
  public patientBirthday: string = '';
  public patientOms: string = '';
  public patientActive = false;
  public patientDisabled = true;
  public currentDate: Date|undefined  = undefined;
  public currentDateShown = '';
  public minDate = new Date();
  public maxDate = new Date();
  public resourceDisabled = true;
  public dateCustomClasses: DatepickerDateCustomClasses[] = [];
  public dateToolTipText: DatepickerDateTooltipText[] = [];
  public datepickerShow = false;
  private changedDate!: Date;
  public dateEntryForm!: FormGroup;
  @ViewChild('resourcesList') resourcesList!: ElementRef; 
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker?: BsDatepickerDirective;

  constructor(private repositoryData: RepositoryDataService, private commonService: CommonService, private localeService: BsLocaleService) {
    this.dateEntryForm = new FormGroup({
      dateInput: new FormControl('', []),
    });
    this.minDate.setDate(this.minDate.getDate());
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
    this.patients = this.repositoryData.getUsers();
    this.patients.forEach((patient: UserModel) => {
      this.patientNameSearch.push(this.makePatientName(patient));
    });
    this.resources = repositoryData.getResources();
    this.resources.forEach((resource) => {
      this.resourcesName.push({spec: resource.resourceSpec, specId: resource.resourceId, specName: resource.resourceName, checked: false});
      this.resourcesNameSearch.push(resource.resourceName);
      this.specName.add(resource.resourceSpec);
    });
    this.resourcesName.sort((a: ResourcesNameModel, b: ResourcesNameModel) => a.specName.localeCompare(b.specName));
    this.specName.forEach((spec) => {
      this.resourcesNameCopy.push({spec: spec as string, specId: '-1', specName: spec as string, checked: false});
      this.resourcesName.forEach((resource) => {
        if(resource.spec == spec) {
          this.resourcesNameCopy.push({spec: resource.spec, specId: resource.specId, specName: resource.specName, checked: false});
        }
      });
    });
    this.resourcesNameCopy.sort((a: ResourcesNameModel, b: ResourcesNameModel) => a.spec.localeCompare(b.spec));
    this.resourcesNameList = this.resourcesNameCopy;
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
 
  onDateValueChanged(value: Date) {
    this.changedDate = value;
  }
  
  clickCancelButton() {
    this.datepickerShow = false;
  }
  
  clickOkButton() {
    this.currentDate = this.changedDate;
    this.currentDateShown = this.formatDateToString(this.currentDate);
    this.datepickerShow = false;
    this.commonService.startDate = this.currentDate;
    this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
    this.commonService.emitFilter('filter');
  }

  showDatepicker() {
    this.datepickerShow = true;
  }

  makeAppointmentAbleDates() {
    let resourcesIdChecked: string[] = this.commonService.resources;
    let resourcesChecked: ResourceModel[] = [];
    resourcesIdChecked.forEach((id) => {
      this.resources.forEach((resource) => {
        if(resource.resourceId == id) {
          resourcesChecked.push(resource);
        }
      });
    });
    let now = new Date();
    let dateCurrent = new Date();
    let isAble = false;
    this.dateCustomClasses = [];
    for(let i = 0; i < 14; i++) {
      dateCurrent = new Date();
      dateCurrent.setDate(now.getDate() + i);
      isAble = false;
      resourcesChecked.forEach((resource) => {
        if(resource.workDuration >= i && !isAble) {
          let app = resource.shedule[dateCurrent.getDay()].appointment;
          if(app.length) {
            isAble = true;
            this.dateCustomClasses.push({date: dateCurrent, classes: ['fst-italic', 'fw-bold', 'fs-6']});
            this.dateToolTipText.push({date: dateCurrent, tooltipText: 'Возможна запись'})
          }
        }
      });
      if(!isAble) {
        this.dateCustomClasses.push({date: dateCurrent, classes: ['fs-6']});
      }
    }
  }
  
  makeCustomDates() {
    this.dateCustomClasses.push({date: new Date(), classes: ['bg-primary']});
    for(let i = 1; i <= 14; i++) {
      let dateCurrent = new Date();
      dateCurrent.setDate(dateCurrent.getDate() + i);
      this.dateCustomClasses.push({date: dateCurrent, classes: ['bg-light']});
    }
  }
  
  exitPatient() {
    this.patientActive = false;
    this.patientDisabled = true;
    this.commonService.patientDisabled = true;
  }

  selectPatient() {
    let oms = this.patientSelected.slice(this.patientSelected.indexOf(',') + 3);
    this.patients.forEach((patient) => {
      if(patient.userOMS == oms) {
        this.patientSelectedData = patient;
        this.commonService.patientSelectedData = patient;
        this.patientName = patient.userName + ',';
        let day = patient.userBirthDate.getDate().toString();
        if(day.length == 1) {
          day = '0' + day;
        }
        let month = (patient.userBirthDate.getMonth() + 1).toString();
        if(month.length == 1) {
          month = '0' + month;
        }
        this.patientBirthday = day + '.' + month + '.' +
        patient.userBirthDate.getFullYear().toString() + ' г.р.'
        this.patientOms = 'Полис ОМС: ' + patient.userOMS;
      }
    });
    this.patientSelected = '';
    this.patientActive = true;
    this.patientDisabled = false;
    this.commonService.patientDisabled = false;
  }
  
  makePatientName(patient: UserModel) {
    return this.shrinkName(patient.userName) + ', \n' + patient.userOMS;
  }

  shrinkName(patientName: string): string {
    let name = patientName.slice(0, patientName.indexOf(' '));
    name = name + ' ' + patientName.slice(patientName.indexOf(' ') + 1, patientName.indexOf(' ') + 2) + '.' + ' ';
    name = name + patientName.slice(patientName.lastIndexOf(' ') + 1, patientName.lastIndexOf(' ') + 2) + '.'
    return name;
  }

  scrollToIndex(index: number) {
    this.resourcesList.nativeElement.scrollTop = 0;
    this.resourcesList.nativeElement.scrollTop += 41 * index;
  }
  
  deleteSearchName() {
    this.resourceSelected = '';
  }
  
  selectResource() {
    this.resourcesNameList.forEach((resource, index) => {
      if(resource.specName == this.resourceSelected) {
        resource.checked = true;
        this.scrollToIndex(index);
        this.makeResourcesForFilter();
        this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
        this.commonService.emitFilter('filter');
        return;
      }
    });
  }
  
  checkAll() {
    this.resourcesNameList.forEach((name) => {
      name.checked = true;
    });
    this.makeResourcesForFilter();
    this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
    this.commonService.emitFilter('filter');
  }
  
  unCheckAll() {
    this.resourcesNameList.forEach((name) => {
      name.checked = false;
    });
    this.makeResourcesForFilter();
    this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
    this.commonService.emitFilter('filter');
  }

  toggleButtonIndex0(evt: any) {
    this.buttonIndex = 0;
    this.button0 = true;
    this.button1 = false;
    this.resourcesNameCopy.forEach((resource) => {
      resource.checked = this.resourcesNameList.find((res) => res.specId == resource.specId)?.checked as boolean;
      if(Number(resource.specId) <0 ) {
        resource.checked = this.checkSpecOffAll(resource.spec);
      }
    });
    this.resourcesNameList = this.resourcesNameCopy;
  }

  toggleButtonIndex1(evt: any) {
    this.buttonIndex = 1;
    this.button0 = false;
    this.button1 = true;
    this.resourcesName.forEach((resource) => {
      resource.checked = this.resourcesNameList.find((res) => res.specId == resource.specId)?.checked as boolean;
    });
    this.resourcesNameList = this.resourcesName;
  } 
  
  checkSpecOffAll(spec: string): boolean {
    let checked = true;
    this.resourcesNameList.filter((resource) => resource.spec == spec).forEach((resource) => {
      if(!resource.checked) {
        checked = false;
      }
    });
    return checked;
  }
  
  makeTextBold(resource: ResourcesNameModel) {
    if(Number(resource.specId) < 0) {
      return true;
    }
    return false;
  }

  makeShift(resource: ResourcesNameModel) {
    if(Number(resource.specId) < 0) {
      return true;
    }
    return false;
  }
  
  makeCheckAllOfSpec(resource: ResourcesNameModel) {
    this.resourcesNameList.forEach((name) => {
      if(name.spec == resource.spec) {
        if(resource.checked) {
          name.checked = true;
        } else {
          name.checked = false;
        }
      }
    });
  }

  makeResourcesForFilter() {
    this.commonService.resources = [];  
    this.resourcesChecked = 0;
    this.resourcesNameList.forEach((resource) => {
      if(resource.checked && Number(resource.specId) >= 0) {
        this.commonService.resources.push(resource.specId);
        this.resourcesChecked++;
      }
    });
    if(this.resourcesChecked) {
      if(this.currentDate === undefined) {
        this.currentDate = new Date();
        this.commonService.startDate = this.currentDate;
        this.currentDateShown = this.formatDateToString(this.currentDate);
        
      }
      this.resourceDisabled = false;
      this.makeAppointmentAbleDates();

    } else {
      this.currentDate = undefined;
      this.currentDateShown = '';
      this.resourceDisabled = true;
    }
  }

  checkboxClick(resource: ResourcesNameModel) {
    if(resource.checked) {
      resource.checked = false;
    } else {
      resource.checked = true;
    }
    if(Number(resource.specId) < 0) {
      this.makeCheckAllOfSpec(resource);
    }
    this.makeResourcesForFilter();
    this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
    this.commonService.emitFilter('filter');
  }
}

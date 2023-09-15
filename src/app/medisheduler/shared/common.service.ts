import { Injectable } from '@angular/core';
import {EventEmitter} from '@angular/core';
import { UserModel } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
 
  public filter: EventEmitter<string> = new EventEmitter(true);
  public modal: EventEmitter<boolean> = new EventEmitter(true);
  public modalYes: EventEmitter<boolean> = new EventEmitter(true);
  public modalDel: EventEmitter<boolean> = new EventEmitter(true);
  public dayDuration = 1;  
  public resources: string[] = [];
  public resource: any;
  public startDate: Date = new Date();
  public resourceToggle = 0;
  public patientDisabled = true;
  public patientSelectedData!: UserModel;
  public patientNameSelected = '';
  public patientOmsSelected = '';
  public dateSelected = '';
  public appExist = false;
  public patientSingle = true;
  public patientsName: string[] = [];
  public intTime = '';
  public patientId = [1, 2];
  public patientChecked!: boolean;
  public modalView = false;
  public modalCreate = false;
  public modalDelete = false;  
  public modalDeleteAllowed = false;
  public modalCreateAllowed = false;
  public patientsData: UserModel[] = [];
  public intervalDate!: Date;
  public timerModalYes!: any;
  public patientDataSelected!: UserModel;

  constructor() { }

  emitFilter(value: string) {
    this.filter.emit(value);
  }

  getFilter() {
    return this.filter;
  }
  
}

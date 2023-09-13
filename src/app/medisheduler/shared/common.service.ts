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
  public modalShow = false;
  public modalYesShow = false;
  public modalDelShow = false;
  public startDate: Date = new Date();
  public resourceToggle = 0;
  public patientDisabled = true;
  public patientSelectedData!: UserModel;

  constructor() { }

  emitFilter(value: string) {
    this.filter.emit(value);
  }

  getFilter() {
    return this.filter;
  }
  
  emitModal(value: boolean) {
    this.modal.emit(value);
  }

  getModal() {
    return this.modal;
  }
 
  emitModalYes(value: boolean) {
    this.modalYes.emit(value);
  }

  getModalYes() {
    return this.modalYes;
  }

  emitModalDel(value: boolean) {
    this.modalDel.emit(value);
  }

  getModalDel() {
    return this.modalDel;
  }
}

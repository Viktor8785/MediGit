import { Injectable } from '@angular/core';
import {EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
 
  public filter: EventEmitter<string> = new EventEmitter(true);
  public dayDuration = 1;  
  public resources: string[] = [];
  //public resources: string[] = ['1','2','3','4','5'];
  public startDate: Date = new Date();
  public resourceToggle = 0;

  constructor() { }

  emitFilter(value: string) {
    this.filter.emit(value);
  }

  getFilter() {
    return this.filter;
  }
 
}

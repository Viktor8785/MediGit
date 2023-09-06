import { Component, ViewChild, TemplateRef, EmbeddedViewRef, ViewContainerRef, Input } from '@angular/core';
import { RepositoryDataService } from '../../repository.data.service';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  styles: [
  ]
})
export class ContentComponent {
  @Input() resource!: any;
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
  private view!: EmbeddedViewRef<Object>;
  public shedule: string[] = [];
  private appPatientName = '';
  constructor(private viewContainerRef: ViewContainerRef, private repositoryData: RepositoryDataService) {
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
      controlIntPush(controlIntResult, this.shedule);

      controlIntResult = this.controlIntQuote(this.resource.shedule[this.resource.date.getDay()].learning, currentTime, step);
      currentText = 'Обучение';
      controlIntPush(controlIntResult, this.shedule);

      controlIntResult = this.controlIntQuote(this.resource.shedule[this.resource.date.getDay()].documents, currentTime, step);
      currentText = 'Работа с документами';
      controlIntPush(controlIntResult, this.shedule);

      controlIntResult = this.controlIntQuote(this.resource.shedule[this.resource.date.getDay()].homeApp, currentTime, step);
      currentText = 'Прием на дому';
      controlIntPush(controlIntResult, this.shedule);
      
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
      };
    }
    if(this.changeIntToTime(this.resource.workTimeEnd) < workEnd * 60) {
      this.shedule.push('Врач не принимает');
    }
    
    function controlIntPush(controlIntResult: string, shedule: string[]) {
      switch(controlIntResult) {
        default:
        case 'Нет':
        break;
        case 'Квота': {
          isShedule = true;
          if(currentShedule != currentText) {
            currentShedule = currentText;
            shedule.push(currentShedule);
          }
        }
        break;
        case 'Нет записи до': {
          isShedule = true;
          shedule.push('Нет записи');
          if(currentShedule != currentText) {
            currentShedule = currentText;
            shedule.push(currentShedule);
          }
        }
        break;
        case 'Нет записи после': {
          isShedule = true;
          if(currentShedule != currentText) {
            currentShedule = currentText;
            shedule.push(currentShedule);
          }
          shedule.push('Нет записи');
        }
        break;
      }
    }
    console.log(this.shedule);
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
            if(this.compareDates(appointment[j].appDate,this.resource.date, currentTime)) {
              appPatientNameCurrent[k] = this.findPatient(appointment[j].userId);
              k++;
            }
          }
          if(k == 1) {
            this.appPatientName = appPatientNameCurrent[0];
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

  controlIntQuote(intArray: string[], currentTime: number, step: number) {
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
  
  onClick(event: any) {
    console.log('click');
  }

  ngAfterViewInit() {
    this.makeShedule();
    this.shedule.forEach((item) => {
      switch(item) {
        default: {
          if(item.length > 5) {
            this.view = this.viewContainerRef.createEmbeddedView(this.isapp);
            this.view.rootNodes[0].textContent = item;
          } else {
            this.view = this.viewContainerRef.createEmbeddedView(this.appointment);
            //console.log(this.isapp);
            //console.log(this.view);
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
    //this.shedulerHeads.forEach((head) => {
    //  let headHeight = head.nativeElement.clientHeight;
    //  console.log(headHeight);
    //});
  }
}

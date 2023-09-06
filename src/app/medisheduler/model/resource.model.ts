import {AppointmentModel} from './appointment.model';

export class ResourceModel {

    constructor(
        public resourceId: string,
        public resourceName: string,
        public resourceSpec: string,
        public resourceHospital: string,
        public workTimeStart: string,
        public workTimeEnd: string,
        public workDuration: number,
        public sheduleStep: number,
        public shedule: 
            {
                day: number,
                work: boolean,
                appointment: string[],
                doesNotWork: string[],
                holiday: boolean,
                learning: string[],
                documents: string[],
                homeApp: string[],
                ill: boolean, 
            }[],
        public resourceAppointment: Array<AppointmentModel>,
    ) {}
}

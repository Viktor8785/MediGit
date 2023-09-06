import {AppointmentModel} from './appointment.model';

export class UserModel {

    constructor(
        public userId: string,
        public userName: string,
        public userBirthDate: Date,
        public userOMS: string,
        public userAppointment: Array<AppointmentModel>,
    ) {}
}

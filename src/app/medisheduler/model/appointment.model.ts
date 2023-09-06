export class AppointmentModel {

    constructor(
        public appId: number,
        public specId: string,
        public userId: string,
        public appDate: Date,
    ) {}
}

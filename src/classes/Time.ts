export class Time {
    constructor() { }
    static getCurrent() {
        const day = new Date().getDate().toString().padStart(2, '0');;
        const month = new Date().getMonth().toString().padStart(2, '0');;
        const year = new Date().getFullYear().toString();
        return day + month + year
    }

}
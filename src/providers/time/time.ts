import { Injectable } from '@angular/core';

@Injectable()
export class TimeProvider {

  date: Date;

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months = [
    {
      id: 1,
      name: 'January'
    },
    {
      id: 2,
      name: 'February'
    },
    {
      id: 3,
      name: 'March'
    },
    {
      id: 4,
      name: 'April'
    },
    {
      id: 5,
      name: 'May'
    },
    {
      id: 6,
      name: 'June'
    },
    {
      id: 7,
      name: 'July'
    },
    {
      id: 8,
      name: 'August'
    },
    {
      id: 9,
      name: 'September'
    },
    {
      id: 10,
      name: 'October'
    },
    {
      id: 11,
      name: 'November'
    },
    {
      id: 12,
      name: 'December'
    }
  ];
  dayInMillies: number;
  
  constructor() {
    this.dayInMillies = 24 * 60 * 60 * 1000; // day in milliseconds
    this.init();
  }
  
  private init() {
    this.date = new Date();
  }

  getTimezoneOffsetInMillies() {
    let t;
    t = this.date.getTimezoneOffset(); // in minutes
    t = t * 60 * 1000; // in milli seconds
    return t;
  }

  getDay(t: number) {
    let d = new Date(t);
    return this.days[d.getDay()];
  }

  getDate(t: number) {
    let d = new Date(t);
    return d.getDate();
  }

  getMonth(t: number) {
    let d = new Date(t);
    return this.months[d.getMonth()];
  }

  getMonths() {
    return this.months;
  }

  getYear(t: number) {
    let d = new Date(t);
    return d.getFullYear();
  }

  getStartTimeOfDay(t: number) {
    let sTime = t;
    sTime = Math.floor(sTime / this.dayInMillies) * this.dayInMillies;
    sTime = sTime + this.getTimezoneOffsetInMillies(); // day end complete wrt IST

    // console.log(" > Calculated start time:", new Date(sTime));
    return(sTime);
  }

  getEndTimeOfDay(t: number) {
    let eTime = t;
    eTime = Math.ceil(eTime / this.dayInMillies) * this.dayInMillies;
    eTime = eTime + this.getTimezoneOffsetInMillies(); // day end complete wrt IST

    // console.log(" > Calculated end time:", new Date(eTime));
    return(eTime);
  }

  getStartTimeOfMonth(t: number) {
    let sTime;
    sTime = this.getEndTimeOfDay(t);
    sTime = sTime - ((new Date(t).getDate()) * this.dayInMillies);

    // console.log(" > Calculated start time of month:", new Date(sTime));
    return(sTime);
  }

  getEndTimeOfMonth(t: number) {
    let sTime, eTime, d;
    d = new Date(t);
    sTime = this.getStartTimeOfMonth(t);
    eTime = sTime + (this.getDaysInMonth(d.getYear(), d.getMonth()) * this.dayInMillies);

    // console.log(" > Calculated end time of month:", new Date(eTime));
    return(eTime);
  }

  getDaysInMonth(y: number, m: number) {
    let d = new Date(y, m + 1, 0);
    return d.getDate();
  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class UtilitiesProvider {

  constructor() {
  }

  getTimezoneOffsetInMillies() {
    let t: any;
    t = new Date();
    t = t.getTimezoneOffset(); // in minutes
    t = t * 60 * 1000; // in milli seconds
    return t;
  }

}

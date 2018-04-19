import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UpsertPage } from '../upsert/upsert';
import { AnalysePage } from '../analyse/analyse';
import { DatabaseProvider } from '../../providers/database/database';
import { TimeProvider } from '../../providers/time/time';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // time: number;
  // startTime: number;
  // endTime: number;

  months: any;

  upsert = UpsertPage;
  analyse = AnalysePage

  constructor(
    public navCtrl: NavController,
    public db: DatabaseProvider,
    public timeCtrl: TimeProvider
  ) {
    // this.time = new Date().getTime();
    // this.init();
  }

  ionViewDidLoad() {
    // this.time = new Date().getTime();
    this.init();
  }

  ionViewWillEnter() {
    // this.time = new Date().getTime();
    this.init();
  }

  private init() {
    let t = new Date();
    // this.startTime = this.timeCtrl.getStartTimeOfMonth(this.time);
    // this.endTime = this.timeCtrl.getEndTimeOfMonth(this.time);

    this.months = this.timeCtrl.getMonths();
    this.months = this.months.slice(0, t.getMonth() + 1);
    this.months.reverse();
  }

  goto (page: string) {
    if (page === "upsert") {
      this.navCtrl.push(this.upsert);
    }
  }
}

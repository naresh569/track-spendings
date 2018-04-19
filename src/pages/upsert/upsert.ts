import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { TimeProvider } from '../../providers/time/time';
import { Events } from 'ionic-angular';


@Component({
  selector: 'page-upsert',
  templateUrl: 'upsert.html'
})
export class UpsertPage {

  id: number;
  subject: string;
  category: string;
  amount: number;
  time: number;
  description: string;

  displayTime: string;

  spendingCategories: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider,
    public alertCtrl: AlertController,
    public timeCtrl: TimeProvider,
    public events: Events
  ) {
    let record = this.navParams.get('record');
    if (record) {
      this.id = record.id;
      this.subject = record.subject;
      this.category = record.category;
      this.amount = record.amount;
      this.time = record.time;
      this.time = record.time;
      this.description = record.description;
    }

    if (!this.time) {
      this.time = new Date().getTime();
    }

    this.setDisplayTime();
    this.getAllSpendingCategories();
  }

  validate() {
    if (!this.subject || !this.category || !this.amount || !this.time) {
      return false;
    }
    return true;
  }

  upsert() {
    if (!this.validate()) {
      return;
    }
    if (this.id) {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.db.addSpending({
      subject: this.subject,
      category: this.category,
      amount: this.amount,
      time: this.time,
      description: this.description
    })
    .then(() => {
      let alert = this.alertCtrl.create({
        title: 'SUCCESS',
        message: 'Your spending added successfully',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
    });
  }

  edit() {
    this.db.editSpending({
      id: this.id,
      subject: this.subject,
      category: this.category,
      amount: this.amount,
      time: this.time,
      description: this.description
    })
    .then(() => {
      let alert = this.alertCtrl.create({
        title: 'SUCCESS',
        message: 'Your spending edited successfully',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              let setRecord = this.navParams.get('setRecord');
              if (!setRecord) {
                console.log(" > ERROR: Callback - serRecord not found.");
                return;
              }
              setRecord({
                id: this.id,
                subject: this.subject,
                category: this.category,
                amount: this.amount,
                time: this.time,
                description: this.description
              });
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
    });
  }

  setDisplayTime() {
    let t;
    t = this.time - this.timeCtrl.getTimezoneOffsetInMillies();
    this.displayTime = new Date(t).toISOString();
  }

  updateTime() {
    let t;
    t = new Date(this.displayTime).getTime();
    t = t + this.timeCtrl.getTimezoneOffsetInMillies();
    this.time = t;
  }

  getAllSpendingCategories() {
    this.db.getDatabaseState()
    .subscribe((state) => {
      if (!state) {
        return;
      }
      this.db.getAllSpendingCategories()
      .then((categories) => {
        this.spendingCategories = categories;
      });
    });
  }

}

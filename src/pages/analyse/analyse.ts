import { Component } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { UpsertPage } from '../upsert/upsert';
import { TimeProvider } from '../../providers/time/time';

@Component({
  selector: 'page-analyse',
  templateUrl: 'analyse.html'
})
export class AnalysePage {

  options: any;

  time: number;
  startTime: number;
  endTime: number;

  day: string;
  date: number;
  month: any;
  year: number;
  
  records:any = [];
  sumSpendings:number = 0;

  showMoreOfRecord: number;
  filterBy: string;
  filterValues = [
    {
      value: "day",
      displayName: "Day"
    },
    {
      value: "month",
      displayName: "Month"
    },
    {
      value: "year",
      displayName: "Year"
    },
  ];

  view: string = "records";

  // Chart related
  public barChartLabels:string[] = [];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = false;
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
        xAxes: [
            {
                display: false
            }
        ]
    }
  };
  public barChartData:any[] = [];
 
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  constructor(
    public db: DatabaseProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public timeCtrl: TimeProvider,
    public navParams: NavParams
  ) {
    
  }

  ionViewDidLoad() {
    console.log(" > Ion View Load Got month:", this.navParams.get('month'));
    let month = this.navParams.get('month');
    this.filterBy = this.filterValues[0].value;
    this.showMoreOfRecord = null;
    
    let t = new Date();
    if (month) {
      t.setMonth(month["id"] - 1);
      console.log(" > Month Details:", t)
    }
    this.time = t.getTime();
    this.init();
  }

  private init() {
    this.startTime = this.timeCtrl.getStartTimeOfMonth(this.time);
    this.endTime = this.timeCtrl.getEndTimeOfMonth(this.time);

    this.day = this.timeCtrl.getDay(this.time);
    this.date = this.timeCtrl.getDate(this.time);
    this.month = this.timeCtrl.getMonth(this.time);
    this.year = this.timeCtrl.getYear(this.time);

    this.db.getDatabaseState()
    .subscribe((state) => {
      if (!state) {
        return;
      }
      this.db.getAllSpendings({
        startTime: this.startTime,
        endTime: this.endTime
      })
      .then((res) => {
        console.log(res);
        this.records = res;
        this.updateView();
      });
    });
  }

  displayMore(record: any) {
    if (this.showMoreOfRecord === record.id) {
      this.showMoreOfRecord = null;
    } else {
      this.showMoreOfRecord = record.id;
    }
  }

  displayActions(record: any) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            this.editRecord(record);
          }
        },
        {
          text: 'Delete',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.deleteRecord(record);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }

  editRecord(record: any) {
    this.navCtrl.push(UpsertPage, {
      record: record,
      setRecord: (r: any) => {
        let index = this.records.indexOf(record);
        this.records[index] = r;
        this.updateView();
      }
    });
  }

  deleteRecord(record: any) {
    let confirm = this.alertCtrl.create({
      title: 'CONFIRM',
      message: 'Do you want to delete this spending?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.db.deleteSpending(record)
            .then(() => {
              let index = this.records.indexOf(record);
              this.records.splice(index, 1);
              this.updateView();
            });
          }
        }
      ]
    });
    
    confirm.present();
  }

  showPopover() {
    console.log(" > barChartType:", this.barChartType);
    if(this.barChartType == "bar") {
      this.barChartType = "line";
    } else {
      this.barChartType = "bar";
    }
  }

  updateView() {
    this.updateSumSpendings();
    this.updateCharts();
  }

  updateSumSpendings() {
    this.sumSpendings = 0;
    this.records.forEach(element => {
      let value = parseInt(element.amount);
      if (value) {
        this.sumSpendings += value;
      }
    });
  }

  updateCharts() {
    let barChartLabels = [];
    let barChartData = [];
    this.records.forEach(record => {
      console.log(" > name:", record.subject, record.amount);
      barChartLabels.push(record.subject);
      barChartData.push(record.amount);
    });
    this.barChartLabels = barChartLabels;
    this.barChartData = [({
      data: barChartData
    })];
  }

  nextDate() {
    this.time = this.time + this.timeCtrl.dayInMillies;
    this.init();
  }

  prevDate() {
    this.time = this.time - this.timeCtrl.dayInMillies;
    this.init();
  }

  switchView() {
    if (this.view === "records") {
      this.view = "chart";
      this.changeGraph();
    } else {
      this.view = "records";
    }
  }

  changeGraph() {
    // console.log(" > barChartType:", this.barChartType);
    if (this.barChartType == "bar") {
      this.barChartType = "line";
    } else {
      this.barChartType = "bar";
    }
  }

}

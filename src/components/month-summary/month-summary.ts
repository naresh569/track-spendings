import { Component, Input, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { TimeProvider } from '../../providers/time/time';
import { AnalysePage } from '../../pages/analyse/analyse';

@Component({
  selector: 'month-summary',
  templateUrl: 'month-summary.html'
})

export class MonthSummaryComponent implements OnInit {

  @Input()
  month: any;

  startTime: number;
  endTime: number;

  displayMonth: string;

  year: number;
  sumSpendings: number = 0;

  spendingCategories: string[] = [];
  sumSpendingsByCategory: any[] = [];
  
  // Chart
  public barChartType:string = 'pie';
  public barChartLegend:boolean = false;
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
 
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  constructor(
    public navCtrl: NavController,
    public db: DatabaseProvider,
    public timeCtrl: TimeProvider,
    public events: Events
  ) {
    this.navCtrl.viewDidEnter.subscribe(() => {
      this.init();
    });
  }

  ngOnInit() {
    console.log(" > month:", this.month);
    this.init();
  }

  init() {
    let t: any = new Date();
    t.setMonth(this.month["id"] - 1);
    t = t.getTime();

    this.startTime = this.timeCtrl.getStartTimeOfMonth(t);
    this.endTime = this.timeCtrl.getEndTimeOfMonth(t);

    this.displayMonth = this.timeCtrl.getMonth(t).name;
    this.year = this.timeCtrl.getYear(t);

    this.db.getDatabaseState()
    .subscribe((state) => {
      if (!state) {
        return;
      }
      this.db.getSumSpendings({
        startTime: this.startTime,
        endTime: this.endTime
      })
      .then((data) => {
        if (data) {
          this.sumSpendings = data;
        }
      });

      this.db.getAllSpendingCategories()
      .then((categories) => {
        this.spendingCategories = categories;
        this.getSpendingsByCategory();
      });
    });
  }

  more() {
    console.log(" > sending month:", this.month)
    this.navCtrl.push(AnalysePage, {
      month: this.month
    });
  }

  getSpendingsByCategory() {
    let sums = [];
    let calls = [];
    this.spendingCategories.forEach((category) => {
      let p = this.db.getSumSpendings({
        startTime: this.startTime,
        endTime: this.endTime,
        category: category
      })
      .then((data) => {
        sums.push(data);
      })
      .catch(() => {
        sums.push(0);
      });
      calls.push(p);
    });

    Promise.all(calls)
    .then(() => {
      this.sumSpendingsByCategory = sums;
    });
  }

  changeChart() {
    if (this.barChartType === 'pie') {
      this.barChartType = 'bar';
    } else {
      this.barChartType = 'pie';
    }
  }
}

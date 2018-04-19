import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(
    public sqlite: SQLite,
    public platform: Platform
  ) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'spendings.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.databaseReady.next(true);
        db.executeSql(`CREATE TABLE IF NOT EXISTS spendings(
          id INTEGER NOT NULL PRIMARY KEY ASC,
          time INT(10),
          subject VARCHAR(50),
          category VARCHAR(20),
          amount VARCHAR(10),
          description VARCHAR(100)
        );`, {}).then(() => {
          // console.log(" > SQL Executed");
        });
      });
    });
  }

  addSpending(record: any) {
    // console.log(" > Adding a spending:", record);
    let data = [record.time, record.subject, record.category, record.amount, record.description];
    return this.database.executeSql(`INSERT INTO spendings (time, subject, category, amount, description) VALUES (?, ?, ?, ?, ?)`, data);
  }

  editSpending(record: any) {
    // console.log(" > Editing a spending:", record);
    let data = [record.time, record.subject, record.category, record.amount, record.description, record.id];
    return this.database.executeSql(`UPDATE spendings SET time = ?, subject = ?, category = ?, amount = ?, description = ? WHERE id = ?`, data);
  }

  deleteSpending(record: any) {
    // console.log(' > Deleting a spending:', record);
    if (!record) {
      return;
    }
    let query = 'DELETE FROM spendings WHERE id = ?;';
    return this.database.executeSql(query, [record.id]);
  }

  getAllSpendings(contraints: any) {
    // console.log(' > Getting all spending..');
    let query = 'SELECT * FROM spendings ';
    if (contraints) {
      if (contraints.startTime && contraints.endTime) {
        query += 'WHERE time >= ' + contraints.startTime + ' AND time < ' + contraints.endTime;
      }
      else if (contraints.startTime) {
        query += 'WHERE time >= ' + contraints.startTime;
      }
      else if (contraints.endTime) {
        query += 'WHERE time < ' + contraints.endTime;
      }
    }
    query += ' ORDER BY time DESC;';
    return this.database.executeSql(query, [])
    .then((data: any) => {
      let records: any = [];
      // console.log(data.rows);
      for(let i = 0; i < data.rows.length; i++) {
        // console.log(' > Record:', data.rows.item(i));
        records.push(data.rows.item(i));
      }
      return records;
    })
    .catch((err) => {
      console.log(" > ERROR: while trying to get records", err);
      return [];
    })
  }

  getAllSpendingCategories() {
    let query = 'SELECT DISTINCT category FROM spendings;';
    return this.database.executeSql(query, [])
    .then((data: any) => {
      let records: any[] = [];
      for(let i = 0; i < data.rows.length; i++) {
        records.push(data.rows.item(i)['category']);
      }
      return records;
    })
    .catch((err) => {
      console.log(" > ERROR: while trying to get records", err);
      return [];
    });
  }

  getSumSpendings(contraints: any) {
    if (!contraints || !contraints.startTime || !contraints.endTime) {
      return;
    }
    let query = 'SELECT SUM(amount) FROM spendings WHERE time >= ? AND time < ?';
    let parameters = [contraints.startTime, contraints.endTime];
    if (contraints.category) {
      query += ' AND category = ?';
      parameters.push(contraints.category);
    }
    query += ';';

    return this.database.executeSql(query, parameters)
    .then((data) => {
      return(data.rows.item(0)['SUM(amount)']);
    })
    .catch((err) => {
      return(0);
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}

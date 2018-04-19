import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  fileName: string = "spendings.txt";
  constructor(
    public file: File,
    public db: DatabaseProvider
  ) {
  }

  export() {
    let data = "";

    let s = "";
    s += "ID\t";
    s += "Time\t";
    s += "Subject\t";
    s += "Category\t";
    s += "Amount\t";
    s += "Description\n";
    data += s;

    let count = 0;
    this.db.getAllSpendings({})
    .then((records) => {
      records.forEach(record => {
        let s = "";
        s += record['id'];
        s += '\t';
        s += record['time'];
        s += '\t';
        s += record['subject'];
        s += '\t';
        s += record['category'];
        s += '\t';
        s += record['amount'];
        s += '\t';
        if (record['description']) {
          record['description'] = record['description'].replace('\t', ';')
          record['description'] = record['description'].replace('\n', ';')
          s += record['description']
        } else {
          s += "";
        }
        data += s;
        count++;
        if (count == records.length) {
          this.exportToFile(data);
        }
        console.log(s);
      });
    });

  }
  
  exportToFile(data: string) {
    this.file.writeFile(this.file.externalDataDirectory, this.fileName, data, { replace: true })
    .then(() => {
      console.log("file created");
    });
  }

  import() {
    this.file.readAsText(this.file.externalDataDirectory, this.fileName)
    .then((data) => {
      console.log("file read");
      // console.log(data);
      let list: any[];
      list = data.split('\n');
      let count = 0;
      list.forEach((record) => {
        count++;
        record = record.split('\t')
        console.log(count, record);
        this.db.addSpending({
          time: record[1],
          subject: record[2],
          category: record[3],
          amount: record[4],
          description: record[5]
        });
      });
    })
  }

}

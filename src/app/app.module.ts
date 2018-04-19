import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { UpsertPage } from '../pages/upsert/upsert';
import { AnalysePage } from '../pages/analyse/analyse';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../providers/database/database';
import { ConfigProvider } from '../providers/config/config';
import { UtilitiesProvider } from '../providers/utilities/utilities';
import { File } from "@ionic-native/file";

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { TimeProvider } from '../providers/time/time';
import { MonthSummaryComponent } from '../components/month-summary/month-summary';
import { SettingsPage } from '../pages/settings/settings';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    UpsertPage,
    AnalysePage,
    SettingsPage,
    MonthSummaryComponent
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms:{
        android: {
          activator: 'none'
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    UpsertPage,
    AnalysePage,
    SettingsPage
  ],
  providers: [
    File,
    SQLite,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    ConfigProvider,
    UtilitiesProvider,
    TimeProvider
  ]
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { EmployeePieChartComponent } from './employee-pie-chart/employee-pie-chart.component';





@NgModule({
  declarations: [AppComponent, EmployeePieChartComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HeaderComponent,
    HttpClientModule,
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }

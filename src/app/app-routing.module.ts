import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeePieChartComponent } from './employee-pie-chart/employee-pie-chart.component';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  { path: '', component: HeaderComponent },
  { path: 'employee-pie-chart/:id', component: EmployeePieChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

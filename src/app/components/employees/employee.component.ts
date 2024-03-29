import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeEditAddComponent } from './employee-edit-add/employee-edit-add.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoreService } from 'src/app/core/core.service';
import { Router } from '@angular/router';

@Component({

  standalone: true,
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
})
export class EmployeeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private snackbar: CoreService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEmployeeList();
  }
  onRowClick(employeeId: string): void {
    // Navigate to the EmployeePieChartComponent with the employeeId parameter
    this.router.navigate(['/employee-pie-chart', employeeId]);
  }
  addEmployeeForm(): void {
    const dialogRef = this.dialog.open(EmployeeEditAddComponent);
    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.getEmployeeList();
        }
      },
    });
  }

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'dob',
    'gender',
    'education',
    'company',
    'salary',
    'edit',
    'delete',
  ];

  dataSource!: MatTableDataSource<any>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEmployeeList(): void {
    this.employeeService.getEmployeeDetails().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => { },
    });
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: (res) => {
        this.snackbar.openSnackBar('Employee Deleted', 'done');
        this.getEmployeeList();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editEmployeeForm(data: any): void {
    const dialogRef = this.dialog.open(EmployeeEditAddComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.getEmployeeList();
        }
      },
    });
  }
}

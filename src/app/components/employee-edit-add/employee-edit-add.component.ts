import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoreService } from 'src/app/core/core.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './employee-edit-add.component.html',
  styleUrls: ['./employee-edit-add.component.css'],
})
export class EmployeeEditAddComponent implements OnInit {
  employeeFrom!: FormGroup;

  EducationList: string[] = [
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<EmployeeEditAddComponent>,
    private snackbar: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.employeeFrom = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      dob: [''],
      gender: [''],
      education: [''],
      company: [''],
      salary: [''],
    });

    this.employeeFrom.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.employeeFrom.valid) {
      if (this.data) {
        this.employeeService
          .updateEmployee(this.data.id, this.employeeFrom.value)
          .subscribe({
            next: (value) => {
              this.dialogRef.close(true);
            },
            error: (err) => {
              console.log(err);
            },
          });
      } else {
        this.employeeService.addEmployee(this.employeeFrom.value).subscribe({
          next: (val: any) => {
            this.snackbar.openSnackBar('Employee Added Successfully', 'done');

            this.dialogRef.close(true);
          },
          error: (err: any) => {
            this.snackbar.openSnackBar(`${err}`, 'error');
            console.log(err);
          },
        });
      }
    }
  }
}

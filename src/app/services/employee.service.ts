import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private dbName = 'EmployeeDB';
  private storeName = 'employees';

  constructor() { }

  // Open IndexedDB database
  private openDatabase(): Observable<IDBDatabase> {
    return from(
      new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);

        request.onupgradeneeded = (event) => {
          const db = (event.target as any).result;
          const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });

          // Ensure an index is created on the 'email' field
          if (!store.indexNames.contains('email')) {
            store.createIndex('email', 'email', { unique: true });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      })
    );
  }

  // Check if email already exists in the database
  private checkEmailExists(email: string, store: IDBObjectStore): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const index = store.index('email'); // Assuming you have an index on the 'email' field

      const request = index.openCursor(IDBKeyRange.only(email));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          // Email already exists
          observer.next(true);
        } else {
          // Email does not exist
          observer.next(false);
        }
        observer.complete();
      };

      request.onerror = () => observer.error('Error checking email existence');
    });
  }

  // Add an employee to the database
  addEmployee(data: any): Observable<any> {
    const email = data.email; // Replace with the actual field name for email

    return this.openDatabase().pipe(
      catchError((error) => throwError('Error connecting to database: ' + error)),
      switchMap((db) => new Observable<void>((observer) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        // Check if email already exists
        this.checkEmailExists(email, store).subscribe((emailExists) => {
          if (emailExists) {
            observer.error('Email already in use!');
          } else {
            // Proceed to add employee if email does not exist
            const request = store.add(data);
            request.onsuccess = () => {
              observer.next();
              observer.complete();
            };

            request.onerror = () => observer.error('Error adding employee');
          }
        });
      }))
    );
  }

  // Get all stored employee details from IndexedDB
  getEmployeeDetails(): Observable<any[]> {
    return this.openDatabase().pipe(
      catchError((error) => throwError('Error opening IndexedDB: ' + error)),
      switchMap((db) => new Observable<any[]>((observer) => {
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);

        const request = store.getAll();

        request.onsuccess = () => {
          observer.next(request.result);
          observer.complete();
        };

        request.onerror = () => observer.error('Error retrieving employees from IndexedDB');
      }))
    );
  }

  // Delete an employee by the auto-incremented Id
  deleteEmployee(id: number): Observable<any> {
    return this.openDatabase().pipe(
      catchError((error) => throwError('Error opening IndexedDB: ' + error)),
      switchMap((db) => new Observable<void>((observer) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        const request = store.delete(id);

        request.onsuccess = () => {
          observer.next();
          observer.complete();
        };

        request.onerror = () => observer.error('Error deleting employee from IndexedDB');
      }))
    );
  }

  // Update employee data in the database
  updateEmployee(id: number, data: any): Observable<any> {
    return this.openDatabase().pipe(
      catchError((error) => throwError('Error opening IndexedDB: ' + error)),
      switchMap((db) => new Observable<void>((observer) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        const getRequest = store.get(id);

        getRequest.onsuccess = () => {
          const existingData = getRequest.result;

          if (existingData) {
            // Update existing data with new values
            const updatedData = { ...existingData, ...data };

            // Use put without a key parameter since the key is part of the object
            const putRequest = store.put(updatedData);

            putRequest.onsuccess = () => {
              observer.next();
              observer.complete();
            };

            putRequest.onerror = () => observer.error('Error updating employee in IndexedDB');
          } else {
            observer.error('Employee not found in IndexedDB');
          }
        };

        getRequest.onerror = () => observer.error('Error getting employee from IndexedDB');
      }))
    );
  }
}

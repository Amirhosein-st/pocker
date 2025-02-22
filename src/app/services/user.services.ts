import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  private primaryBaseUrl = 'https://api.sheety.co/040d4fb4ee05df971c92a041cc04e07b/pocker/usersDetail';
  private secondaryBaseUrl = 'https://api.sheety.co/4b2d2653aa187a8dd89171333e2fa99c/pocker/usersDetail';
  private tertiaryBaseUrl = 'https://api.sheety.co/d5976b4ee6c8fe51b7de9f7e6cae7df2/pocker/usersDetail';

  constructor(private http: HttpClient) { }

  private handleError<T>(
    operation: (url: string) => Observable<T>,
    data: any,
    objectId?: string,
    isSecondary: boolean = false
  ) {
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.status === 402) {
        if (!isSecondary) {
          const newUrl = this.secondaryBaseUrl + (objectId ? `/${objectId}` : '');
          return operation(newUrl).pipe(
            catchError(this.handleError(operation, data, objectId, true))
          );
        } else {
          const tertiaryUrl = this.tertiaryBaseUrl + (objectId ? `/${objectId}` : '');
          return operation(tertiaryUrl);
        }
      }
      return throwError(() => error);
    };
  }

  getUsersDetail(): Observable<any> {
    return this.http.get<any>(this.primaryBaseUrl).pipe(
      catchError(this.handleError((url: string) => this.http.get<any>(url), null))
    );
  }

  addUserDetail(data: any): Observable<any> {
    return this.http.post<any>(this.primaryBaseUrl, data).pipe(
      catchError(this.handleError((url: string) => this.http.post<any>(url, data), data))
    );
  }

  updateUserDetail(objectId: string, data: any): Observable<any> {
    const url = `${this.primaryBaseUrl}/${objectId}`;
    return this.http.put<any>(url, data).pipe(
      catchError(this.handleError((url: string) => this.http.put<any>(url, data), data, objectId))
    );
  }

  deleteUserDetail(objectId: string): Observable<any> {
    const url = `${this.primaryBaseUrl}/${objectId}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError((url: string) => this.http.delete<any>(url), null, objectId))
    );
  }
}

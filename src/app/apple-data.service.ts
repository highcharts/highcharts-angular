import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppleDataService {
  private dataUrl = 'https://demo-live-data.highcharts.com/aapl-historical.json';

  constructor(private http: HttpClient) { }

  fetchData(): Observable<Object> {
    return this.http.get(this.dataUrl)
      .pipe(catchError(this.errorHandler));
  }

  fetchSqlData(min: number, max: number): Observable<Object> {
    return this.http.get(`${this.dataUrl}?start=${Math.round(min)}&end=${Math.round(max)}`)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "server error.");
  }

}
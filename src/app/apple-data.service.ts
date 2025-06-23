import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppleDataService {
  private readonly http = inject(HttpClient);
  private dataUrl = 'https://demo-live-data.highcharts.com/aapl-historical.json';

  public fetchData(): Observable<[][]> {
    return this.http.get<[][]>(this.dataUrl).pipe(catchError(this.errorHandler));
  }

  public fetchSqlData(min: number, max: number): Observable<[][]> {
    return this.http
      .get<[][]>(`${this.dataUrl}?start=${Math.round(min)}&end=${Math.round(max)}`)
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse): Observable<[][]> {
    return throwError(() => error.message || 'server error.');
  }
}

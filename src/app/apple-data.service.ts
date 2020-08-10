import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppleDataService {
  private dataUrl = 'https://demo-live-data.highcharts.com/aapl-historical.json';

  constructor(private http: HttpClient) { }

  fetchData(): Observable<Object> {
    return this.http.get(this.dataUrl);
  }

  fetchSqlData(min: number, max: number): Observable<Object> {
    return this.http.get(`${this.dataUrl}?start=${Math.round(min)}&end=${Math.round(max)}`)
  }

}

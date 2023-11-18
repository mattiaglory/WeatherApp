import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators'; 
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey = environment.apiKey;
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private weatherCache: { [city: string]: { data: any, timestamp: number } } = {};

  constructor(private http: HttpClient) {
    this.loadCacheFromLocalStorage();
  }

  private loadCacheFromLocalStorage() {
    const cachedWeather = localStorage.getItem('weatherCache');
    if (cachedWeather) {
      this.weatherCache = JSON.parse(cachedWeather);
    }
  }

  private saveCacheToLocalStorage() {
    localStorage.setItem('weatherCache', JSON.stringify(this.weatherCache));
  }

  private isDataFresh(timestamp: number): boolean {
    const oneHourInMillis = 3600000;
    return Date.now() - timestamp < oneHourInMillis;
  }

  getWeather(city: string) {
    const cachedData = this.weatherCache[city];

    if (cachedData && this.isDataFresh(cachedData.timestamp)) {
      console.log('-KES-');
      return of(cachedData.data);
    } else {
      console.log('-API-');
      return this.http.get(`${this.apiUrl}?q=${city}&appid=${this.apiKey}`)
        .pipe(
          tap(data => {
            this.weatherCache[city] = { data, timestamp: Date.now() };
            this.saveCacheToLocalStorage();
          })
        );
    }
  }
}

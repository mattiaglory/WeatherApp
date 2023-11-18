import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WeatherService } from './services/weather.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WeatherApp';
  city: string = '';
  weatherData: any;
  searchForm!: FormGroup;

  constructor(private weatherService: WeatherService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      city: ['Kraljevo'],
    });
    this.searchWeather();
  }

  searchWeather(): void {
    const city = this.searchForm.get('city')?.value;
    this.weatherService.getWeather(city).subscribe(data => {
      this.weatherData = data;
    });
  }
}
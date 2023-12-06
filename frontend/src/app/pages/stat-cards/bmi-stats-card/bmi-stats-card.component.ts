import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {WeightService} from "../../../services/weight.service";
import {StatisticsService} from "../../../services/statistics.service";
import {WeightDto} from "../../../dtos/weight-dto";
import {Bmi} from "../../../dtos/bmi";

@Component({
  selector: 'app-bmi-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bmi-stats-card.component.html',
  styleUrl: './bmi-stats-card.component.css'
})
export class BmiStatsCardComponent implements OnInit {
  weightService: WeightService = inject(WeightService);
  statService: StatisticsService = inject(StatisticsService);
  bmi: Bmi | undefined;
  bmiChange: number = 0;
  constructor() {
  }

  async ngOnInit() {
    this.bmi = await this.weightService.getLatestBmi();
    this.bmiChange = await this.statService.getBmiChange();
  }
}
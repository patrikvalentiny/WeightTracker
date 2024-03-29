import {Component, inject} from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import {WeightDto} from "../../dtos/weight-dto";
import {WeightService} from "../../services/weight.service";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-paste-data-from-excel',
    host: { class: 'h-full' },
    templateUrl: './paste-data-from-excel.component.html',
    styleUrl: './paste-data-from-excel.component.css',
    standalone: true,
    imports: [ReactiveFormsModule, DatePipe]
})
export class PasteDataFromExcelComponent {
  dataInput: FormControl<string | null> = new FormControl(null, [Validators.required]);
  weights: WeightDto[] = [];
  private readonly weightService = inject(WeightService);
  private readonly toastService = inject(HotToastService);
  private readonly router = inject(Router);

  constructor() {
  }

  async parseData() {
    try {
      this.weights = [];
      const data = this.dataInput.value!;
      const lines = data.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const cells = line.split("\t");
        const weight: WeightDto = {
          weight: Number(cells[1]),
          date: new Date(cells[0]),
          bodyFatPercentage: Number(cells[2] || null),
          skeletalMuscleWeight: Number(cells[3] || null)
        };
        // needed because catch does not catch errors in datePipe transform
        if (isNaN(weight.weight) || isNaN(weight.date.getTime())) {
          this.toastService.error("Invalid data format");
          return;
        }
        weight.date.setUTCFullYear(weight.date.getFullYear(), weight.date.getMonth(), weight.date.getDate());
        weight.date.setUTCHours(0, 0, 0, 0);
        this.weights.push(weight);
      }
    } catch (e) {
      this.toastService.error("Something went wrong during parsing");
    }
  }

  async uploadData() {
    try {
      await this.weightService.postMulti(this.weights);
      this.toastService.success("Data successfully uploaded");
      await this.router.navigate(["/home"]);
    } catch (e) {
      this.toastService.error("Error uploading data")
    }

  }

  async downloadCsv() {
    try {
      await this.weightService.getWeightsCsv();
    } catch (e) {
      this.toastService.error("Error downloading csv")
    }
  }
}

import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {environment} from "../../environments/environment";
import {HotToastService} from "@ngneat/hot-toast";
import {WeightDto} from "../dtos/weight-dto";
import {Bmi} from "../dtos/bmi";
import {WeightInput} from "../dtos/weight-input";
import * as FileSaver from "file-saver-es";

@Injectable({
  providedIn: 'root'
})
export class WeightService {
  weights: WeightDto[] = [];
  editingWeight = signal<WeightDto | null>(null);
  private readonly toastService = inject(HotToastService);
  private readonly httpClient: HttpClient = inject(HttpClient);

  constructor() {
  }

  async postWeight(weight: WeightInput) {
    try {
      const call = this.httpClient.post<WeightDto>(environment.baseUrl + "/weight", weight);
      const response = await firstValueFrom<WeightDto>(call);

      this.toastService.success("Weight successfully added");
      this.weights.unshift(response);
    } catch (e) {
      return;
    }
  }

  async getWeights() {
    try {
      const call = this.httpClient.get<WeightDto[]>(environment.baseUrl + "/weight");
      this.weights = await firstValueFrom<WeightDto[]>(call);
      return this.weights;
    } catch (e) {
      return;
    }
  }

  async deleteWeight(weight: WeightInput) {
    try {
      const date = weight.date.toISOString().substring(0, 10);
      const call = this.httpClient.delete<WeightDto>(environment.baseUrl + `/weight/${date}`);
      await firstValueFrom<WeightDto>(call);
      await this.getWeights();
      this.toastService.success("Item deleted");
    } catch (e) {

    }
  }

  async getLatestWeight() {
    try {
      await this.getWeights();
      return this.weights[this.weights.length - 1];
    } catch (e) {
      return;
    }
  }

  async putWeight(weightInput: WeightInput) {
    try {
      const call = this.httpClient.put<WeightDto>(environment.baseUrl + "/weight", weightInput);
      await firstValueFrom<WeightDto>(call);
      await this.getWeights();
      this.toastService.success("Weight successfully updated");
    } catch (e) {
      throw e;
    }
  }

  setEditingWeight(date: Date) {
    this.editingWeight.set(this.weights.find(i => i.date === date)!);
  }

  async getLatestBmi() {
    try {
      const call = this.httpClient.get<Bmi>(environment.baseUrl + "/bmi/latest");
      return await firstValueFrom<Bmi>(call);
    } catch (e) {
      throw e;
    }
  }

  async getBmi() {
    try {
      const call = this.httpClient.get<Bmi[]>(environment.baseUrl + "/bmi");
      return await firstValueFrom<Bmi[]>(call);
    } catch (e) {
      throw e;
    }
  }

  async postMulti(weights: WeightDto[]) {
    try {
      const call = this.httpClient.post<WeightDto[]>(environment.baseUrl + "/weight/multiple", weights);
      await firstValueFrom<WeightDto[]>(call);
    } catch (e) {
      throw e;
    }
  }

  async getWeightsCsv() {
    try {
      const call = this.httpClient.get(environment.baseUrl + "/csv", {responseType: "blob"});
      const response = await firstValueFrom<Blob>(call);
      const file = new File([response], "weights.csv", {type: "text/csv;charset=utf-8"});
      FileSaver.saveAs(file);
    } catch (e) {
      throw e;
    }
  }
}

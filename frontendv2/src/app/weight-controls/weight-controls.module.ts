import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeightInputComponent } from './weight-input/weight-input.component';
import {ReactiveFormsModule} from "@angular/forms";
import { WeightsTableComponent } from './weights-table/weights-table.component';



@NgModule({
  declarations: [
    WeightInputComponent,
    WeightsTableComponent
  ],
    exports: [
        WeightInputComponent,
        WeightsTableComponent
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class WeightControlsModule { }
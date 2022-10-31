
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { AppComponent } from './app.component';
import { NestedFlowStepComponent } from './flowchart/steps/nested-flow-step.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  imports: [BrowserModule, FormsModule, NgFlowchartModule, BrowserAnimationsModule, MatIconModule, MatCheckboxModule, MatSliderModule, MatButtonModule, MatRadioModule],
  declarations: [AppComponent, NestedFlowStepComponent, SidebarComponent ],
  bootstrap: [AppComponent]
})
export class AppModule {}

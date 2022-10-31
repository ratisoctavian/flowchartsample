import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { EditNodeComponent } from './flowchart/edit-step/edit-step.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule} from '@angular/material/menu';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FlowComponent } from './flowchart/flow/flow.component';
import { NestedFlowStepComponent } from './flowchart/steps/nested-flow-step/nested-flow-step.component';
import { ToolboxComponent } from './flowchart/toolbox/toolbox.component';
import { ParallelFlowStepComponent } from './flowchart/steps/parallel-step/parallel-flow-step.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NgFlowchartModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatCheckboxModule,
        MatSliderModule,
        MatButtonModule,
        MatRadioModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatMenuModule
    ],
    declarations: [AppComponent, FlowComponent, NestedFlowStepComponent, ParallelFlowStepComponent, SidebarComponent, EditNodeComponent, ToolboxComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}

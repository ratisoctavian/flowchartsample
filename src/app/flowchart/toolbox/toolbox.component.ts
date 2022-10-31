import { KeyValue } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgFlowchartStepRegistry } from '@joelwenzel/ng-flowchart';
import { FlowManagementService, stepConfig } from '../flowManagement.service';
import { NestedFlowStepComponent } from '../steps/nested-flow-step/nested-flow-step.component';
import { ParallelFlowStepComponent } from '../steps/parallel-step/parallel-flow-step.component';


@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss']
})
export class ToolboxComponent {

  @ViewChild(MatMenuTrigger, { static: true })
   matMenuTrigger: MatMenuTrigger;
  @ViewChild('normalStepTemplate')
    normalStepTemplate: TemplateRef<any>;

  originalOrder = (a: KeyValue<string,any>, b: KeyValue<string,any>): number => {return 0;}

  constructor(private stepRegistry: NgFlowchartStepRegistry, private flowManagementService: FlowManagementService) {}

  ngAfterViewInit() {
    this.stepRegistry.registerStep('step', this.normalStepTemplate);
    this.stepRegistry.registerStep('nested-flow-step', NestedFlowStepComponent);
    this.stepRegistry.registerStep('nested-flow-step', ParallelFlowStepComponent);
  }

  // select step
  onClick(event: MouseEvent, id: any) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();
    event.stopPropagation();
    this.flowManagementService.selectStep(id);
  }

  // --- context menu (delete step) ---
  menuTopLeftPosition = { x: '0', y: '0' };
  onRightClick(event: MouseEvent, item): void {

    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();
    event.stopPropagation();

    // record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    // pass data to the menu
    this.matMenuTrigger.menuData = {
      item: item
    };

    // open the menu
    this.matMenuTrigger.openMenu();
  }

  // remove step
  onRemove(step) {
    this.flowManagementService.removeStep(step);
  }

  get stepConfig(){
    return stepConfig;
  }

  getStepConfigById(id){
    return this.flowManagementService.getStepConfig(id);
  }
}

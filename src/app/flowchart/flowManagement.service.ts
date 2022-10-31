import { Injectable } from '@angular/core';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { BehaviorSubject } from 'rxjs';
import { NestedFlowStepComponent } from './steps/nested-flow-step/nested-flow-step.component';
import { ParallelFlowStepComponent } from './steps/parallel-step/parallel-flow-step.component';

export const stepConfig = {
  type1: {
    name: 'Item 1',
    color:'#2984a8',
    icon: 'hub',
    fields: {
      name: { label: 'Name', isRequired: true },
      role: { label: 'Role', isRequired: true },
      start: { label: 'Start', type: 'date' },
      end: { label: 'End', type: 'date' },
      description: { label: 'Description', type:'multiline'},
     },
  },
  type2: {
    name: 'Wait',
    color:'red',
    icon: 'alternate_email',
    fields: {
      name: { label: 'Name', isRequired: true },
      comment: { label: 'Comment', isRequired: true },
      seconds: { label: 'Wait in Seconds' }
     },
  },
  type3:{
    name: 'MySQL Task',
    color:'#b30786' ,
    icon: 'spoke',
    fields: {
      name: { label: 'Name', isRequired: true },
      comment: { label: 'Description', type:'multiline'},
      statement: { label: 'Statement', type:'multiline'},
      connection: { label: 'Connection'},
     },
  },
  type4:{
    name: 'Snow Flake Task',
    color:'#b30786' ,
    icon: 'spoke',
    fields: {
      name: { label: 'Name', isRequired: true },
      comment: { label: 'Description', type:'multiline'},
      statement: { label: 'Statement', type:'multiline'},
      connection: { label: 'Connection'},
     },
  },
  nestedFlowType:{
    name: 'Nested flow',
    icon: 'schema',
    color:'#f5db8d',
    fields: {},
    template: NestedFlowStepComponent,
  },
  parallelFlowType:{
    name: 'Parallel flows',
    icon: 'device_hub',
    color:'gray',
    fields: {},
    template: ParallelFlowStepComponent,
  }
};

@Injectable({
    providedIn: 'root',
})
export class FlowManagementService {
    public selectedStep$: BehaviorSubject<NgFlowchartStepComponent> = new BehaviorSubject(null);
    public flowDisabled$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    steps:{
      [id:string]:NgFlowchartStepComponent
    } = {};

    constructor() {
    }

    public selectStep(id:string): void {
      this.selectedStep$.next(this.steps[id]);
    }

    public setDisabled(value:boolean): void {
      this.flowDisabled$.next(value);
    }

    public getStepConfig(id){
      return stepConfig [this.steps[id]?.type];
    }

    addStep(step:NgFlowchartStepComponent){
       step.data = this.createObject(step.type);
       this.steps[step.id] = step;
    }

    createObject(type){
      return stepConfig[type].fields ?
        Object.fromEntries(Object.keys(stepConfig[type].fields).map(f=>[f,""])):
        {};
    }

    removeStep(step:NgFlowchartStepComponent):void{
      const stepToRemove = this.steps[step.id];
      //remove step and all children from steps dictionary
      this.removeStepFromSteps(step);
      //remove stem and children from canvas
      stepToRemove.destroy(true);
      this.selectedStep$.next(null);
    }

    removeStepFromSteps(step){
      // remove children
      this.steps[step.id].children?.forEach(c=>this.removeStepFromSteps(c));

      //remove nested child
      this.steps[step.id]['nestedChildren']?.forEach(c=>this.removeStepFromSteps(c));

      delete this.steps[step.id];
    }

    clear():void{
      this.steps = {};
      this.selectedStep$.next(null);
    }

}

import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  NgFlowchartCanvasDirective,
  NgFlowchartStepRegistry,
  NgFlowchart
} from '@joelwenzel/ng-flowchart';
import { NestedFlowStepComponent } from './flowchart/steps/nested-flow-step.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('normalStepTemplate')
  normalStepTemplate: TemplateRef<any>;

  @ViewChild(NgFlowchartCanvasDirective)
  canvas: NgFlowchartCanvasDirective;

  title = 'workspace';
  callbacks: NgFlowchart.Callbacks = {};
  initJson ='{}';
  selectedStep:any;

  zoomValue = 0.5;
  disabled = false;
  options: NgFlowchart.Options = {
    stepGap: 40,
    rootPosition: 'TOP_CENTER',
    isSequential: false,
    zoom: {
      mode:'WHEEL',
      defaultStep:0.1,
      }
  };

  items = [
    {
      name: 'Item1',
      type: 'type1',
      data: {
        title: 'Item 1',
        color:'#2984a8',
        icon: 'hub',
      }
    },
    {
      name: 'MYSQL',
      type: 'type2',
      data: {
        title: 'MYSQL',
        color:'red',
        icon: 'alternate_email',
      }
    },
    {
      name: 'Wait',
      type: 'type3',
      data: {
        title: 'Wait',
        color:'#b30786' ,
        icon: 'schedule',
      }
    },
    {
      name: 'Parallel Task',
      type: 'nested-flow-type',
      template: NestedFlowStepComponent,
      data: {
        title: 'Parallel Task',
        icon: 'schema',
        color:'#f5db8d' ,
      }
    }
  ];


  constructor(private stepRegistry: NgFlowchartStepRegistry) {
    this.callbacks.onDropError = this.onDropError;
    this.callbacks.onMoveError = this.onMoveError;
  }

  ngAfterViewInit() {
    this.stepRegistry.registerStep('log', this.normalStepTemplate);
    this.stepRegistry.registerStep('nested-flow', NestedFlowStepComponent);
    this.canvas.getFlow().upload(this.initJson);
  }

  onOptionChanged(option: string, value: unknown) {
    const optionPath = option.split('.');

    this.options =
        optionPath.length == 1
            ? {
                  ...this.options,
                  [optionPath[0]]: value,
              }
            : {
                  ...this.options,
                  [optionPath[0]]: { ...this.options[optionPath[0]], [optionPath[1]]: value },
              };
  }

  onZoomChanged(value:number){

    let stepsNo = (value - this.zoomValue)/this.options.zoom.defaultStep;
    if (value > this.zoomValue)
      for(let i=1; i<= stepsNo; i++)
          this.canvas.scaleUp();
    else
      for(let i=1; i<= -stepsNo; i++)
          this.canvas.scaleDown();


    this.zoomValue = value ;
    // this.canvas.scaleUp()
    //this.canvas.setScale(1) //resets back to default scale
  }

  onClick(id: any) {
    this.selectedStep = this.canvas.getFlow().getStep(id);
  }


  onDropError(error: NgFlowchart.DropError) {
    console.log(error);
  }

  onMoveError(error: NgFlowchart.MoveError) {
    console.log(error);
  }

  showFlowData() {
    let json = this.canvas.getFlow().toJSON(4);

    var x = window.open();
    x.document.open();
    x.document.write(
      '<html><head><title>Flowchart Json</title></head><body><pre>' +
        json +
        '</pre></body></html>'
    );
    x.document.close();
  }

  clearData() {
    this.canvas.getFlow().clear();
  }

  onDelete(id: any) {
    this.canvas
      .getFlow()
      .getStep(id)
      .destroy(true);
  }
}

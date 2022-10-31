import { Component, ViewChild } from '@angular/core';
import {
  NgFlowchartCanvasDirective,
  NgFlowchart
} from '@joelwenzel/ng-flowchart';
import { FlowManagementService } from '../flowManagement.service';


@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent {

  @ViewChild(NgFlowchartCanvasDirective)
  canvas: NgFlowchartCanvasDirective;

  title = 'workspace';
  callbacks: NgFlowchart.Callbacks = {
    onDropStep : this.onDropStep.bind(this),
    onDropError : this.onDropError,
    onMoveError : this.onMoveError
  };
  initJson ='{}';

  zoomValue = 1;
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


  constructor( public flowManagementService: FlowManagementService) {}

  ngAfterViewInit() {
    this.canvas.getFlow().upload(this.initJson);
  }

  // add step
  onDropStep(dropEvent: NgFlowchart.DropEvent) {
     this.flowManagementService.addStep(dropEvent.step);
  }

  //clear flow
  clearData() {
    this.canvas.getFlow().clear();
    this.flowManagementService.clear();
  }


   // canvas layout
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

  onZoomChanged(value?:number){
    if (value){
      let stepsNo = (value - this.zoomValue)/this.options.zoom.defaultStep;
      if (value > this.zoomValue)
        for(let i=1; i<= stepsNo; i++)
            this.canvas.scaleUp();
      else
        for(let i=1; i<= -stepsNo; i++)
            this.canvas.scaleDown();


      this.zoomValue = value ;
    }
    else{
      this.canvas.setScale(1) //resets back to default scale
      this.zoomValue = 1;
    }
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

}

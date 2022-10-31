import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgFlowchart, NgFlowchartCanvasDirective, NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';

export type NestedData = {
  nested: any
}


// selector: 'app-ontology-management',
//   templateUrl: './ontology-management.component.html',
//   styleUrls: ['./ontology-management.component.scss'],


@Component({
  selector: 'app-nested-flow-step',
  templateUrl: './nested-flow-step.component.html',
  styleUrls: ['./nested-flow-step.component.scss']
})
export class NestedFlowStepComponent extends NgFlowchartStepComponent implements OnInit, OnDestroy {

  @ViewChild(NgFlowchartCanvasDirective)
  nestedCanvas: NgFlowchartCanvasDirective;

  @ViewChild('canvasContent')
  stepContent: ElementRef<HTMLElement>;

  // when our inner canvas finishes rendering, re-render the main canvas
  callbacks: NgFlowchart.Callbacks = {
    afterRender: () => {
      this.canvas.reRender()
    }
  };


  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit()

    setTimeout(() => {
      console.log(this.nestedCanvas)
    }, 2000)
  }

  ngOnDestroy() {
    this.nestedCanvas?.getFlow().clear()
  }

  shouldEvalDropHover(coords: number[], stepToDrop: NgFlowchart.Step): boolean {
    const canvasRect = this.stepContent.nativeElement.getBoundingClientRect()
    return !this.areCoordsInRect(coords, canvasRect)
  }

  toJSON() {
    const json = super.toJSON()
    return {
      ...json,
      data: {
        ...this.data,
        nested: this.nestedCanvas.getFlow().toObject()
      }
    }
  }

  canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    return true;
  }

  canDeleteStep(): boolean {
    return true;
  }



  async onUpload(data: NestedData) {
    if(!this.nestedCanvas) {
      return
    }
    await this.nestedCanvas.getFlow().upload(data.nested);
  }

  private areCoordsInRect(coords: number[], rect: Partial<DOMRect>): boolean {
    return this.isNumInRange(coords[0], rect.left, rect.left + rect.width) && this.isNumInRange(coords[1], rect.top, rect.top + rect.height)
  }

  private isNumInRange(num: number, start: number, end: number): boolean {
    return num >= start && num <= end
  }

}

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgFlowchart, NgFlowchartCanvasDirective, NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowManagementService, stepConfig } from '../../flowManagement.service';


export type NestedData = {
  nested: any
}

@Component({
  selector: 'app-nested-flow-step',
  templateUrl: './nested-flow-step.component.html',
  styleUrls: ['./nested-flow-step.component.scss']
})
export class NestedFlowStepComponent extends NgFlowchartStepComponent implements OnInit, OnDestroy {

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  @ViewChild(NgFlowchartCanvasDirective) nestedCanvas: NgFlowchartCanvasDirective;
  @ViewChild('canvasContent') canvasContentElem: ElementRef<HTMLElement>;

  disabled = false;
  menuTopLeftPosition = { x: '0', y: '0' };
  resizeObserver = new ResizeObserver(entries => {
    this.canvas.reRender(true);
    console.log("rerender");
  });

  callbacks: NgFlowchart.Callbacks = {
    onDropStep : this.onDropStep.bind(this),
  };

  constructor(private flowManagementService: FlowManagementService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    setTimeout(() => {
      this.resizeObserver.observe(this.canvasContentElem.nativeElement);
    }, 0);

    this.flowManagementService.flowDisabled$.subscribe(value => {
       this.disabled = value ;
    });
  }

  // add child step
  onDropStep(dropEvent: NgFlowchart.DropEvent) {
    this.flowManagementService.addStep(dropEvent.step);
  }

  // select this step
  onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.flowManagementService.selectStep(this.id);
  }

   // context menu
   onRightClick(event: MouseEvent): void {

     // preventDefault avoids to show the visualization of the right-click menu of the browser
     event.preventDefault();
     event.stopPropagation();

     // record the mouse position in our object
     this.menuTopLeftPosition.x = event.clientX + 'px';
     this.menuTopLeftPosition.y = event.clientY + 'px';

     // open the menu
     this.matMenuTrigger.openMenu();
 }

 // remove the step
 onRemove() {
  this.flowManagementService.removeStep(this);
 }

  // JSON (from/to)
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
  async onUpload(data: NestedData) {
    if(!this.nestedCanvas) {
      return
    }
    await this.nestedCanvas.getFlow().upload(data.nested);
  }

  get nestedChildren(): NgFlowchartStepComponent[]{
    return this.nestedCanvas.getFlow().getRoot() ?  [this.nestedCanvas.getFlow().getRoot()] : [];
  }

  get stepConfig(){
    return stepConfig[this.type];
  }

  shouldEvalDropHover(coords: number[], stepToDrop: NgFlowchart.Step): boolean {
    const canvasRect = this.canvasContentElem.nativeElement.getBoundingClientRect()
    return !this.areCoordsInRect(coords, canvasRect)
  }

  canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    return true;
  }

  canDeleteStep(): boolean {
    return true;
  }

  private areCoordsInRect(coords: number[], rect: Partial<DOMRect>): boolean {
    return this.isNumInRange(coords[0], rect.left, rect.left + rect.width) && this.isNumInRange(coords[1], rect.top, rect.top + rect.height)
  }

  private isNumInRange(num: number, start: number, end: number): boolean {
    return num >= start && num <= end
  }

  ngOnDestroy() {
    this.nestedCanvas?.getFlow().clear();
    this.resizeObserver.disconnect();
  }

}

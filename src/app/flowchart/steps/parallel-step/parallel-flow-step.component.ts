import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgFlowchart, NgFlowchartCanvasDirective, NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowManagementService, stepConfig } from '../../flowManagement.service';

export type ParallelData = {
  nested: any[]
}

@Component({
  selector: 'app-parallel-flow-step',
  templateUrl: './parallel-flow-step.component.html',
  styleUrls: ['./parallel-flow-step.component.scss']
})
export class ParallelFlowStepComponent extends NgFlowchartStepComponent implements OnInit, OnDestroy {

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  @ViewChildren(NgFlowchartCanvasDirective) parallelCanvas: QueryList<NgFlowchartCanvasDirective>;
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

  // select the parallel step
  onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.flowManagementService.selectStep(this.id);
  }

  // context menu - remove the parallel step
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

  // JSON (from/to)
  toJSON() {
    const json = super.toJSON()
    return {
      ...json,
      data: {
        ...this.data,
        nested: this.parallelCanvas.toArray().map(c=> c.getFlow().toObject())
      }
    }
  }
  async onUpload( data:ParallelData) {
    if(!this.parallelCanvas) {
      return
    }

    for( let i= 0; i< this.parallelCanvas.toArray().length; i++)
      await this.parallelCanvas.get(i).getFlow().upload(data.nested[i]);
  }

  // remove the parallel step
  onRemove() {
    this.flowManagementService.removeStep(this);
  }

  // helper
  get nestedChildren(): NgFlowchartStepComponent[]{
    return this.parallelCanvas.toArray().map(c=> c.getFlow().getRoot()||null).filter(rootStep => rootStep) ;
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
    this.parallelCanvas.toArray().forEach(c => c.getFlow().clear());
    this.resizeObserver.disconnect();
  }
}

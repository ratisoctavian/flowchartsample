import { KeyValue } from '@angular/common';
import { Component, Input, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import { NgFlowchartStepComponent } from '@joelwenzel/ng-flowchart';
import { FlowManagementService, stepConfig } from '../flowManagement.service';


@Component({
    selector: 'app-edit-step',
    templateUrl: './edit-step.component.html',
    styleUrls: ['./edit-step.component.scss'],
})
export class EditNodeComponent{
    @ViewChild(FormGroupDirective, { static: true }) formGroupDirective: FormGroupDirective;

    step: NgFlowchartStepComponent;
    editFormGroup: FormGroup = new FormGroup({});
    editMode = false ;

    // Preserve original property order
    originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {return 0;}

    constructor(private flowManagementService: FlowManagementService) {
    }
    ngOnInit(){
      this.flowManagementService.selectedStep$.subscribe(step => {
        this.step = step;
        this.initFormGroup();
      });
    }

    initFormGroup(){
      if (this.step){
          this.editFormGroup = new FormGroup(
          Object.keys( stepConfig[this.step.type].fields).reduce((obj, key) => {
              obj[key] = new FormControl(this.step.data[key], []);
              const field = stepConfig[this.step.type].fields[key];
              if (field.isRequired) obj[key].addValidators([Validators.required]);
              return obj;
          }, {})
        );

        this.editFormGroup.valueChanges.subscribe(() => {
            this.editMode = true;
        });
      }
      else
        this.editFormGroup = new FormGroup({});
    }

    save(){
      if (this.editFormGroup.invalid) return;
      this.step.data = this.editFormGroup.value;
      this.cancel();
    }

    cancel(){
      this.editMode = false;
      setTimeout(() => {
        this.formGroupDirective.resetForm();
        this.editFormGroup.reset();
        this.editFormGroup.setValue(this.step.data);
        this.editMode = false;
    }, 0);
    }

    get stepConfig(){
      return stepConfig[this.step?.type];
    }
  }

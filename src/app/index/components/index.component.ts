import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Colors} from "./colors.interface";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  form: FormGroup = new FormGroup({
    checkboxes: new FormControl(),
  })

  colors = [
    {color: Colors.blue, id: 1},
    {color: Colors.red, id: 2},
    {color: Colors.orange, id: 3},
    {color: Colors.green, id: 4},
    {color: Colors.black, id: 5},
    {color: Colors.brown, id: 6}
  ]

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initColors()
    this.initForm()
  }

  save(): void {
    this.initColors()
    this.initForm()
  }

  get idsFromForm(): number[] {
    return this.form?.value?.checkboxes?.map((item: { id: number }) => item?.id)
  }

  onCheckboxChange(e: any, value: any) {
    const checkArray: FormArray = this.form.get('checkboxes') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(value, [ColorValidator]));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item) => {
        if (item.value.color == value.color && item.value.id == value.id) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      checkboxes: this.fb.array([],
        [Validators.required, CountValidator(this.colors.map(item => item.color))])
    })
  }

  initColors(): void {
    const colors = [Colors.blue, Colors.red, Colors.orange, Colors.green, Colors.black, Colors.brown]

    const getRandomInt = (max: number = 3) => {
      return Math.floor(Math.random() * (max - 1) + 1);
    }

    this.colors = JSON.parse(JSON.stringify(this.colors.map((item) => {
      const randomIndex = getRandomInt(this.colors.length)
      item.color = colors[randomIndex]
      return item
    })))


    const countsRandomElementsFromArray = getRandomInt()

    for (let i = 0; i <= countsRandomElementsFromArray; i++) {
      const randomIndex = getRandomInt(this.colors.length)
      if (this.colors[randomIndex].color !== Colors.blue) {
        this.colors[randomIndex].color = Colors.blue
      }
    }
  }

}
function ColorValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any } | any => {
    if (control.value) {
      if (control.value.color !== Colors.blue) {
        return { invalid: 'invalid' };
      }
    }
  };
}
function CountValidator(array: Colors[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any } | any => {
    if (control.value) {
const values = control.value?.filter((item: any) => item.color === Colors.blue)?.length
      const filteredArray = array?.filter(item => item === Colors.blue)?.length
      if (values != filteredArray || control.value?.length != filteredArray) {
        return { invalid: 'invalid' };
      }
    }
  };
}

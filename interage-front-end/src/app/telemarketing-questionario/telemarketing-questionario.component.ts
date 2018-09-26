import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IMyOptions } from '../../lib/ng-uikit-pro-standard';

@Component({
  selector: 'app-telemarketing-questionario',
  templateUrl: './telemarketing-questionario.component.html',
  styleUrls: ['./telemarketing-questionario.component.scss']
})
export class TelemarketingQuestionarioComponent implements OnInit {

  questionarioForm: FormGroup;
  public myDatePickerOptions: IMyOptions = {
    // Strings and translations
    dayLabels: { su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri', sa: 'Sat' },
    dayLabelsFull: { su: "Sunday", mo: "Monday", tu: "Tuesday", we: "Wednesday", th: "Thursday", fr: "Friday", sa: "Saturday" },
    monthLabels: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' },
    monthLabelsFull: { 1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December" },

    // Buttons
    todayBtnTxt: "Today",
    clearBtnTxt: "Clear",
    closeBtnTxt: "Close",

    // Format
    dateFormat: 'dd.mm.yyyy',
  }

  status: Array<object> = [
    {
      value: 1,
      label: "Ocupado"
    }
  ]
  constructor(private formBuilder: FormBuilder) {
    debugger
    this.questionarioForm = this.formBuilder.group({
      pessoaALigar: ['aasdas'],
      telefones: ['654654654564'],
    }
    )
  }

  ngOnInit() {
  }

}

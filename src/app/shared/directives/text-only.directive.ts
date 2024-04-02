import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextOnly]'
})
export class TextOnlyDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow certain special keys like backspace and delete
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(event.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
      (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
      (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
      (event.keyCode === 88 && (event.ctrlKey || event.metaKey)) ||
      // Allow home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }

    // Ensure that only text characters are allowed
    if ((event.shiftKey || (event.keyCode < 65 || event.keyCode > 90)) &&
      (event.keyCode < 97 || event.keyCode > 122)) {
      event.preventDefault();
    }
  }

}

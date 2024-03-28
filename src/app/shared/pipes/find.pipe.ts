import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'find'
})
export class FindPipe implements PipeTransform {

  constructor() {
  }

  transform(id: string, inputData: any[]): Boolean {
    console.log(id);
    console.log(inputData);

    let data = inputData?.find(f => f?._id === id)
    
    console.log(data);
    if(data != undefined){
      return true;
    }else{
      return false;
    }    
  }
}

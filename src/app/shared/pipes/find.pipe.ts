import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'find'
})
export class FindPipe implements PipeTransform {

  constructor() {
  }

  transform(id: string, inputData: any[]): Boolean {
    let data = inputData?.find(f => f?._id === id)
        if(data != undefined){
      return true;
    }else{
      return false;
    }    
  }
}

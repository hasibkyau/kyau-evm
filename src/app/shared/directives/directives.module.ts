import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImageLoadErrorDirective} from './image-load-error.directive';
import {ImageProfileErrorDirective} from "./image-profile-error.directive";
import {NoWhitespaceDirective} from "./no-whitespace.directive";
import {AutoSlugDirective} from "./auto-slug.directive";
import { TextOnlyDirective } from './text-only.directive';



@NgModule({
  declarations: [
    ImageLoadErrorDirective,
    ImageProfileErrorDirective,
    NoWhitespaceDirective,
    AutoSlugDirective,
    TextOnlyDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageLoadErrorDirective,
    ImageProfileErrorDirective,
    NoWhitespaceDirective,
    AutoSlugDirective,
    TextOnlyDirective
  ]
})
export class DirectivesModule { }

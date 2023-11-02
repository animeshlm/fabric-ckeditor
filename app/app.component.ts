import {
  Component,
  AfterViewInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements AfterViewInit {
  
  artboard:any = [];
  constructor(){

  }
  addArtboard(){
    this.artboard.push(1);
  }

  getJSONOfArtboards (){
    
  }
  
}


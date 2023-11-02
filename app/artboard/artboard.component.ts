import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
declare const window: any;
import { fabric } from 'fabric';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DecoupledEditor from '@haifahrul/ckeditor5-build-rich';
import { Element } from '@angular/compiler/src/compiler';
import { ElementAst } from '@angular/compiler';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import domtoimage from 'dom-to-image';

const html2canvas = require('html2canvas');
@Component({
  selector: 'artboard',
  templateUrl: './artboard.component.html',
  styleUrls: ['./artboard.component.css'],
  //encapsulation: ViewEncapsulation.ShadowDom
})
export class ArtboardComponent implements AfterViewInit, OnInit {
  name = 'Angular';
  @Input('canvasId') canvasId: string;
  //editor = ClassicEditor;
  editor = DecoupledEditor;
  editorData: any = '';
  title = 'angular-pwa';
  config = {
    toolbar: [
      'bold',
      'italic',
      '|',
      'undo',
      'redo',
      '|',
      'numberedList',
      'bulletedList',
      'PageBreak',
      'inserttable',
      'FontColor',
      'FontSize',
      'FontFamily',
      'FontBackgroundColor',
      'heading',
    ],
    removePlugins: ['Title'],
    fontSize: {
      options: [9, 11, 13, 'default', 17, 19, 21],
    },
    language: 'es',
  };
  editortxt: any;
  target: any;
  bookUrl: any;
  canvas: any;
  canvasPreview: any;
  fullCanvasJson: any;
  @ViewChild('artboard', { static: false }) artboard: ElementRef;
  @ViewChild('preview', { static: false }) preview: ElementRef;
  @ViewChild('myEditor') myEditor: any;
  @ViewChild('hidden') hidden: any;
  public consoleMessages: string[] = [];

  editorDataUpdate = new Subject<string>();

  constructor() {
    //implemen debounce
    this.editorDataUpdate
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        console.log(value);
        this.editorData = value;
        this.changeTextInCanvas();
      });
  }

  //Fabric js code  =================================
  toolbar = {
    fontFamily: 'verdana',
    bold: false,
  };

  canvasList = [];
  canvasCount = [];
  canvasID = 0;
  activeCanvasIndex: any;

  /*addCanvas() {
    this.canvasCount.push(1);
    setTimeout(() => {
      let canvasID = 'canvas' + this.canvasID;
      this.canvasList.push(
        new fabric.Canvas(canvasID, { preserveObjectStacking: true })
      );
      this.canvasID++;
      console.log(this.canvasList);

      document.querySelectorAll('.canvas-container').forEach((item) => {
        item.addEventListener('click', (e) => {
          this.setActiveCanvas(
            e.currentTarget.firstChild.id.split('canvas')[1]
          );
          // }
        });
      });
    }, 2000);
  } */
  setActiveCanvas(curActiveCanvasIndex) {
    this.activeCanvasIndex = curActiveCanvasIndex;
    console.log(this.canvasList[this.activeCanvasIndex]);
    this.canvasList[this.activeCanvasIndex].on('object:selected', (e) => {
      console.log('selected ', e.target.clipName);
    });
  }
  ngOnInit() {
    //  let canvasId = 'canvas'+this.canvasId;
    //  this.canvas = new fabric.Canvas(canvasId, { preserveObjectStacking: true });
  }

  ngAfterViewInit() {
    //initialize the jsfabric on canvas element
    let canvasId = 'canvas' + this.canvasId;
    this.canvas = new fabric.Canvas(canvasId, { preserveObjectStacking: true });
  }

  defaultText: string = 'Edit me...';
  showToolbar = false;

  imagedata: any;
  editordata: any;
  editorDataArray: any = [];

  //will be called every change event in ckeditor
  changeTextInCanvas() {
    if (this.canvas.getActiveObject()) {
      let activeObj = this.canvas.getActiveObject();
      activeObj.htmlcode = this.editorData;
      let elem = document.createElement('div');

      elem.innerHTML = this.editorData;
      this.hidden.nativeElement.innerHTML = elem.innerHTML.replace('p', 'div');

      /*html2canvas(elem, { backgroundColor: null }).then((canvas) => {
        activeObj.setSrc(canvas.toDataURL(), () => {
          this.canvas.renderAll();
        });
        elem.style.height = '0px';
      });*/

      domtoimage
        .toPng(this.hidden.nativeElement)
        .then((dataUrl) => {
          // var img = new Image();
          //img.src = dataUrl;
          //document.body.appendChild(img);
          // this.addImage(dataUrl);

          activeObj.setSrc(dataUrl, () => {
            this.canvas.renderAll();
          });
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });

      console.log('activeObj', activeObj);
      // document.body.removeChild(elem);
      //this.hidden.nativeElement.innerHTML = '';
    }
  }

  editorSubmit() {
    let elem = document.createElement('div');

    //let editorData = this.editorData;
    elem.innerHTML = this.editorData;
    //this.editordata = editorData;
    //document.body.appendChild(elem);

    //this.hidden.nativeElement.appendChild(elem);
    console.log(
      'inner >> ',
      elem.innerHTML,
      ' ||| editor >> ',
      this.editorData
    );

    //this.hidden.nativeElement.innerHTML = '<div>asdasdfa</div><div>asdfasfd</div>'
    //this works
    this.hidden.nativeElement.innerHTML = elem.innerHTML.replace('p', 'div');

    //elem.appendChild(elem);
    // console.log(editorData);
    let _imagedata = '';

    /* html2canvas(elem, { backgroundColor: null}).then((canvas) => {
      _imagedata = canvas.toDataURL("image/png", 0.5);
      //// console.log(_imagedata, 'xxxxxxxxxxx');
      this.addImage(_imagedata);
    });*/

    domtoimage
      .toPng(this.hidden.nativeElement)
      .then((dataUrl) => {
        var img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
        this.addImage(dataUrl);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });

    /*htmlToImage
  .toPng(elem)
  .then(function (dataUrl) {
    var img = new Image();
    img.src = dataUrl;
  
    console.log(dataUrl)
    document.body.appendChild(img);
  })
  .catch(function (error) {
    console.error('oops, something went wrong!', error);
  });*/

    /*domtoimage.toPng(elem, { quality: 0.95 }).then((dataUrl) => {
    console.log('dataurl ', dataUrl)
    this.addImage(dataUrl);
  });*/
  }

  addTextField() {
    let elem = document.createElement('div');

    //let editorData = this.editorData;
    elem.innerHTML = '<p>Click to add Text</p>';
    //this.editordata = editorData;
    //document.body.appendChild(elem);

    this.hidden.nativeElement.appendChild(elem);

    //elem.appendChild(elem);
    // console.log(editorData);
    let _imagedata = '';
    html2canvas(elem, { backgroundColor: null }).then((canvas) => {
      _imagedata = canvas.toDataURL();
      //// console.log(_imagedata, 'xxxxxxxxxxx');
      this.addImage(_imagedata);
    });
  }

  jsonPreview() {
    let jsonofcanvas = JSON.stringify(this.canvas);
    this.canvasPreview = new fabric.Canvas('canvasPreview');
    this.canvasPreview.loadFromJSON(jsonofcanvas);

    //Example below with hardcoded JSON
    /* this.canvasPreview.loadFromJSON("{\"version\":\"5.3.0\",\"objects\":[{\"type\":\"image\",\"version\":\"5.3.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":186,\"top\":24,\"width\":393,\"height\":18,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"cropX\":0,\"cropY\":0,\"htmlcode\":\"<p>textttttttttttttt</p>\",\"src\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYkAAAASCAYAAACuCyKJAAAAAXNSR0IArs4c6QAAAtZJREFUeF7tm8HrDVEUxz+/JZbslC07C0uUlCyVBQvsyI6ULQv+AFFEFIUFRdlhIYWyUopiZ2MpS1uduqdu05s38+a9fr1mPrN7950559zPu93vnTnnbeAlAQlIQAISaCGwIRkJSEACEpBAGwFFwrUhAQlIQAKtBBQJF4cEJCABCSgSrgEJSEACElicgE8SizPzDglIQAKTIZAisR04Dtxf0cyPAT+An8XfLP99bM4BL4E/xc9uYA/wqsqzy2Zo7CH5rQifbiQgAQmsB4EUiSslnesrSCs28lvAhUokmv772OwH4r5TRSS2ADeAD8DTkmcfmyGxh+S3AnS6kIAEJLBeBEIkXgNHq7QOAJ+A2IA/lvE3ZbOOU3yO3QPuAo+AvUB8/gw8rHzFdzuBI9XYNeBqh80D4GxlcxM4VOLE8FfgPXBxjs034C9wcMHYQ/KL+axCYNdrdZiNBCQweQIhEnlC/11tdCEQh6vPcZqPzfYSsAt4BrwA7pRT/ePG6f42cLI8SbT577KJmGeqJ4l4bRRPEHWsLpuhsWP+i+Y3+cUkAAlIYHwEZolEbqznG9ON03tu/PE6JoQirhxL8z4bbB+bLgGIeF02isT41qwzkoAENpHAPJGIE3u8dmq7YoN+ApyuniLCto8A9LHpEgBFYhMXiqEkIIFpEpgnEnWBuEknX0e9KzWKrGMoEtNcR85aAhIYKYFmd9PzUqPYNmPzj+Lzl9KCWtcrssCdQlF3BkWh+y1wufBL//+qDqg2m8ghOpOigL2v+Mnupu9A+NjRw+bEgNhD8qvbcke6XJyWBCQwNQIpEvnqKDqUojgdm2SOJZN4rfSr6m4KUYj/QkQxObujwia6pXIshaPpf2sPmyyQR/yse4RoZPdRdBPNqo00bYbEHprf1NaP85WABEZOwH9cj/wHdnoSkIAEliGgSCxDz3slIAEJjJyAIjHyH9jpSUACEliGwH+ULxsi6XvNgQAAAABJRU5ErkJggg==\",\"crossOrigin\":null,\"filters\":[]},{\"type\":\"image\",\"version\":\"5.3.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":167,\"top\":61.81,\"width\":200,\"height\":300,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":0.61,\"scaleY\":0.61,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"cropX\":0,\"cropY\":0,\"htmlcode\":\"<p>textttttttttttttt</p>\",\"src\":\"https://picsum.photos/seed/picsum/200/300\",\"crossOrigin\":null,\"filters\":[]},{\"type\":\"image\",\"version\":\"5.3.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":-3.88,\"top\":151.77,\"width\":200,\"height\":300,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":0.52,\"scaleY\":0.52,\"angle\":314.12,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"cropX\":0,\"cropY\":0,\"htmlcode\":\"<p>textttttttttttttt</p>\",\"src\":\"https://picsum.photos/seed/picsum/200/300\",\"crossOrigin\":null,\"filters\":[]},{\"type\":\"image\",\"version\":\"5.3.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":367.86,\"top\":59.98,\"width\":200,\"height\":300,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":0.52,\"scaleY\":0.52,\"angle\":35.18,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"cropX\":0,\"cropY\":0,\"htmlcode\":\"<p>textttttttttttttt</p>\",\"src\":\"https://picsum.photos/seed/picsum/200/300\",\"crossOrigin\":null,\"filters\":[]}]}"); */

    this.fullCanvasJson = jsonofcanvas;
    console.log(this.fullCanvasJson);
    console.log(this.canvas);

    //prepare canvas for saving data
    let canvasForDb = JSON.parse(JSON.stringify(this.canvas));
    for (let i = 0; i < canvasForDb.objects.length; i++) {
      if (canvasForDb.objects[i]['htmlcode']) {
        canvasForDb.objects[i]['htmlcode'] = canvasForDb.objects[i][
          'htmlcode'
        ].replace("'", "'");
      }
    }
    console.log('canvasForDb >>> ', JSON.stringify(jsonofcanvas));
  }

  addImage(img_url) {
    let imgurl = img_url || 'https://picsum.photos/seed/picsum/200/300';
    fabric.Image.fromURL(imgurl, (oImg) => {
      // scale image down, and flip it, before adding it onto canvas
      // oImg.scale(0.5).set('flipX', true);
      oImg.crossOrigin = 'anonymous';
      const originalToObject = fabric.Image.prototype.toObject;
      const myAdditional = ['htmlcode', 'shortDes', 'longDesc'];
      fabric.Image.prototype.toObject = function (additionalProperties) {
        return originalToObject.call(
          this,
          myAdditional.concat(additionalProperties)
        );
      };

      oImg['htmlcode'] = this.editorData;
      oImg['shortDes'] = '';
      oImg['longDesc'] = '';
      this.canvas.add(oImg);
      this.canvasclick();
      console.log(oImg);
    });
    this.hidden.nativeElement.innerHTML = '';
  }

  //to send html data of selected image to ckeditor
  canvasclick() {
    this.canvas.on('mouse:down', (e) => {
      try {
        let selectedItem = this.canvas.getActiveObject();
        if (selectedItem !== null) {
          // this.myEditor.data = selectedItem?.htmlcode;
          this.editorData = selectedItem?.htmlcode;
        }
      } catch (e) {
        console.log('Error :::: ', e);
      }
    });
  }

  deleteObject() {
    let activeObj = this.canvas.getActiveObject();
    this.canvas.remove(activeObj);
  }
  addText() {
    this.canvas.add(
      new fabric.Textbox(this.defaultText, {})
        .on('selected', () => {
          this.showToolbar = true;
        })
        .on('deselected', () => {
          this.showToolbar = false;
        })
    );

    // create a rectangle object
  }

  send2back() {
    this.canvas.getActiveObject().sendToBack();
    this.canvas.renderAll();
  }
  bring2front() {
    this.canvas.getActiveObject().bringToFront();
    this.canvas.renderAll();
  }

  /// text tool bar code starts ////////////
  fontFamily(family) {
    let text = this.canvas.getActiveObject();
    text.set({ fontFamily: 'Courier' }); //Change the text
    this.canvas.renderAll(); //Update the canvas
  }
  bold() {
    let text = this.canvas.getActiveObject();
    text.set({ fontWeight: 'bold' }); //Change the text
    this.canvas.renderAll(); //Update the canvas
  }

  italic() {
    let text = this.canvas.getActiveObject();
    text.set({ fontStyle: 'italic' }); //Change the text
    this.canvas.renderAll(); //Update the canvas
  }
  underline() {
    let text = this.canvas.getActiveObject();
    text.set({ underline: true }); //Change the text
    this.canvas.renderAll(); //Update the canvas
  }
  textAlign() {
    let text = this.canvas.getActiveObject();
    text.set({ textAlign: 'right' }); //Change the text
    this.canvas.renderAll(); //Update the canvas
  }

  fontSize() {
    let text = this.canvas.getActiveObject();
    text.set({ fontSize: 36 }); //Change the text
    this.canvas.renderAll(); //Update the canvas
  }

  superscript() {
    let text = this.canvas.getActiveObject();
    //text.set({ fontWeight: 'bold' }); //Change the text
    text.setSuperscript();
    this.canvas.renderAll(); //Update the canvas
  }

  subscript() {
    let text = this.canvas.getActiveObject();
    //text.set({ fontWeight: 'bold' }); //Change the text
    text.setSubscript();
    this.canvas.renderAll(); //Update the canvas
  }

  strike() {
    let text = this.canvas.getActiveObject();
    text.set({ linethrough: true }); //Change the text
    this.canvas.renderAll(); //Update the canvas
  }

  fontColor() {
    let text = this.canvas.getActiveObject();
    //text.set({ setColor: 'red' }); //Change the text
    text.set({ fill: 'red' });
    this.canvas.renderAll(); //Update the canvas
  }

  fontBgColor() {
    let text = this.canvas.getActiveObject();
    text.set({ textBackgroundColor: 'rgb(0,200,0)' }); //Change the text
    this.canvas.renderAll(); //Update the canvas
  }
  /// text tool bar code ends ////////////

  /* //testing list style
 ListStyle (textObject,type,canvas) {
	var styles=['\u25CF','\u25C8','\u25D8','\u25BA','\u25CB','\u25A0','-'];
	var allStyles={'bullet':'\u25CF','diamond':'\u25C8','invertedBullet':'\u25D8','triangularBullet':'\u25BA','disced':'\u25CB','squared':'\u25A0','dashed':'-','none':''};
	var text = textObject.text;
	var textArray = text.split('\n')
	var tempStr = [];
	  textArray.forEach((text, i) => {
		if(styles.includes(text.substr(0,1))){
		  tempStr.push(text.replace(text.substr(0,1),allStyles[type]));
		}else{
		  tempStr.push(allStyles[type]+''+text);
		}
	  })
	textObject['text'] = tempStr.join('\n');
	canvas.renderAll();
  }
  ListStyle (canvas.getObjects()[0],'diamond',canvas);
  */

  ///////////////////////////////
  //End Fabric js code ==========================
}

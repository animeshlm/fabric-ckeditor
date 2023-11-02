# fabric-ckeditor
FABRIC JS WITH CKEDITOR

Introduction

The POC demonstrates usage of Fabric JS to create canvas interface where user can add various objects like text and images , and do operations like drag/sort/resize to create a final output and the same can be saved as JSON which can be stored and later used to recreate the canvas with same design as it was created

CKeditor to Canvas

Fabric JS however supports limited options of Text styling, therefore we have integrated CKEditor with fabric such that the text with whatever text styling ckeditor has same text will go to fabric canvas.

Real Time text edit

The ckeditor is integrated in such a way that if a text object selected in canvas , it is visible on ckeditor for editing and as you edit in ck editor, the canvas object changes in realtime.
To achieve this,  debouncing is used with ckeditor change event so that its not slow.
Moreover alternative libraries for html2canvas like dom-to-image and html-to-image can be used for faster result .

Demo
https://blank-to21di.stackblitz.io
Forked : https://stackblitz.com/edit/blank-caq9ej?file=app/artboard/artboard.component.ts


How to use this component

This component can be integrated in any angular application, provided necessary Input and libraries are there

Input & Depandancy

Input Eg
<artboard " [canvasId]=”i” ></artboard>

Dependency

https://www.npmjs.com/package/html2canvas
fabricjs
ckeditor

Note : as the component is under improvement code optimization is to be done 

[Edit in Codeflow ⚡️](https://stackblitz.com/~/github.com/animeshlm/fabric-ckeditor)

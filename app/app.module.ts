import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ArtboardComponent } from './artboard/artboard.component';

@NgModule({
  imports: [BrowserModule, FormsModule, CKEditorModule],
  declarations: [AppComponent, HelloComponent, ArtboardComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

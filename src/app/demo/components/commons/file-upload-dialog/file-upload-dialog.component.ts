import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent {


  @Input() visible: boolean = false;
  @Input() titulo: string = '';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() archivoSeleccionado = new EventEmitter<File>();
  @Output() cancelar = new EventEmitter<void>();
  @Output() subir = new EventEmitter<void>();

  archivo: File | null = null;

  onFileSelect(event: any) {
    const file = event.files[0];
    this.archivo = file;
    this.archivoSeleccionado.emit(file);
  }

  onCancelar() {
    this.archivo = null;
    this.cancelar.emit();
  }

  onSubir() {
    this.subir.emit();
  }

}

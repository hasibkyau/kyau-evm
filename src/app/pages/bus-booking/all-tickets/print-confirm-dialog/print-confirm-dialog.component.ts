import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-print-confirm-dialog',
  templateUrl: './print-confirm-dialog.component.html',
  styleUrls: ['./print-confirm-dialog.component.scss']
})
export class PrintConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PrintConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }




}

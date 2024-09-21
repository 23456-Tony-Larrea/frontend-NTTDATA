import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  @Input() message: string = '';
  @Input() duration: number = 3000; 
  @Input() backgroundColor: string = '#333';
  @Input() textColor: string = '#fff';

  showToast: boolean = false;

  ngOnInit(): void {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, this.duration);
  }
}
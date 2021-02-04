import { Injectable } from '@angular/core';
import { ToastyService, ToastOptions, ToastData } from 'ng2-toasty';

@Injectable({
  providedIn: 'root'
})
export class ThirdPartytoastyService {

  constructor(private toastyService: ToastyService) { }
  title: string;
  msg: string;
  showClose = true;
  theme = 'bootstrap';
  type = 'default';
  closeOther = false;
  addToast(options) {
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
    const toastOptions: ToastOptions = {
      title: options.title,
      msg: options.msg,
      showClose: options.showClose,
      timeout: options.timeout,
      theme: options.theme,
      onAdd: (toast: ToastData) => {
        /* added */
      },
      onRemove: (toast: ToastData) => {
        /* removed */
      }
    };

    switch (options.type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }
  addToastDefault(type, cud?) {

    switch (type) {
      case 'default': {
        break;
      }
      case 'success': {
        if (cud == 'Add') {
          this.addToast({ title: 'Added success', msg: '', timeout: 3000, closeOther: true, type: 'success' })
        } else if (cud == 'Edit') {
          this.addToast({ title: 'Edited success', msg: '', timeout: 3000, closeOther: true, type: 'success' })
        }else if (cud == 'delete') {
          this.addToast({ title: 'Deleted success', msg: '', timeout: 3000, closeOther: true, type: 'success' })
        }
        break;
      }
      case 'wait': {
        this.addToast({ title: 'Process', msg: 'Please wait...', timeout: 5000, closeOther: true, type: 'wait' })
        break;
      }
      case 'error': {
        this.addToast({ title: 'Process Faild!', msg: '', timeout: 5000, closeOther: true, type: 'error' })
        break;
      }
    }
  }
}

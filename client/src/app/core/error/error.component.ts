import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';
import { ErrorModel } from './error.model';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'error',
  templateUrl: 'error.component.html'
})

export class ErrorComponent implements OnInit, OnDestroy {

  public error: ErrorModel = new ErrorModel();
   public errorMessages:Message[]=[];
  private subscription: Subscription;
  constructor(private router: Router,
    private errorService: ErrorService) {

    this.subscription = this.errorService.getErrorMessage().subscribe(message => {
      this.error = message;
    });

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

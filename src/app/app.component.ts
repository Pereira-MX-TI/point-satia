import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NetworkStatusService } from './services/network-status.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {}

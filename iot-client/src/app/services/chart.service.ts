import { TelemetryData } from './../data/telemetry-data';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  dataStream: Observable<TelemetryData[]> = this.socket.fromEvent<TelemetryData[]>('telemetry');

  constructor(private socket: Socket) { }
}

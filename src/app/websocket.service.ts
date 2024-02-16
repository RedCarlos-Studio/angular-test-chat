import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Observable} from "rxjs";
import {InitDataI, WebSocketsEventsE} from "./models/init-data.model";
import {ResponseMessageI} from "./models/response.message.model";
import {environment} from "../environments/environment";

@Injectable()
export class WebsocketService {
  private readonly socket: Socket;
  private readonly response: Observable<ResponseMessageI>;
  private readonly welcomeResponse: Observable<InitDataI>;

  constructor() {
    this.socket = io(environment.serverUrl);
    this.welcomeResponse = this.initWelcomeObserver()
    this.response = this.initResponseObserver()
  }


  sendMessage(message: string) {
    this.socket.emit(WebSocketsEventsE.Message, message);
  }

  getWelcomeResponse(): Observable<InitDataI> {
    return this.welcomeResponse;
  }

  getResponse(): Observable<ResponseMessageI> {
    return this.response
  }

  private initWelcomeObserver() {
    return new Observable<InitDataI>((observer) => {
      this.socket.on(WebSocketsEventsE.Welcome, (data) => {
        observer.next(data);
      });
    });
  }

  private initResponseObserver() {
    return new Observable<ResponseMessageI>((observer) => {
      this.socket.on(WebSocketsEventsE.Response, (data) => {
        observer.next(data)
      })
    })
  }
}

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WebsocketService} from './websocket.service';
import {DestroySubscription} from "./shared/destroy-subscription";
import {AnswerI, InitDataI} from "./models/init-data.model";
import {ChatHistoryI, FormT} from "./models/chat.history.model";
import {takeUntil} from "rxjs";
import {ResponseMessageI} from "./models/response.message.model";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";

export const SCROLL_TIME = 100;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent extends DestroySubscription implements OnInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  sendFormType: FormT = 'SEND_FORM'
  timer!: NodeJS.Timeout;
  avatar: string = ''
  name: string = ''
  questions: AnswerI[] = [];
  messageList: ChatHistoryI[] = [];
  inputField: string = '';
  messageForm!: UntypedFormGroup;

  constructor(
    private websocketService: WebsocketService,
    private formBuilder: UntypedFormBuilder
  ) {
    super()
  }

  ngOnInit() {
    this.websocketService.getWelcomeResponse().pipe(takeUntil(this.destroyStream$)).subscribe((message: InitDataI) => {
      this.avatar = message.avatar
      this.name = message.userName
      this.questions = message.answers
    });

    this.websocketService.getResponse().pipe(takeUntil(this.destroyStream$)).subscribe((message: ResponseMessageI) => {
      this.messageList.push({
        isYourMessage: false,
        time: new Date,
        message: message.text,
        specialFlag: message.flag
      })

      if (message.flag === 'SEND_FORM') {
        this.initForm()
      }

      this.scrollToBottom()
    })
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    clearTimeout(this.timer);
  }

  sendMessage(message: string) {
    this.messageList.push({
      message: message,
      time: new Date,
      isYourMessage: true,
      specialFlag: ''
    })
    this.websocketService.sendMessage(message);
  }

  sendCustomMessage() {
    this.sendMessage(this.inputField)
    this.inputField = ''
  }

  sendMessageFromForm(message: ChatHistoryI) {
    const payload = this.messageForm.get('text')?.value

    const msgIdx = this.messageList.findIndex(item => item === message)

    this.websocketService.sendMessage(payload)

    if (msgIdx !== -1) {
      this.messageList[msgIdx].isAnswered = true
      this.messageList[msgIdx].answerOnSpecialFlag = payload
    }

    this.messageForm.reset()
  }

  private initForm() {
    this.messageForm = this.formBuilder.group({
      text: [null]
    })
  }

  private scrollToBottom(): void {
    this.timer = setTimeout(() => {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }, SCROLL_TIME)
  }
}

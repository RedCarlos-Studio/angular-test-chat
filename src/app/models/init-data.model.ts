export enum WebSocketsEventsE {
  Message = 'message',
  Welcome = 'welcome',
  Response = 'response',
}

export interface InitDataI {
  userName: string
  avatar: string
  answers: AnswerI[]
}

export interface AnswerI {
  text: string
}

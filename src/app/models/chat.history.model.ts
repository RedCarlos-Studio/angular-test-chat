export interface ChatHistoryI {
  isYourMessage: boolean
  message: string
  time: Date
  specialFlag: string
  answerOnSpecialFlag?: string
  isAnswered?: boolean
}

export type FormT = 'SEND_FORM'

export enum ToastPosition {
  TOP_CENTER = 'top-center',
  BOTTOM_CENTER = 'bottom-center',
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_LEFT = 'bottom-left'
}

export interface Toast {
  id: number
  message: string
  type: ToastType
  position: ToastPosition
  duration: number // Duration in milliseconds
  timerHandlerId?: ReturnType<typeof setTimeout> | null
}

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

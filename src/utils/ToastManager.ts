import { type Toast, ToastPosition, ToastType } from '@/types/toast'

/**
 * This class manages the toasts in the application.
 * It keeps track of the toasts and notifies the listeners when a toast is added or removed.
 * It also provides a method to add a toast with a message, type, position, and duration.
 * It is using the design pattern Singleton and Observer.
 */
class ToastManager {
  private toasts: Record<ToastPosition, Toast[]> = {
    'top-center': [],
    'bottom-center': [],
    'top-right': [],
    'top-left': [],
    'bottom-right': [],
    'bottom-left': [],
  }
  private listeners: Array<(toasts: Record<ToastPosition, Toast[]>) => void> = []
  private idCounter = 0
  private static instance: ToastManager | null = null

  // Singleton pattern
  static getInstance() {
    if (this.instance == null) {
      this.instance = new ToastManager()
    }
    return this.instance
  }

  getToasts() {
    return this.toasts
  }

  addToast(
    message: string,
    type: ToastType = ToastType.SUCCESS,
    position: ToastPosition = ToastPosition.TOP_CENTER,
    duration = 2000,
  ) {
    const toast: Toast = {
      id: this.idCounter++,
      message,
      type,
      position,
      duration,
    }
    this.toasts[position].push(toast)
    this.notify()

    if (duration > 0) {
      toast.timerHandlerId = setTimeout(() => {
        this.removeToast(toast.id, position)
      }, duration)
    }
  }

  removeToast(id: number, position: ToastPosition) {
    // Clear the timer if the toast has a duration
    const toast = this.toasts[position].find((toast) => toast.id === id)
    if (toast?.timerHandlerId) {
      clearTimeout(toast.timerHandlerId)
    }
    this.toasts[position] = this.toasts[position].filter((toast) => toast.id !== id)
    this.notify()
  }

  subscribe(listener: (toasts: Record<ToastPosition, Toast[]>) => void) {
    // Check if the listener is already subscribed
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener)
    }
  }

  unsubscribe(listener: (toasts: Record<ToastPosition, Toast[]>) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  // Notify all the listeners
  private notify() {
    this.listeners.forEach((listener) => {
      listener(this.toasts)
    })
  }
}

export const toastManager = ToastManager.getInstance()

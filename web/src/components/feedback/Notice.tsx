import { Toaster, toast } from 'sonner'
import 'sonner/dist/styles.css'

const toastOptions = {
  unstyled: true,
  duration: 3400,
  closeButtonAriaLabel: 'Fechar aviso',
  classNames: {
    toast: 'loja-toast',
    title: 'loja-toast-title',
    content: 'loja-toast-body',
    closeButton: 'loja-toast-x',
    error: 'is-error',
  },
} as const

export function NoticeHost() {
  return (
    <Toaster
      position="top-center"
      offset={{ top: 40, right: 16, bottom: 16, left: 16 }}
      mobileOffset={{ top: 24, right: 12, bottom: 12, left: 12 }}
      duration={3400}
      closeButton
      containerAriaLabel="Avisos"
      toastOptions={toastOptions}
      icons={{
        success: <span className="loja-toast-mark" aria-hidden="true" />,
        error: <span className="loja-toast-mark is-error" aria-hidden="true" />,
        close: <span aria-hidden="true">×</span>,
      }}
    />
  )
}

export function notice(message: string) {
  toast.success(message)
}

export function noticeError(message: string, id?: string) {
  toast.error(message, id ? { id } : undefined)
}

export function clearNotice(id: string) {
  toast.dismiss(id)
}

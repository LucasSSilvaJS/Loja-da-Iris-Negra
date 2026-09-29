import { useBagDock } from '../checkout/CartDrawer'
import { useChatDock } from './ChatDock'

type CornerDockProps = {
  chatOpen: boolean
  showChat: boolean
  onChatOpenChange: (open: boolean) => void
}

export function CornerDock({ chatOpen, showChat, onChatOpenChange }: CornerDockProps) {
  const bag = useBagDock()
  const chat = useChatDock({ open: chatOpen, onOpenChange: onChatOpenChange })

  return (
    <div className="corner-dock">
      <div className="corner-panels">
        {bag.panel}
        {showChat && chat.panel}
      </div>
      <div className="corner-toggles">
        {bag.button}
        {showChat && chat.button}
      </div>
    </div>
  )
}

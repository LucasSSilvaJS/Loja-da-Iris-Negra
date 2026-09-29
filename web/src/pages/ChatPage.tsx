import { useNavigate } from 'react-router-dom'
import { ChatPanel } from '../components/layout/ChatPanel'
import { usePageTitle } from '../hooks/usePageTitle'

export function ChatPage() {
  usePageTitle('Chat')
  const navigate = useNavigate()

  return (
    <div className="chat-page">
      <ChatPanel onClose={() => navigate('/')} />
    </div>
  )
}

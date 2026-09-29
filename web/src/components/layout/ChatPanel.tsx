import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type UIEvent } from 'react'
import { MdChatBubble, MdClose, MdSend } from 'react-icons/md'
import { clearNotice, noticeError } from '../feedback/Notice'
import { chatService } from '../../services/chat.service'
import type { ChatMessage } from '../../types/domain'

const NICKNAME_KEY = 'iris-negra-apelido'

type ChatPanelProps = {
  onClose: () => void
}

function readNickname(): string {
  const saved = localStorage.getItem(NICKNAME_KEY)?.trim() ?? ''
  return saved.length >= 2 ? saved.slice(0, 24) : ''
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [nickname, setNickname] = useState(readNickname)
  const [draftName, setDraftName] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [pinned, setPinned] = useState(true)
  const [unseen, setUnseen] = useState(0)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const logRef = useRef<HTMLOListElement>(null)
  const knownCount = useRef(0)

  useEffect(() => {
    if (nickname) messageRef.current?.focus()
  }, [nickname])

  useEffect(() => {
    if (!nickname) return
    let active = true

    const load = () => {
      chatService.list().then(
        (next) => {
          if (!active) return
          clearNotice('chat-caiu')
          setMessages(next)
        },
        (reason: unknown) => {
          if (!active) return
          noticeError(reason instanceof Error ? reason.message : 'O chat caiu.', 'chat-caiu')
        },
      )
    }

    load()
    const timer = window.setInterval(() => {
      if (!document.hidden) load()
    }, 8000)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [nickname])

  useEffect(() => {
    const added = messages.length - knownCount.current
    knownCount.current = messages.length
    if (added <= 0) return
    const log = logRef.current
    if (pinned && log) {
      log.scrollTop = log.scrollHeight
      return
    }
    if (!pinned) setUnseen((count) => count + added)
  }, [messages, pinned])

  function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = draftName.trim().slice(0, 24)
    if (next.length < 2) {
      noticeError('O nome precisa de pelo menos 2 letras.')
      return
    }
    localStorage.setItem(NICKNAME_KEY, next)
    setNickname(next)
  }

  function forgetName() {
    localStorage.removeItem(NICKNAME_KEY)
    setNickname('')
    setDraftName('')
    setMessages([])
    knownCount.current = 0
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = body.trim()
    if (!text || sending) return
    setSending(true)
    try {
      const created = await chatService.send(nickname, text)
      setPinned(true)
      setUnseen(0)
      setMessages((current) => [...current, created].slice(-40))
      setBody('')
    } catch (reason) {
      noticeError(reason instanceof Error ? reason.message : 'Não entrou.')
    } finally {
      setSending(false)
      messageRef.current?.focus()
    }
  }

  function onComposerKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  function onLogScroll(event: UIEvent<HTMLOListElement>) {
    const log = event.currentTarget
    const atEnd = log.scrollHeight - log.scrollTop - log.clientHeight < 48
    setPinned(atEnd)
    if (atEnd) setUnseen(0)
  }

  function jumpToLatest() {
    const log = logRef.current
    if (!log) return
    log.scrollTop = log.scrollHeight
    setPinned(true)
    setUnseen(0)
    messageRef.current?.focus()
  }

  return (
    <section className="chat" aria-label="Chat da loja">
      <header className="chat-head">
        <p className="news-kicker">
          <MdChatBubble aria-hidden="true" />
          Chat
        </p>
        <div className="chat-head-actions">
          {nickname && (
            <button className="chat-quiet" type="button" onClick={forgetName}>
              trocar nome
            </button>
          )}
          <button className="chat-close" type="button" onClick={onClose} aria-label="Fechar chat">
            <MdClose aria-hidden="true" />
          </button>
        </div>
      </header>

      {!nickname ? (
        <form className="chat-form chat-gate" onSubmit={saveName}>
          <p>Pra entrar na conversa, diz seu nome.</p>
          <label>
            seu nome
            <input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              maxLength={24}
              required
              autoComplete="nickname"
            />
          </label>
          <button className="solid" type="submit">
            entrar
          </button>
        </form>
      ) : (
        <>
          <div className="chat-thread">
            <ol
              ref={logRef}
              className="chat-log"
              role="log"
              aria-label="Mensagens"
              onScroll={onLogScroll}
            >
              {messages.length === 0 && (
                <li className="chat-empty">ninguém falou ainda. solta um oi.</li>
              )}
              {messages.map((message, index) => {
                const mine = message.nickname.trim().toLowerCase() === nickname.trim().toLowerCase()
                const previous = messages[index - 1]
                const showDay = !previous || !sameDay(previous.createdAt, message.createdAt)
                const grouped =
                  previous &&
                  !showDay &&
                  previous.nickname.trim().toLowerCase() === message.nickname.trim().toLowerCase()
                return (
                  <li key={message.id} className="chat-row">
                    {showDay && <p className="chat-day">{formatDay(message.createdAt)}</p>}
                    <article className={mine ? 'bubble is-mine' : 'bubble'}>
                      {!grouped && (
                        <header>
                          <strong>{message.nickname}</strong>
                          <time dateTime={message.createdAt}>{formatClock(message.createdAt)}</time>
                        </header>
                      )}
                      <p>{message.body}</p>
                    </article>
                  </li>
                )
              })}
            </ol>
            {unseen > 0 && (
              <button className="chat-jump" type="button" onClick={jumpToLatest}>
                {unseen === 1 ? '1 nova' : `${unseen} novas`}
              </button>
            )}
          </div>
          <form className="chat-composer" onSubmit={(event) => void onSubmit(event)}>
            <label className="sr-only" htmlFor="chat-mensagem">
              mensagem
            </label>
            <textarea
              id="chat-mensagem"
              ref={messageRef}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              onKeyDown={onComposerKey}
              maxLength={280}
              rows={1}
              placeholder="escreve aqui"
              aria-describedby="chat-dica"
            />
            <button className="chat-send" type="submit" disabled={sending || body.trim().length === 0}>
              <MdSend aria-hidden="true" />
              enviar
            </button>
            <p id="chat-dica" className="chat-hint">
              Enter envia. Shift+Enter quebra a linha.
            </p>
          </form>
        </>
      )}
    </section>
  )
}

function sameDay(left: string, right: string): boolean {
  const a = new Date(left)
  const b = new Date(right)
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatDay(value: string): string {
  const date = new Date(value)
  if (isToday(date)) return 'hoje'
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getFullYear()}`
}

function isToday(date: Date): boolean {
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()
}

function formatClock(value: string): string {
  const date = new Date(value)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

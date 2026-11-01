import { useEffect, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react'
import { FaEnvelope, FaInstagram, FaPhone, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { holdContentScroll } from '../components/layout/ScrollToContent'
import { brand } from '../content/brand'
import { usePageTitle } from '../hooks/usePageTitle'

const tape = 'serena regina · imperatriz dos graves · rock, psicodelia nordestina · '

type AboutTab = 'loja' | 'conceito' | 'iris' | 'imperatriz' | 'album'

const tabs: { id: AboutTab; label: string }[] = [
  { id: 'loja', label: 'Loja' },
  { id: 'conceito', label: 'Conceito' },
  { id: 'iris', label: 'Sobre a Íris Negra' },
  { id: 'imperatriz', label: 'A Imperatriz' },
  { id: 'album', label: 'Incognocivo' },
]

export function AboutPage({ initialTab = 'loja' }: { initialTab?: AboutTab }) {
  const [tab, setTab] = useState<AboutTab>(initialTab)
  const holdRef = useRef<(() => void) | null>(null)
  const current = tabs.find((item) => item.id === tab) ?? tabs[0]
  usePageTitle(tab === 'loja' ? 'Sobre' : current.label)

  useEffect(() => () => holdRef.current?.(), [])

  function selectTab(id: AboutTab) {
    setTab(id)
    document.getElementById(`aba-${id}`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    holdRef.current?.()
    holdRef.current = holdContentScroll()
  }

  function onTabsKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((item) => item.id === tab)
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    if (!forward && !backward) return
    event.preventDefault()
    const next = tabs[(index + (forward ? 1 : tabs.length - 1)) % tabs.length]
    selectTab(next.id)
    document.getElementById(`aba-${next.id}`)?.focus()
  }

  return (
    <article className="about">
      <div className="about-tape" aria-hidden="true">
        <div>
          <span>{tape}</span>
          <span>{tape}</span>
        </div>
      </div>

      <div className="about-board">
        <div className="about-tabs" role="tablist" aria-label="Sobre" onKeyDown={onTabsKeyDown}>
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`aba-${item.id}`}
              className="about-tab"
              aria-selected={tab === item.id}
              aria-controls="sobre-painel"
              tabIndex={tab === item.id ? 0 : -1}
              onClick={() => selectTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          className="about-sheet"
          role="tabpanel"
          id="sobre-painel"
          aria-labelledby={`aba-${tab}`}
        >
          {tab === 'loja' && <LojaPanel />}
          {tab === 'conceito' && <ConceitoPanel />}
          {tab === 'iris' && <IrisPanel />}
          {tab === 'imperatriz' && <ImperatrizPanel />}
          {tab === 'album' && <AlbumPanel />}
        </div>
      </div>

      <aside className="about-contacts" aria-label="Contato">
        <p className="pixel">Contato</p>
        <a className="about-contact" href={`mailto:${brand.email}`}>
          <FaEnvelope aria-hidden="true" />
          {brand.email}
        </a>
        <a className="about-contact" href={brand.phoneHref}>
          <FaPhone aria-hidden="true" />
          {brand.phone}
        </a>
        <nav className="about-links" aria-label="Onde acompanhar">
          <a href={brand.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram aria-hidden="true" />
          </a>
          <a href={brand.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
            <FaYoutube aria-hidden="true" />
          </a>
        </nav>
      </aside>
    </article>
  )
}

function Still({
  src,
  alt,
  kind,
  width,
  height,
}: {
  src: string
  alt: string
  kind: 'mark' | 'art' | 'banner' | 'poster'
  width: number
  height: number
}) {
  return (
    <figure className={`about-still is-${kind}`}>
      <img src={src} alt={alt} width={width} height={height} />
    </figure>
  )
}

function StoryPanel({
  kicker,
  lines,
  still,
  children,
}: {
  kicker: string
  lines: string[]
  still?: ComponentProps<typeof Still>
  children: ReactNode
}) {
  return (
    <>
      <header className="about-mast">
        <p className="pixel">{kicker}</p>
        <h1>
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        {still?.kind === 'banner' ? <Still {...still} /> : null}
      </header>
      {still && still.kind !== 'banner' ? (
        <div className="about-split">
          <Still {...still} />
          <div className="about-prose">{children}</div>
        </div>
      ) : (
        <div className="about-prose">{children}</div>
      )}
    </>
  )
}

type MarkName =
  | 'spray'
  | 'cut'
  | 'bone'
  | 'heart'
  | 'star'
  | 'eye'
  | 'skull'
  | 'moon'
  | 'flame'
  | 'iris'
  | 'bolt'
  | 'crown'
  | 'wave'
  | 'disc'
  | 'bars'
  | 'mask'
  | 'film'
  | 'hanger'
  | 'raven'
  | 'play'

function Paperclip() {
  return (
    <span className="about-pin" aria-hidden="true">
      <svg viewBox="0 0 36 68">
        <path
          d="M14 8c0-3.4 10-3.4 10 1.4V44c0 7.2-10 7.2-10 0V16.5c0-3.2 6.4-3.2 6.4 0V40c0 3.4-3.2 3.4-3.2 0V18"
          fill="none"
          stroke="#1c1c1c"
          strokeWidth="5.4"
          strokeLinecap="round"
        />
        <path
          d="M14 8c0-3.4 10-3.4 10 1.4V44c0 7.2-10 7.2-10 0V16.5c0-3.2 6.4-3.2 6.4 0V40c0 3.4-3.2 3.4-3.2 0V18"
          fill="none"
          stroke="#d7dbe0"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M13.2 9c0-2.6 8.2-2.8 8.6 1"
          fill="none"
          stroke="#fff"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </span>
  )
}

function Ink({
  d,
  rule = 'nonzero',
  extra,
}: {
  d: string
  rule?: 'evenodd' | 'nonzero'
  extra?: ReactNode
}) {
  return (
    <svg viewBox="0 0 64 64">
      <path d={d} fill="#141414" fillRule={rule} transform="translate(2.4 3)" />
      <path
        d={d}
        fill="#734c9e"
        stroke="#141414"
        strokeWidth="1.35"
        strokeLinejoin="round"
        fillRule={rule}
      />
      {extra}
      <path
        d="M29 49c.8 4.2 1.2 7 .2 11.2-1.8-.5-2.5 1.7-3.4-.1 1-4.2.6-7.2 3.2-11.1z"
        fill="#734c9e"
        stroke="#141414"
        strokeWidth="0.7"
      />
    </svg>
  )
}

function LineInk({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g stroke="#141414" strokeWidth="8" transform="translate(2.2 2.6)">
        {children}
      </g>
      <g stroke="#734c9e" strokeWidth="4.6">
        {children}
      </g>
      <path d="M30 50 v11" stroke="#734c9e" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
}

function Stack({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64">
      <g fill="#141414" transform="translate(2.6 3.2)">
        {children}
      </g>
      <g fill="#734c9e">{children}</g>
      <path
        d="M29 49c.8 4.2 1.2 7 .2 11.2-1.8-.5-2.5 1.7-3.4-.1 1-4.2.6-7.2 3.2-11.1z"
        fill="#734c9e"
        stroke="#141414"
        strokeWidth="0.7"
      />
    </svg>
  )
}

function StreetMark({ name }: { name: MarkName }) {
  const tilt: Record<MarkName, number> = {
    spray: 8,
    cut: -7,
    bone: 6,
    heart: -12,
    star: 10,
    eye: -4,
    skull: 7,
    moon: -9,
    flame: 5,
    iris: -6,
    bolt: 9,
    crown: -3,
    wave: 4,
    disc: -8,
    bars: 6,
    mask: -5,
    film: 8,
    hanger: -10,
    raven: 7,
    play: -6,
  }
  return (
    <span className="about-mark" style={{ rotate: `${tilt[name]}deg` }} aria-hidden="true">
      {name === 'spray' && (
        <Ink d="M28 8h8v7h-8zM37 12h9l-2 5h-7zM20 22h18l5 7v20a6 6 0 0 1-6 6H23a6 6 0 0 1-6-6V29z" />
      )}
      {name === 'cut' && (
        <LineInk>
          <path d="M18 40 L40 12" />
          <path d="M44 40 L22 12" />
          <circle cx="15" cy="42" r="5.5" />
          <circle cx="47" cy="42" r="5.5" />
        </LineInk>
      )}
      {name === 'bone' && (
        <Stack>
          <rect x="17" y="26" width="30" height="12" />
          <circle cx="18" cy="23" r="8" />
          <circle cx="18" cy="41" r="8" />
          <circle cx="46" cy="23" r="8" />
          <circle cx="46" cy="41" r="8" />
        </Stack>
      )}
      {name === 'heart' && <Ink d="M32 54C14 40 8 28 16 18 22 11 30 16 32 23 34 16 42 11 48 18 56 28 50 40 32 54Z" />}
      {name === 'star' && (
        <Ink d="M32 6l5.2 15.2H54L41 31l5 16-14-9.2L18 47l5-16L10 21.2h16.8z" />
      )}
      {name === 'eye' && (
        <Ink
          d="M4 32C14 16 24 10 32 10s18 6 28 22C50 48 40 54 32 54S14 48 4 32z"
          extra={
            <>
              <circle cx="32" cy="32" r="8" fill="#141414" />
              <circle cx="29" cy="29" r="2.3" fill="#fff" />
            </>
          }
        />
      )}
      {name === 'skull' && (
        <Ink
          d="M32 6C18 6 10 16 10 28c0 9 5 16 12 20v8h6v-8h8v8h6v-8c7-4 12-11 12-20C54 16 46 6 32 6zM22 27a5 6 0 1 1 .1 0zM41 27a5 6 0 1 1 .1 0zM28 38h8l-1 6h-6z"
          rule="evenodd"
        />
      )}
      {name === 'moon' && (
        <Ink d="M48 8C30 8 14 20 14 32 14 48 30 56 48 56 34 50 26 42 26 32 26 20 34 12 48 8Z" />
      )}
      {name === 'flame' && (
        <Ink d="M32 4c2 12 14 14 12 26 8-6 12 8 2 18-6 8-20 8-24-2-8 2-10-10-2-14-2-8 6-8 8-16 0 6 2 8 4-12z" />
      )}
      {name === 'iris' && (
        <Ink
          d="M32 20c4-10 14-8 12 0 10-6 16 6 8 12 8 6 0 16-8 12 2 10-8 12-12 2-4 10-14 8-12-2-10 6-16-6-8-12-8-6 2-16 8-12 2-8 8-10 12 0z"
          extra={<circle cx="32" cy="32" r="4.2" fill="#141414" />}
        />
      )}
      {name === 'bolt' && <Ink d="M36 4 16 34h14L24 60l26-34H34z" />}
      {name === 'crown' && <Ink d="M8 46 12 20l12 12L32 8l8 24 12-12 4 26z" />}
      {name === 'wave' && (
        <LineInk>
          <path d="M12 24c6-8 10-8 16 0s10 8 16 0 8-8 12 0" />
          <path d="M12 36c6-8 10-8 16 0s10 8 16 0 8-8 12 0" />
          <path d="M16 46c5-6 8-6 13 0s8 6 13 0" />
        </LineInk>
      )}
      {name === 'disc' && (
        <Ink
          d="M32 6a26 26 0 1 0 .01 0zM32 24a8 8 0 1 1-.01 0z"
          rule="evenodd"
          extra={<path d="M32 10l2 14" stroke="#141414" strokeWidth="2" />}
        />
      )}
      {name === 'bars' && <Ink d="M12 40h10V14H12zM27 40h10V8H27zM42 40h10V20H42z" />}
      {name === 'mask' && (
        <Ink
          d="M32 8C18 8 8 20 8 32c0 16 10 24 24 24s24-8 24-24C56 20 46 8 32 8zM22 28a3.2 4 0 1 1 .1 0zM42 28a3.2 4 0 1 1 .1 0zM22 40q10 9 20 0-10 5-20 0z"
          rule="evenodd"
        />
      )}
      {name === 'film' && (
        <Ink
          d="M16 12h32v40H16zM20 16h5v5h-5zM20 24h5v5h-5zM20 32h5v5h-5zM20 40h5v5h-5zM39 16h5v5h-5zM39 24h5v5h-5zM39 32h5v5h-5zM39 40h5v5h-5z"
          rule="evenodd"
          extra={<path d="M29 24h2l8 8-8 8h-2z" fill="#141414" />}
        />
      )}
      {name === 'hanger' && (
        <LineInk>
          <path d="M32 14a5 5 0 1 1 .1 0" />
          <path d="M32 19 V26" />
          <path d="M32 26 L12 44 H52 Z" />
        </LineInk>
      )}
      {name === 'raven' && (
        <Ink d="M8 34c8-2 16-6 22-8-2-8 6-16 14-12-4 5-4 9 0 11l16-4-8 8 10 3-14 1c-1 7-8 7-12 2l-3 10-6-11c-8 3-14 1-19 0z" />
      )}
      {name === 'play' && <Ink d="M20 10 52 32 20 54Z" />}
    </span>
  )
}

function Note({
  mark,
  className,
  children,
}: {
  mark: MarkName
  className?: string
  children: ReactNode
}) {
  return (
    <p className={className ? `about-note ${className}` : 'about-note'}>
      <Paperclip />
      <StreetMark name={mark} />
      {children}
    </p>
  )
}

function LojaPanel() {
  return (
    <>
      <header className="about-mast">
        <p className="pixel">Sobre</p>
        <h1>
          <span>Somos mais</span>
          <span>do que</span>
          <span>merchandising</span>
        </h1>
        <Still
          kind="mark"
          src="/press/marca.webp"
          alt="Íris desenhada em magenta e roxo, a marca do press kit."
          width={640}
          height={614}
        />
        <Note mark="spray" className="about-deck">
          Criamos estampas com identidade própria — pensadas para quem vive a nossa música ou
          simplesmente veste o que tem personalidade.
        </Note>
      </header>

      <p className="about-rule">Aqui, o alternativo ganha todas as suas formas</p>

      <div className="about-list">
        <section className="about-row is-flagship" aria-labelledby="forma-moda">
          <div className="about-name">
            <p className="about-num">01 · carro-chefe</p>
            <h2 id="forma-moda">
              Moda <span>&amp; Upcycling</span>
            </h2>
          </div>
          <Note mark="cut">
            O carro-chefe da nossa criação. Além de peças prontas do nosso catálogo, transformamos
            roupas antigas em artigos únicos e sustentáveis. Quer dar nova vida a uma peça sua? A
            própria Eva assina a personalização exclusiva no estilo da marca.
          </Note>
        </section>

        <section className="about-row" aria-labelledby="forma-acessorios">
          <div className="about-name">
            <p className="about-num">02</p>
            <h2 id="forma-acessorios">
              Acessórios <span>&amp; Detalhes</span>
            </h2>
          </div>
          <Note mark="bone">
            Joias autorais em osso, bonés e artigos de tabacaria para compor a sua identidade no dia
            a dia.
          </Note>
        </section>

        <section className="about-row" aria-labelledby="forma-intimidade">
          <div className="about-name">
            <p className="about-num">03</p>
            <h2 id="forma-intimidade">
              Intimidade <span>&amp; Cuidado</span>
            </h2>
          </div>
          <Note mark="heart">
            Kits e caixas especiais para namorados e uma curadoria seleta de produtos de sex shop,
            trazendo liberdade, afeto e atitude para a rotina.
          </Note>
        </section>
      </div>

      <footer className="about-close">
        <Link to="/">Garimpe o catálogo</Link>
        <Note mark="star">Mande sua peça para customizar e saia do comum sem pedir licença.</Note>
      </footer>
    </>
  )
}

function ConceitoPanel() {
  return (
    <StoryPanel
      kicker="Conceito"
      lines={['Por que você', 'tem medo', 'da morte?']}
      still={{
        kind: 'art',
        src: '/press/conceito.jpg',
        alt: 'Mão com unhas longas sobre cartas ilustradas.',
        width: 900,
        height: 921,
      }}
    >
      <Note mark="eye">
        Mesmo que tenhamos alguma compreensão científica e cultural sobre a morte, ainda há
        aspectos que permanecem misteriosos e insondáveis. Isso desperta minha exploração por questões
        filosóficas que ressoam ao longo da existência e que desafiam nossa limitada percepção do
        que está além da vida.
      </Note>
      <Note mark="skull">
        A Íris Negra surge do fascínio pelos sentimentos despertados durante os devaneios sobre o
        desconhecido e pela reflexão obsessiva sobre os abismos que a humanidade evita encarar: o
        medo da morte, o absurdo da vida e o ato de se permitir ser em sua totalidade.
      </Note>
      <Note mark="moon">
        Pouco se discute sobre quão belo e intrigante o desconhecido pode ser, mas ele desperta
        nossa curiosidade, alimenta a imaginação e evoca nossos medos mais profundos.
      </Note>
      <Note mark="flame">
        Incognocivo mergulha e se permite afundar nos mistérios das escolhas humanas, narrando uma
        história em que paixão, traição, sofrimento e renascimento se entrecruzam com o universo do
        desconhecido.
      </Note>
    </StoryPanel>
  )
}

function IrisPanel() {
  return (
    <StoryPanel
      kicker="Sobre a Íris Negra"
      lines={['Íris', 'Negra']}
      still={{
        kind: 'art',
        src: '/press/iris.jpg',
        alt: 'Fotografia em preto e branco de uma íris.',
        width: 900,
        height: 991,
      }}
    >
      <Note mark="iris">
        A Íris Negra é um projeto musical e performático idealizado pela baixista e vocalista Serena
        Regina, a Imperatriz dos Graves.
      </Note>
      <Note mark="bolt">
        Nascido em Recife, o projeto une rock, psicodelia nordestina e elementos eletrônicos. A
        estética transita entre o erótico e o místico e dialoga com teatro, moda, dança e
        audiovisual. O objetivo é propor experiências sensoriais que provocam o corpo, a mente e o
        inconsciente.
      </Note>
    </StoryPanel>
  )
}

function ImperatrizPanel() {
  return (
    <StoryPanel
      kicker="A criadora"
      lines={['Imperatriz', 'dos Graves']}
      still={{
        kind: 'banner',
        src: '/press/imperatriz.jpg',
        alt: 'Serena Regina, a Imperatriz dos Graves, com pintura no rosto e colar de metal.',
        width: 1400,
        height: 535,
      }}
    >
      <Note mark="crown">
        A Imperatriz dos Graves, criatura oriunda de Recife, a cidade dos manguezais, onde a lama
        molda os corpos, carrega em suas veias heranças afro-indígenas e paraibanas. Em suas mãos,
        o contrabaixo elétrico, instrumento absoluto de sua linguagem e de suas composições.
      </Note>
      <Note mark="wave">
        Musicista e educadora musical, é figura de destaque na cena underground da cidade:
        baixista, performer e arquiteta dos universos sonoros que conduzem a Íris Negra.
      </Note>
    </StoryPanel>
  )
}

function AlbumPanel() {
  return (
    <>
      <header className="about-mast">
        <p className="pixel">Álbum atual</p>
        <h1>
          <span>Incognocivo</span>
        </h1>
        <Still
          kind="art"
          src="/press/capa.jpg"
          alt="Capa do EP Incognocivo: íris negra, sol, lua e o nome da banda."
          width={900}
          height={916}
        />
        <Note mark="disc" className="about-deck">
          Obra principal que sustenta toda a narrativa. Cinco faixas em sequência, cada uma um passo
          da jornada.
        </Note>
      </header>

      <p className="about-rule">E.V.A. · Dream of Falling Teeth · Raven · A Bruxa · A Lua</p>

      <div className="about-list">
        <section className="about-row is-flagship" aria-labelledby="obra-ep">
          <div className="about-name">
            <p className="about-num">01</p>
            <h2 id="obra-ep">
              EP <span>musical</span>
            </h2>
          </div>
          <Note mark="bars">
            Rock experimental que flerta com ritmos diversos, incluindo elementos regionais
            nordestinos e música eletrônica. O resultado é uma experiência sonora dramática e
            misteriosa, mas ao mesmo tempo quente e dançante.
          </Note>
        </section>

        <section className="about-row" aria-labelledby="obra-show">
          <div className="about-name">
            <p className="about-num">02</p>
            <h2 id="obra-show">
              Espetáculo <span>musical</span>
            </h2>
          </div>
          <Note mark="mask">
            O espetáculo dá vida às emoções e dilemas do EP. Interpretação cênica e dança
            contemporânea seguem a trilha executada pela própria Íris Negra, cujos integrantes
            personificam figuras que habitam o desconhecido. A Imperatriz conduz rituais e questiona
            o medo da morte, o absurdo da vida e o ato de se permitir ser. Estreia no Teatro
            Fernando Santa Cruz, em Olinda, em 31 de outubro de 2025.
          </Note>
          <Still
            kind="banner"
            src="/press/palco.jpg"
            alt="Íris Negra no palco, com a Imperatriz ao centro."
            width={1241}
            height={697}
          />
        </section>

        <section className="about-row" aria-labelledby="obra-curta">
          <div className="about-name">
            <p className="about-num">03</p>
            <h2 id="obra-curta">
              Curta <span>metragem</span>
            </h2>
          </div>
          <Note mark="film">
            Um paralelo entre o mundo oculto e o humano: a jornada de autoconhecimento da
            Imperatriz combinada ao enredo do EP. Horror psicológico em cenários pernambucanos, e um
            convite à autorreflexão sobre crenças e costumes diante das fragilidades da psique.
          </Note>
        </section>

        <section className="about-row" aria-labelledby="obra-moda">
          <div className="about-name">
            <p className="about-num">04</p>
            <h2 id="obra-moda">Figurino</h2>
          </div>
          <Note mark="hanger">
            O figurino não veste o corpo: veste a obra. Peças de brechó ressignificadas transformam
            moda sustentável em linguagem estética. A ancestralidade afro-indígena encontra a
            sobriedade gótica, e cores quentes rompem o preto. Entre o sagrado e o profano.
          </Note>
        </section>

        <section className="about-row" aria-labelledby="obra-clipe">
          <div className="about-name">
            <p className="about-num">05</p>
            <h2 id="obra-clipe">Raven</h2>
          </div>
          <Note mark="raven">
            Terceira faixa do EP e primeiro desdobramento audiovisual da obra. Produzido pela
            Subverso LAB em parceria com a Cabraquente Filmes, une performance, simbolismo e
            direção artística. O clipe está aqui embaixo.
          </Note>
          <Still
            kind="poster"
            src="/press/raven.jpg"
            alt="Cartaz de Raven, com a Imperatriz de coroa."
            width={633}
            height={896}
          />
        </section>
      </div>

      <footer className="about-close">
        <a href={brand.ep} target="_blank" rel="noreferrer">
          Ouça o EP
        </a>
        <Note mark="play">Incognocivo está no ar. Raven, a terceira faixa, abre o clipe abaixo.</Note>
      </footer>

      <figure className="about-clip">
        <figcaption className="about-clip-bar">
          <span className="pixel">Raven</span>
        </figcaption>
        <iframe
          src="https://www.youtube.com/embed/6PmC4s-UtYY"
          title="Íris Negra — Raven, o último clipe"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </figure>
    </>
  )
}

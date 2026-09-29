import { FaInstagram, FaYoutube } from 'react-icons/fa'
import { brand } from '../content/brand'
import { usePageTitle } from '../hooks/usePageTitle'

const tape = 'serena regina · imperatriz dos graves · rock, psicodelia nordestina · '

export function AboutPage() {
  usePageTitle('Sobre')

  return (
    <article className="about">
      <div className="about-tape" aria-hidden="true">
        <div>
          <span>{tape}</span>
          <span>{tape}</span>
        </div>
      </div>

      <section className="about-panel">
        <h1>Íris Negra</h1>
        <p>
          Idealizado por Serena Regina, a Imperatriz dos Graves, o projeto une rock, psicodelia
          nordestina e elementos eletrônicos, criando uma estética intensa que transita entre o
          sagrado e o profano, o erótico e o místico. Uma experiência performática que
          ressignifica matrizes afro-indígenas em uma linguagem contemporânea e experimental.
        </p>
      </section>

      <nav className="about-links" aria-label="Onde acompanhar">
        <a href={brand.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
          <FaInstagram aria-hidden="true" />
        </a>
        <a href={brand.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
          <FaYoutube aria-hidden="true" />
        </a>
      </nav>

      <figure className="about-clip">
        <figcaption className="pixel">Raven</figcaption>
        <iframe
          src="https://www.youtube.com/embed/6PmC4s-UtYY"
          title="Íris Negra — Raven, o último clipe"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </figure>
    </article>
  )
}

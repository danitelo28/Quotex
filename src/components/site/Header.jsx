import { Link } from 'react-router-dom'
import { QuotexLogo } from '../Icons.jsx'
import LanguageMenu from '../LanguageMenu.jsx'

export default function Header() {
  return (
    <div className="header__wrapper">
      <header className="header" id="top">
        <div className="header__menu">
          <Link to="/" className="header__logo">
            <QuotexLogo height={26} />
          </Link>

          <nav className="header__links">
            <ul className="header__list">
              <li className="header__list--item">
                <Link to="/trade">Demo account</Link>
              </li>
              <li className="header__list--item">
                <a href="#about">About us</a>
              </li>
              <li className="header__list--item">
                <a href="#faq">FAQ</a>
              </li>
              <li className="header__list--item">
                <a href="#blog">Blog</a>
              </li>
            </ul>
          </nav>

          <div className="header__buttons">
            <Link to="/" className="header__button-log-in">
              Log in
            </Link>
            <Link to="/?signup=1" className="header__button" id="button-sign-up">
              Sign up
            </Link>
            <span className="header__language desktop" style={{ marginLeft: 24 }}>
              <LanguageMenu />
            </span>
          </div>

          <button className="header__mobile-button" aria-label="Menu">
            <div id="nav-icon">
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </header>
    </div>
  )
}

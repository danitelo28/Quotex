import {
  QuotexLogo,
  ArrowChevronRight,
  PlayStoreIcon,
  PwaIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from '../Icons.jsx'

export default function Footer() {
  return (
    <footer className="footer" dir="auto">
      <div className="footer__block">
        <a className="footer__logo" href="#">
          <QuotexLogo height={30} />
        </a>

        <div className="footer__links">
          <nav>
            <ul>
              <li>
                <a className="footer__links-section" href="#">
                  FAQ
                  <ArrowChevronRight size={18} />
                </a>
              </li>
              <li>
                <a className="footer__links-item" href="#">
                  General questions
                </a>
              </li>
              <li>
                <a className="footer__links-item" href="#">
                  Financial questions
                </a>
              </li>
              <li>
                <a className="footer__links-item" href="#">
                  Verification
                </a>
              </li>
            </ul>
          </nav>

          <nav>
            <ul>
              <li>
                <a className="footer__links-section" href="#">
                  About us
                  <ArrowChevronRight size={18} />
                </a>
              </li>
              <li>
                <a className="footer__links-item" href="#">
                  Reviews
                </a>
              </li>
              <li>
                <a className="footer__links-item" href="#">
                  Contacts
                </a>
              </li>
            </ul>
          </nav>

          <nav>
            <ul>
              <li>
                <div className="footer__links-section__title">More</div>
              </li>
              <li>
                <a className="footer__links-item" href="#">
                  Demo account
                </a>
              </li>
              <li>
                <a className="footer__links-item" href="#">
                  Affiliate program
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer__right">
          <div className="footer__social-title">Download the app</div>

          <div className="footer__app-row">
            <a className="footer__playmarket" href="#">
              <PlayStoreIcon />
            </a>
            <a className="footer__pwamarket" href="#">
              <PwaIcon />
            </a>
          </div>

          <div className="footer__social-title">Follow us on social media</div>

          <a className="footer__social-item" href="#">
            <FacebookIcon size={20} />
            <div>32K+</div>
          </a>

          <a className="footer__social-item" href="#">
            <InstagramIcon size={20} />
            <div>110K+</div>
          </a>

          <a className="footer__social-item" href="#">
            <TelegramIcon size={20} />
            <div>390K+</div>
          </a>
        </div>
      </div>

      <div className="footer__container">
        <nav>
          <ul>
            <li>
              <p className="footer__section-title">Regulations</p>
            </li>
            <li>
              <a className="footer__links-item" href="#">
                Privacy policy
              </a>
            </li>
            <li>
              <a className="footer__links-item" href="#">
                Service agreement
              </a>
            </li>
            <li>
              <a className="footer__links-item" href="#">
                Risk disclosure
              </a>
            </li>
            <li>
              <a className="footer__links-item" href="#">
                Rules of trading operations
              </a>
            </li>
            <li>
              <a className="footer__links-item" href="#">
                Non-trading operations regulations
              </a>
            </li>
            <li>
              <a className="footer__links-item" href="#">
                Payment policy
              </a>
            </li>
          </ul>
        </nav>

        <div className="footer__text">
          <p>ON SPOT GROUP LLC. Address: Main Street, P.O. Box 625, Charlestown, St. Kitts and Nevis.</p>
          <br />
          <p>
            The website services are not available in a number of countries, including USA, Canada, Hong Kong, EEA
            countries, Israel, Russia as well as for persons under 18 years of age.
          </p>
          <br />
          <p>
            Risk Warning: Trading Forex and Leveraged Financial Instruments involves significant risk and can result in
            the loss of your invested capital. You should not invest more than you can afford to lose and should ensure
            that you fully understand the risks involved. Trading leveraged products may not be suitable for all
            investors. Trading non-leveraged products such as stocks also involves risk as the value of a stock can
            fall as well as rise, which could mean getting back less than you originally put in. Past performance is no
            guarantee of future results. Before trading, please take into consideration your level of experience,
            investment objectives and seek independent financial advice if necessary.
          </p>
          <br />
          <br />
          <p>ON SPOT GROUP LLC is the owner of the qxbroker.com domain.</p>
          <p>Copyright © 2026 Quotex. All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}

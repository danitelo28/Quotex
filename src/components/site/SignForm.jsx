import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Select from '../Select.jsx'
import { ArrowRightIcon, EyeShowIcon, EyeHideIcon, GoogleIcon } from '../Icons.jsx'

const CURRENCIES = [
  'GBP', 'USD', 'BRL', 'IDR', 'MYR', 'INR', 'KZT', 'THB', 'UAH', 'VND', 'NGN',
  'EGP', 'MXN', 'JPY', 'BDT', 'PKR', 'PHP', 'TRY', 'KRW',
].map((c) => ({ value: c, label: c }))

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Azerbaijan',
  'Bangladesh', 'Belarus', 'Belgium', 'Brazil', 'Bulgaria', 'Cambodia', 'Cameroon', 'Canada',
  'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Czech Republic', 'Denmark', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Georgia', 'Germany',
  'Ghana', 'Greece', 'Guatemala', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kuwait', 'Kyrgyzstan', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg', 'Malaysia', 'Malta', 'Mexico',
  'Moldova', 'Mongolia', 'Morocco', 'Myanmar', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'North Macedonia',
  'Norway', 'Oman', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Saudi Arabia', 'Senegal', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan', 'Tanzania', 'Thailand', 'Tunisia',
  'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Venezuela', 'Vietnam', 'Zambia', 'Zimbabwe',
].map((c) => ({ value: c, label: c }))

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SocialFooter({ onGoogle }) {
  return (
    <div className="modal-sign__footer">
      <div className="modal-sign__footer-header">
        <div className="modal-sign__footer-header-text">Sign in via</div>
      </div>
      <div className="modal-sign__social">
        <a
          href="#"
          className="modal-sign__social-button google"
          onClick={(e) => {
            e.preventDefault()
            onGoogle()
          }}
        >
          <GoogleIcon />
        </a>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className={`modal-sign__input${error ? ' error' : ''}`}>
      <label className="modal-sign__input-label">{label}</label>
      {children}
      {error && <div className="modal-sign__input-error__text"><p>{error}</p></div>}
    </div>
  )
}

function PasswordField({ id, label = 'Password', value, onChange }) {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <input
        type={visible ? 'text' : 'password'}
        name="password"
        id={id}
        className="modal-sign__input-value"
        value={value}
        onChange={onChange}
        autoComplete="new-password"
        spellCheck="false"
      />
      <button
        type="button"
        className="modal-sign__input-toggle"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
      >
        {visible ? <EyeHideIcon size={20} /> : <EyeShowIcon size={20} />}
      </button>
    </>
  )
}

function Checkbox({ name, children, checked = false, onChange }) {
  return (
    <label className="modal-sign__checked-container">
      <input type="checkbox" name={name} value="1" checked={checked} onChange={onChange} />
      <span className="modal-sign__checked-checkmark"></span>
      <div className="modal-sign__checked-text">{children}</div>
    </label>
  )
}

function SubmitButton({ children, loading }) {
  return (
    <button className="modal-sign__block-button" type="submit" disabled={loading}>
      <div>{loading ? 'Please wait...' : children}</div>
      <ArrowRightIcon size={24} />
    </button>
  )
}

function LoginTab({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!EMAIL_RE.test(email)) errs.email = 'Please enter a valid email address'
    if (!password) errs.password = 'Please enter your password'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setTimeout(onSuccess, 900)
  }

  return (
    <form action="#" onSubmit={submit} dir="auto" noValidate>
      <Field label="Email" error={errors.email}>
        <input
          type="email"
          name="email"
          className="modal-sign__input-value"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
      </Field>

      <Field label="Password" error={errors.password}>
        <PasswordField name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>

      <div className="modal-sign__input">
        <div className="modal-sign__block-checked">
          <Checkbox name="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)}>
            Remember me
          </Checkbox>
          <a href="#forgot" className="modal-sign__block-checked-forgot">
            Forgot your password?
          </a>
        </div>
      </div>

      <SubmitButton loading={loading}>Sign in</SubmitButton>
    </form>
  )
}

function RegistrationTab({ onSuccess }) {
  const [country, setCountry] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rules, setRules] = useState(false)
  const [notUs, setNotUs] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!country) errs.country = 'Please select your country'
    if (!EMAIL_RE.test(email)) errs.email = 'Please enter a valid email address'
    if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (!rules) errs.rules = 'Please accept the Service Agreement'
    if (!notUs) errs.notUs = 'This confirmation is required'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setTimeout(onSuccess, 900)
  }

  return (
    <form action="#" onSubmit={submit} dir="auto" noValidate>
      <Field label="Country / Region of residence" error={errors.country}>
        <Select value={country} options={COUNTRIES} onChange={setCountry} searchable searchPlaceholder="Search" />
      </Field>

      <div className="modal-sign__input">
        <label className="modal-sign__input-label">Currency</label>
        <Select value={currency} options={CURRENCIES} onChange={setCurrency} />
      </div>

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          name="email"
          className="modal-sign__input-value"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
      </Field>

      <Field label="Password" error={errors.password}>
        <PasswordField
          id="password-input-registration"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      <div className="modal-sign__input">
        <label className="modal-sign__input-label">Promo code (optional)</label>
        <input type="text" name="promocode" className="modal-sign__input-value" autoComplete="off" spellCheck="false" />
      </div>

      <div className={`modal-sign__input${errors.rules ? ' error' : ''}`}>
        <div className="modal-sign__block-checked">
          <Checkbox name="rules" checked={rules} onChange={(e) => setRules(e.target.checked)}>
            <span>
              I confirm that I am 18 years old or older and accept{' '}
              <a href="#agreement" className="modal-sign__block-checked-forgot">
                Service Agreement
              </a>
            </span>
          </Checkbox>
        </div>
        {errors.rules && <div className="modal-sign__input-error__text"><p>{errors.rules}</p></div>}
      </div>

      <div className={`modal-sign__input${errors.notUs ? ' error' : ''}`}>
        <div className="modal-sign__block-checked">
          <Checkbox name="not-us-citizen" checked={notUs} onChange={(e) => setNotUs(e.target.checked)}>
            I declare and confirm that I am not a citizen or resident of the US for tax purposes
          </Checkbox>
        </div>
        {errors.notUs && <div className="modal-sign__input-error__text"><p>{errors.notUs}</p></div>}
      </div>

      <SubmitButton loading={loading}>Registration</SubmitButton>
    </form>
  )
}

export default function SignForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(() => (searchParams.get('signup') ? 2 : 1))

  useEffect(() => {
    setTab(searchParams.get('signup') ? 2 : 1)
  }, [searchParams])

  const goToTrade = () => navigate('/trade')

  return (
    <div className="modal-sign__container sign__form">
      <div className="sign__title">Sign In To Your Account</div>

      <div className="modal-sign__block">
        <div className="modal-sign__tabs form" dir="auto">
          <div className="modal-sign__tabs-block">
            <a className={`modal-sign__tab${tab === 1 ? ' active' : ''}`} data-value="1" onClick={() => setTab(1)}>
              Login
            </a>
            <a className={`modal-sign__tab${tab === 2 ? ' active' : ''}`} data-value="2" onClick={() => setTab(2)}>
              Registration
            </a>
          </div>
        </div>

        <div id="tab-2" className={`modal-sign__form${tab === 2 ? ' active' : ''}`}>
          <RegistrationTab onSuccess={goToTrade} />
          <SocialFooter onGoogle={goToTrade} />
        </div>

        <div id="tab-1" className={`modal-sign__form${tab === 1 ? ' active' : ''}`}>
          <LoginTab onSuccess={goToTrade} />
          <SocialFooter onGoogle={goToTrade} />
        </div>
      </div>
    </div>
  )
}

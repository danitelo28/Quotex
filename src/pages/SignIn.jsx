import Header from '../components/site/Header.jsx'
import Footer from '../components/site/Footer.jsx'
import SignForm from '../components/site/SignForm.jsx'

export default function SignIn() {
  return (
    <div>
      <div className="main__platform-video__none">
        <div className="main__platform-video">
          <div className="gradient-backdrop" />
        </div>
      </div>

      <Header />

      <div className="main__platform-content">
        <div className="sign__container">
          <SignForm />
        </div>
      </div>

      <Footer />
    </div>
  )
}

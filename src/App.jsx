import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase.js'

const ideas = [
  { number: '01', title: 'Pastebėk mažas užuominas', text: 'Geriausios dovanos dažnai prasideda nuo „kažkada norėčiau…“.' },
  { number: '02', title: 'Rinkis iš širdies', text: 'Pagalvok apie žmogaus pomėgius, ritualus ir mažus kasdienius džiaugsmus.' },
  { number: '03', title: 'Užsirašyk laiku', text: 'Idėja, užfiksuota šiandien, išgelbės nuo paskutinės minutės paieškų.' },
]

function authErrorMessage(error, action) {
  const message = `${error?.code ?? ''} ${error?.message ?? ''}`.toLowerCase()

  if (message.includes('invalid login credentials')) return 'Neteisingas el. paštas arba slaptažodis.'
  if (message.includes('user already registered') || message.includes('already been registered')) {
    return 'Šis el. pašto adresas jau užregistruotas. Pabandykite prisijungti.'
  }
  if (message.includes('invalid email')) return 'Patikrinkite, ar el. pašto adresas įvestas teisingai.'
  if (message.includes('password should be at least') || message.includes('weak_password')) {
    return 'Slaptažodis per trumpas arba neatitinka saugumo reikalavimų.'
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Per daug bandymų. Palaukite ir bandykite dar kartą.'
  }

  return action === 'signup'
    ? 'Registruoti nepavyko. Patikrinkite duomenis ir bandykite dar kartą.'
    : action === 'signin'
      ? 'Prisijungti nepavyko. Patikrinkite duomenis ir bandykite dar kartą.'
      : 'Atsijungti nepavyko. Bandykite dar kartą.'
}

function AuthScreen({ onSignupSession }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    if (pending) return

    setPending(true)
    setNotice(null)

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        })
        if (error) throw error

        if (data.session) {
          const successText = 'Registracija sėkminga. Esate prisijungę.'
          setNotice({ type: 'success', text: successText })
          onSignupSession(successText)
        } else {
          setNotice({ type: 'success', text: 'Registracija sėkminga. Patvirtinkite el. pašto adresą, paspaudę laiške esančią nuorodą.' })
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) throw error
      }
    } catch (error) {
      setNotice({ type: 'error', text: authErrorMessage(error, mode) })
    } finally {
      setPending(false)
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setNotice(null)
  }

  const signingUp = mode === 'signup'

  return (
    <main className="page-shell auth-shell">
      <header className="topbar">
        <a className="brand" href="#pradzia" aria-label="Dovanų idėjų organizatorius – pradžia">
          <span className="brand-mark" aria-hidden="true">d.</span>
          <span>dovanų užrašinė</span>
        </a>
        <span className="topbar-note"><span className="status-dot" /> tavo idėjoms augti</span>
      </header>

      <section className="auth-layout" id="pradzia">
        <div className="auth-intro">
          <p className="eyebrow"><span>✳</span> Mažos mintys, dideli jausmai</p>
          <h1>Dovana prasideda<br />nuo <em>minties.</em></h1>
          <p className="intro">Prisijunkite prie savo dovanų užrašinės arba susikurkite paskyrą, kad galėtumėte pradėti.</p>
        </div>

        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-tabs" role="tablist" aria-label="Paskyros veiksmai">
            <button className={!signingUp ? 'auth-tab active' : 'auth-tab'} type="button" role="tab" aria-selected={!signingUp} onClick={() => changeMode('signin')} disabled={pending}>Prisijungti</button>
            <button className={signingUp ? 'auth-tab active' : 'auth-tab'} type="button" role="tab" aria-selected={signingUp} onClick={() => changeMode('signup')} disabled={pending}>Registruotis</button>
          </div>
          <h2 id="auth-title">{signingUp ? 'Sukurkite paskyrą' : 'Smagu vėl matyti'}</h2>
          <p className="auth-subtitle">{signingUp ? 'Pradėkite kaupti apgalvotas dovanų idėjas.' : 'Prisijunkite prie savo dovanų užrašinės.'}</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="auth-email">El. paštas</label>
            <input
              autoComplete="email"
              id="auth-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="vardas@pastas.lt"
              required
              disabled={pending}
            />
            <label htmlFor="auth-password">Slaptažodis</label>
            <input
              autoComplete={signingUp ? 'new-password' : 'current-password'}
              id="auth-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Įveskite slaptažodį"
              required
              disabled={pending}
            />

            {notice && <p className={`auth-notice ${notice.type}`} role="status" aria-live="polite">{notice.text}</p>}

            <button className="auth-submit" type="submit" disabled={pending || !email.trim() || !password}>
              {pending ? 'Prašome palaukti…' : signingUp ? 'Sukurti paskyrą' : 'Prisijungti'}
              {!pending && <span aria-hidden="true">↗</span>}
            </button>
          </form>
        </section>
      </section>

      <footer className="footer"><span>Pagaminta su mintimi apie tuos, kuriuos mylime.</span><span>♡ &nbsp; 2026</span></footer>
    </main>
  )
}

function GiftIdeasHome({ onSignOut, successMessage }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSignOut() {
    if (pending) return
    setPending(true)
    setError('')

    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
    } catch (signOutError) {
      setError(authErrorMessage(signOutError, 'signout'))
      setPending(false)
      return
    }

    onSignOut()
    setPending(false)
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#pradzia" aria-label="Dovanų idėjų organizatorius – pradžia">
          <span className="brand-mark" aria-hidden="true">d.</span>
          <span>dovanų užrašinė</span>
        </a>
        <div className="topbar-actions">
          <span className="topbar-note"><span className="status-dot" /> tavo idėjoms augti</span>
          <button className="signout-button" type="button" onClick={handleSignOut} disabled={pending}>
            {pending ? 'Atsijungiama…' : 'Atsijungti'}
          </button>
        </div>
      </header>
      {successMessage && <p className="auth-notice success home-notice" role="status" aria-live="polite">{successMessage}</p>}
      {error && <p className="signout-error" role="alert">{error}</p>}

      <section className="hero" id="pradzia">
        <div className="hero-copy">
          <p className="eyebrow"><span>✳</span> Mažos mintys, dideli jausmai</p>
          <h1>Dovana prasideda<br />nuo <em>minties.</em></h1>
          <p className="intro">Čia gimsta apgalvotos dovanos. Užfiksuok idėją, kol ji dar šilta, ir sugrįžk prie jos tada, kai ateis tinkamas metas.</p>
          <a className="start-link" href="#kaip-veikia">Pradėk nuo įkvėpimo <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-art" aria-label="Iliustracija: dovana su gėle">
          <div className="sun-wash" />
          <div className="sparkle sparkle-one">✳</div>
          <div className="sparkle sparkle-two">✦</div>
          <div className="gift-shadow" />
          <div className="gift-box"><div className="gift-ribbon" /><div className="gift-bow bow-left" /><div className="gift-bow bow-right" /></div>
          <div className="flower-stem" />
          <div className="flower-leaf leaf-left" />
          <div className="flower-leaf leaf-right" />
          <div className="flower-head"><i /><i /><i /><i /><i /><b /></div>
          <div className="art-caption">su meile, visada <span>♡</span></div>
        </div>
        <div className="hero-index">01 <span /> 03</div>
      </section>

      <section className="how-section" id="kaip-veikia">
        <div className="section-heading">
          <p className="eyebrow">Truputis dėmesio <span>✳</span></p>
          <h2>Gera dovana –<br /><em>asmeniška istorija.</em></h2>
        </div>
        <div className="idea-list">
          {ideas.map((idea) => (
            <article className="idea-item" key={idea.number}>
              <span className="idea-number">{idea.number}</span>
              <div><h3>{idea.title}</h3><p>{idea.text}</p></div>
              <span className="idea-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer"><span>Pagaminta su mintimi apie tuos, kuriuos mylime.</span><span>♡ &nbsp; 2026</span></footer>
    </main>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [signupSuccessMessage, setSignupSuccessMessage] = useState('')

  useEffect(() => {
    let active = true
    let initialized = false
    let latestAuthSession

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      if (!initialized) {
        latestAuthSession = nextSession
        return
      }
      setSession(nextSession)
    })

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      initialized = true
      setSession(latestAuthSession === undefined ? data.session : latestAuthSession)
      setCheckingSession(false)
      if (error) console.error('Nepavyko patikrinti prisijungimo būsenos.')
    }).catch(() => {
      if (!active) return
      initialized = true
      setSession(latestAuthSession ?? null)
      setCheckingSession(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (checkingSession) {
    return <main className="session-loading" role="status" aria-live="polite">Tikrinama prisijungimo būsena…</main>
  }

  if (!session) return <AuthScreen onSignupSession={setSignupSuccessMessage} />
  return <GiftIdeasHome onSignOut={() => setSession(null)} successMessage={signupSuccessMessage} />
}

export default App

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

function dataErrorMessage(error, subject = 'duomenų') {
  const message = `${error?.code ?? ''} ${error?.message ?? ''}`.toLowerCase()

  if (message.includes('row-level security') || message.includes('permission denied')) {
    return 'Neturite teisės atlikti šio veiksmo. Atsijunkite ir prisijunkite iš naujo.'
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Nepavyko susisiekti su duomenų baze. Patikrinkite interneto ryšį ir bandykite dar kartą.'
  }
  return `${subject} įkelti arba išsaugoti nepavyko. Bandykite dar kartą.`
}

function GiftIdeasHome({ onSignOut, userEmail, notice, onCreate, onClearNotice }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [occasions, setOccasions] = useState([])
  const [loadingOccasions, setLoadingOccasions] = useState(true)
  const [selectedOccasionId, setSelectedOccasionId] = useState('')
  const [gifts, setGifts] = useState([])
  const [loadingGifts, setLoadingGifts] = useState(false)
  const [dataError, setDataError] = useState('')
  const [editingGiftId, setEditingGiftId] = useState('')
  const [editingGiftTitle, setEditingGiftTitle] = useState('')
  const [savingGift, setSavingGift] = useState(false)

  useEffect(() => {
    let active = true

    async function loadOccasions() {
      setLoadingOccasions(true)
      setDataError('')

      const { data, error: loadError } = await supabase
        .from('occasions')
        .select('id, user_id, name, created_at')
        .order('created_at', { ascending: false })

      if (!active) return
      if (loadError) {
        setDataError(dataErrorMessage(loadError, 'Progų'))
      } else {
        const loadedOccasions = data ?? []
        setOccasions(loadedOccasions)
        setSelectedOccasionId((current) => current && loadedOccasions.some((item) => item.id === current)
          ? current
          : loadedOccasions[0]?.id ?? '')
      }
      setLoadingOccasions(false)
    }

    loadOccasions()
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true

    async function loadGifts() {
      if (!selectedOccasionId) {
        setGifts([])
        setLoadingGifts(false)
        return
      }

      setLoadingGifts(true)
      setDataError('')
      const { data, error: loadError } = await supabase
        .from('gifts')
        .select('id, occasion_id, user_id, title, priority, created_at')
        .eq('occasion_id', selectedOccasionId)
        .order('created_at', { ascending: false })

      if (!active) return
      if (loadError) {
        setDataError(dataErrorMessage(loadError, 'Dovanų'))
      } else {
        setGifts(data ?? [])
      }
      setLoadingGifts(false)
    }

    loadGifts()
    return () => { active = false }
  }, [selectedOccasionId])

  function addOccasion(occasion) {
    setOccasions((current) => [occasion, ...current])
    setSelectedOccasionId(occasion.id)
  }

  function addGift(gift) {
    setGifts((current) => [gift, ...current])
  }

  async function handleUpdateGift(event, giftId) {
    event.preventDefault()
    const title = editingGiftTitle.trim()
    if (!title || savingGift) return

    setSavingGift(true)
    setDataError('')
    const { data, error: updateError } = await supabase
      .from('gifts')
      .update({ title })
      .eq('id', giftId)
      .select('id, occasion_id, user_id, title, priority, created_at')
      .single()

    if (updateError) {
      setDataError(dataErrorMessage(updateError, 'Dovanos'))
    } else if (data) {
      setGifts((current) => current.map((gift) => gift.id === giftId ? data : gift))
      setEditingGiftId('')
      setEditingGiftTitle('')
    }
    setSavingGift(false)
  }

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
      {error && <p className="signout-error" role="alert">{error}</p>}
      {notice && <p className="auth-notice success home-notice" role="status" aria-live="polite">{notice}</p>}

      <section className="occasions-section" aria-labelledby="occasions-title" onClick={onClearNotice}>
        <div className="occasions-heading">
          <div>
            <p className="eyebrow">Svarbios akimirkos <span>✳</span></p>
            <h2 id="occasions-title">Mano <em>progos ir dovanos.</em></h2>
          </div>
          <button className="auth-submit create-open-button" type="button" onClick={() => onCreate('occasion')}>Sukurti <span aria-hidden="true">＋</span></button>
        </div>
        {loadingOccasions ? (
          <p className="occasions-state" role="status" aria-live="polite">Įkeliamos progos…</p>
        ) : occasions.length === 0 ? (
          <p className="occasions-state">Kol kas progų nėra. Sukurkite pirmąją progą.</p>
        ) : (
          <div className="gift-manager">
            <nav className="occasion-list" aria-label="Jūsų progos">
              {occasions.map((occasion) => (
                <button className={`occasion-item occasion-select${selectedOccasionId === occasion.id ? ' selected' : ''}`} key={occasion.id} type="button" onClick={() => setSelectedOccasionId(occasion.id)}>
                  <span className="occasion-date" aria-hidden="true">♡</span>
                  <span>{occasion.name}</span>
                  <span className="occasion-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </nav>
            <section className="gifts-panel" aria-labelledby="gifts-title">
              <div className="gifts-heading">
                <div>
                  <p className="eyebrow">Dovanų idėjos</p>
                  <h3 id="gifts-title">{occasions.find((occasion) => occasion.id === selectedOccasionId)?.name ?? 'Pasirinkite progą'}</h3>
                </div>
                <button className="text-action" type="button" onClick={() => onCreate('gift', selectedOccasionId)} disabled={!selectedOccasionId}>Pridėti dovaną <span aria-hidden="true">＋</span></button>
              </div>
              {dataError && <p className="auth-notice error occasions-notice" role="alert">{dataError}</p>}
              {loadingGifts ? (
                <p className="occasions-state" role="status" aria-live="polite">Įkeliamos dovanos…</p>
              ) : gifts.length === 0 ? (
                <p className="occasions-state">Šiai progai dovanų dar nėra. Pridėkite pirmąją dovaną.</p>
              ) : (
                <ul className="gift-list">
                  {gifts.map((gift) => (
                    <li className="gift-item" key={gift.id}>
                      {editingGiftId === gift.id ? (
                        <form className="gift-edit-form" onSubmit={(event) => handleUpdateGift(event, gift.id)}>
                          <input aria-label="Dovanos pavadinimas" value={editingGiftTitle} onChange={(event) => setEditingGiftTitle(event.target.value)} required autoFocus />
                          <button className="small-action" type="submit" disabled={savingGift || !editingGiftTitle.trim()}>{savingGift ? 'Saugoma…' : 'Išsaugoti'}</button>
                          <button className="small-action secondary" type="button" onClick={() => setEditingGiftId('')} disabled={savingGift}>Atšaukti</button>
                        </form>
                      ) : (
                        <>
                          <span className="gift-title">{gift.title}</span>
                          <span className={`priority-badge ${gift.priority === 'high' ? 'high' : ''}`}>{gift.priority === 'high' ? 'Aukštas' : 'Įprastas'}</span>
                          <button className="text-action edit-action" type="button" onClick={() => { setEditingGiftId(gift.id); setEditingGiftTitle(gift.title) }}>Redaguoti</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </section>

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

function CreateScreen({ type, onTypeChange, occasions, occasionId, onOccasionChange, loading, error, creating, onBack, onSubmit }) {
  const makingOccasion = type === 'occasion'

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#pradzia" aria-label="Dovanų idėjų organizatorius – pradžia">
          <span className="brand-mark" aria-hidden="true">d.</span>
          <span>dovanų užrašinė</span>
        </a>
        <span className="topbar-note"><span className="status-dot" /> tavo idėjoms augti</span>
      </header>
      <section className="create-layout" aria-labelledby="create-title">
        <button className="back-link" type="button" onClick={onBack}>← Grįžti į sąrašą</button>
        <p className="eyebrow">Mažos mintys, dideli jausmai <span>✳</span></p>
        <h1 id="create-title">Sukurkite <em>{makingOccasion ? 'progą.' : 'dovaną.'}</em></h1>
        <p className="intro">Užfiksuokite svarbią akimirką ar dovanų idėją, kad ji liktų su jumis.</p>
        <div className="create-tabs" role="tablist" aria-label="Kuriamo įrašo tipas">
          <button className={`auth-tab${makingOccasion ? ' active' : ''}`} type="button" role="tab" aria-selected={makingOccasion} onClick={() => onTypeChange('occasion')}>Nauja proga</button>
          <button className={`auth-tab${!makingOccasion ? ' active' : ''}`} type="button" role="tab" aria-selected={!makingOccasion} onClick={() => onTypeChange('gift')}>Nauja dovana</button>
        </div>
        {loading ? (
          <p className="occasions-state" role="status" aria-live="polite">Įkeliami duomenys…</p>
        ) : (
          <form className="create-form" onSubmit={onSubmit}>
            {!makingOccasion && (
              <>
                <label htmlFor="gift-occasion">Proga</label>
                <select id="gift-occasion" value={occasionId} onChange={(event) => onOccasionChange(event.target.value)} required disabled={!occasions.length}>
                  {occasions.length ? occasions.map((occasion) => <option value={occasion.id} key={occasion.id}>{occasion.name}</option>) : <option value="">Pirmiausia sukurkite progą</option>}
                </select>
                {!occasions.length && <p className="occasions-state">Dovaną galėsite sukurti pasirinkę progą.</p>}
              </>
            )}
            <label htmlFor="create-title-input">{makingOccasion ? 'Progos pavadinimas' : 'Dovanos pavadinimas'}</label>
            <input id="create-title-input" name="title" type="text" placeholder={makingOccasion ? 'Pavyzdžiui, Mamos gimtadienis' : 'Pavyzdžiui, gėlių puokštė'} required disabled={creating} />
            {!makingOccasion && (
              <>
                <label htmlFor="gift-priority">Prioritetas</label>
                <select id="gift-priority" name="priority" defaultValue="normal" disabled={creating}>
                  <option value="normal">Įprastas</option>
                  <option value="high">Aukštas</option>
                </select>
              </>
            )}
            {error && <p className="auth-notice error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={creating || (!makingOccasion && !occasions.length)}>
              {creating ? 'Išsaugoma…' : 'Išsaugoti'} {!creating && <span aria-hidden="true">↗</span>}
            </button>
          </form>
        )}
      </section>
      <footer className="footer"><span>Pagaminta su mintimi apie tuos, kuriuos mylime.</span><span>♡ &nbsp; 2026</span></footer>
    </main>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [screen, setScreen] = useState('lists')
  const [createType, setCreateType] = useState('occasion')
  const [occasionForGift, setOccasionForGift] = useState('')
  const [occasions, setOccasions] = useState([])
  const [loadingCreateOptions, setLoadingCreateOptions] = useState(false)
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)
  const [createSuccess, setCreateSuccess] = useState('')
  const [notice, setNotice] = useState('')

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

  if (!session) return <AuthScreen onSignupSession={() => {}} />
  return (
    <>
      {screen === 'lists' ? (
        <GiftIdeasHome
          onSignOut={() => { setSession(null); setScreen('lists'); setNotice('') }}
          userEmail={session.user.email}
          notice={notice}
          onClearNotice={() => setNotice('')}
          onCreate={async (type = 'occasion', occasionId = '') => {
            setCreateType(type)
            setCreateError('')
            setCreateSuccess('')
            setOccasionForGift(occasionId)
            setScreen('create')
            setLoadingCreateOptions(true)
            const { data, error } = await supabase.from('occasions').select('id, name').order('created_at', { ascending: false })
            setLoadingCreateOptions(false)
            if (error) setCreateError(dataErrorMessage(error, 'Progų'))
            else {
              setOccasions(data ?? [])
              if (!occasionId && data?.length) setOccasionForGift(data[0].id)
            }
          }}
        />
      ) : (
        <CreateScreen
          type={createType}
          onTypeChange={setCreateType}
          occasions={occasions}
          occasionId={occasionForGift}
          onOccasionChange={setOccasionForGift}
          loading={loadingCreateOptions}
          error={createError}
          success={createSuccess}
          creating={creating}
          onBack={() => { setScreen('lists'); setCreateError(''); setCreateSuccess('') }}
          onSubmit={async (event) => {
            event.preventDefault()
            if (creating) return
            const formData = new FormData(event.currentTarget)
            const title = String(formData.get('title') ?? '').trim()
            if (!title) return
            setCreating(true)
            setCreateError('')
            setCreateSuccess('')

            if (createType === 'occasion') {
              const { data, error } = await supabase.from('occasions').insert({ name: title }).select('id, name, created_at').single()
              if (error) setCreateError(dataErrorMessage(error, 'Progos'))
              else {
                setCreateSuccess(`Proga „${data.name}“ sėkmingai išsaugota.`)
                setNotice(`Proga „${data.name}“ sėkmingai sukurta.`)
                setScreen('lists')
              }
            } else {
              const priority = String(formData.get('priority') ?? 'normal')
              const { error } = await supabase.from('gifts').insert({ occasion_id: occasionForGift, title, priority })
              if (error) setCreateError(dataErrorMessage(error, 'Dovanos'))
              else {
                setCreateSuccess(`Dovana „${title}“ sėkmingai išsaugota.`)
                setNotice(`Dovana „${title}“ sėkmingai sukurta.`)
                setScreen('lists')
              }
            }
            setCreating(false)
          }}
        />
      )}
    </>
  )
}

export default App

const ideas = [
  { number: '01', title: 'Pastebėk mažas užuominas', text: 'Geriausios dovanos dažnai prasideda nuo „kažkada norėčiau…“.' },
  { number: '02', title: 'Rinkis iš širdies', text: 'Pagalvok apie žmogaus pomėgius, ritualus ir mažus kasdienius džiaugsmus.' },
  { number: '03', title: 'Užsirašyk laiku', text: 'Idėja, užfiksuota šiandien, išgelbės nuo paskutinės minutės paieškų.' },
]

function App() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#pradzia" aria-label="Dovanų idėjų organizatorius – pradžia">
          <span className="brand-mark" aria-hidden="true">d.</span>
          <span>dovanų užrašinė</span>
        </a>
        <span className="topbar-note"><span className="status-dot" /> tavo idėjoms augti</span>
      </header>

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

export default App

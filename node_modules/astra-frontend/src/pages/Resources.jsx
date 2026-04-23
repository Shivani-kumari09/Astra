import SiteFooter from '../components/SiteFooter';

export default function Resources() {
  return (
    <>
      <div className="page-hero">
        <span className="section-label">Resources &amp; Legal Aid</span>
        <h1>Know Your Rights. Seek Help. Stay Strong.</h1>
        <p>Free legal resources, safety guides and mental health support for every Indian woman.</p>
      </div>
      <div className="res-page">
        <aside className="sidebar">
          <ul>
            <li>
              <a href="#rights" className="active">
                Know Your Rights
              </a>
            </li>
            <li>
              <a href="#fir">How to File FIR</a>
            </li>
            <li>
              <a href="#posh">POSH Act (Workplace)</a>
            </li>
            <li>
              <a href="#dv">Domestic Violence</a>
            </li>
            <li>
              <a href="#cyber">Cyber Safety</a>
            </li>
            <li>
              <a href="#mental">Mental Health</a>
            </li>
          </ul>
        </aside>
        <main className="content">
          <section id="rights">
            <h2>Know Your Rights</h2>
            <p>Indian law provides strong protections for women. Here are the key laws you must know:</p>
            <div className="law-card">
              <h4>⚖️ IPC Section 354 — Assault or Criminal Force Against Women</h4>
              <p>
                Any person who assaults or uses criminal force on a woman with intent to outrage her modesty is punishable with imprisonment of 1–5
                years. Cognisable and non-bailable.
              </p>
            </div>
            <div className="law-card">
              <h4>⚖️ IPC Section 375/376 — Rape</h4>
              <p>Defines rape and provides punishment of minimum 7 years rigorous imprisonment, extending to life imprisonment or death in aggravated cases.</p>
            </div>
            <div className="law-card">
              <h4>⚖️ IPC Section 498A — Cruelty by Husband or Relatives</h4>
              <p>Protects married women from cruelty, harassment, and dowry demands. Punishable with imprisonment up to 3 years.</p>
            </div>
            <div className="law-card">
              <h4>⚖️ IPC Section 509 — Words / Gestures Insulting Modesty</h4>
              <p>Any word, gesture, or act intended to insult a woman&apos;s modesty is punishable with imprisonment up to 3 years and fine.</p>
            </div>
            <div className="info-box">
              <p>
                ✅ <strong>Remember:</strong> You have the right to file an FIR at ANY police station regardless of jurisdiction. Police cannot refuse to
                register your complaint.
              </p>
            </div>
          </section>
          <hr className="hr" id="fir" />
          <section>
            <h2>How to File an FIR</h2>
            <h3>Step-by-Step Guide</h3>
            <ul>
              <li>
                <strong>Go to the nearest police station</strong> — you don&apos;t need to go to the station in whose area the crime occurred.
              </li>
              <li>
                <strong>Request to meet the Station House Officer (SHO)</strong> — they are obligated to hear you.
              </li>
              <li>
                <strong>Give a written complaint</strong> — describe the incident clearly with date, time, location, and persons involved.
              </li>
              <li>
                <strong>Insist on a copy of the FIR</strong> — this is your legal right under Section 154(2) CrPC. It must be given free of cost.
              </li>
              <li>
                <strong>If police refuse</strong> — send a complaint by registered post to the Superintendent of Police, or approach a Magistrate under
                Section 156(3) CrPC.
              </li>
            </ul>
            <div className="warn-box">
              <p>
                ⚠️ If you face sexual violence, you have the right to be examined by a female doctor. Your statement must be recorded by a female police
                officer if available.
              </p>
            </div>
            <h3>FIR Template</h3>
            <div
              style={{
                background: 'var(--gray-100)',
                borderRadius: 14,
                padding: 24,
                fontFamily: 'monospace',
                fontSize: 13,
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap'
              }}
            >
              {`To,
The Station House Officer,
[Name of Police Station],
[City, District]

Date: ___________

Subject: Complaint regarding [type of incident]

Respected Sir/Madam,

I, [Your Name], daughter/wife of [Father's/Husband's Name], 
resident of [Your Full Address], hereby lodge this complaint 
against [Name/Description of accused if known].

Incident Details:
Date & Time: ___________
Location: ___________
Description of Incident:
[Describe what happened in detail]

I request you to kindly register an FIR and take 
appropriate legal action at the earliest.

Thanking you,

Signature: ___________
Name: ___________
Contact: ___________`}
            </div>
            <button type="button" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }} onClick={() => window.print()}>
              🖨️ Print FIR Template
            </button>
          </section>
          <hr className="hr" id="posh" />
          <section>
            <h2>POSH Act — Workplace Safety</h2>
            <p>
              The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act) protects women from sexual harassment
              at the workplace.
            </p>
            <h3>What Counts as Sexual Harassment?</h3>
            <ul>
              <li>Physical contact or advances</li>
              <li>Demand or request for sexual favours</li>
              <li>Making sexually coloured remarks</li>
              <li>Showing pornography</li>
              <li>Any other unwelcome physical, verbal, or non-verbal conduct of a sexual nature</li>
            </ul>
            <h3>Your Rights Under POSH</h3>
            <ul>
              <li>Every employer with 10+ employees must have an Internal Complaints Committee (ICC)</li>
              <li>You can file a complaint with the ICC within 3 months of the incident</li>
              <li>Your identity must be kept confidential throughout the process</li>
              <li>You can request transfer or leave during the inquiry period</li>
            </ul>
          </section>
          <hr className="hr" id="dv" />
          <section>
            <h2>Domestic Violence</h2>
            <p>
              The Protection of Women from Domestic Violence Act, 2005 protects women from physical, emotional, sexual, verbal, and economic abuse by family
              members.
            </p>
            <h3>You Can Get:</h3>
            <ul>
              <li>
                <strong>Protection Orders</strong> — preventing the abuser from committing further violence
              </li>
              <li>
                <strong>Residence Orders</strong> — right to live in the shared household
              </li>
              <li>
                <strong>Custody Orders</strong> — temporary custody of children
              </li>
              <li>
                <strong>Compensation Orders</strong> — monetary relief for injuries and losses
              </li>
            </ul>
            <div className="info-box">
              <p>
                📞 <strong>iCall Helpline: 9152987821</strong> — Free counselling for women in abusive situations. Available Mon–Sat, 8am–10pm.
              </p>
            </div>
          </section>
          <hr className="hr" id="cyber" />
          <section>
            <h2>Cyber Safety for Women</h2>
            <h3>Report Cybercrime</h3>
            <ul>
              <li>
                File a complaint at <strong>cybercrime.gov.in</strong> or call <strong>1930</strong>
              </li>
              <li>For revenge porn / non-consensual intimate images — immediate action within 24 hours</li>
              <li>For cyberstalking — report to police under IPC Section 354D</li>
            </ul>
            <h3>Stay Safe Online</h3>
            <ul>
              <li>Review privacy settings on all social media accounts monthly</li>
              <li>Never share OTP, passwords, or personal documents with anyone</li>
              <li>Use two-factor authentication on all accounts</li>
              <li>Block and report harassers immediately — keep screenshots as evidence</li>
              <li>Enable &quot;Who can find me&quot; restrictions on Facebook, Instagram, and WhatsApp</li>
            </ul>
          </section>
          <hr className="hr" id="mental" />
          <section>
            <h2>Mental Health Support</h2>
            <p>Trauma, fear, and anxiety are natural responses to violence and harassment. You are not alone, and help is available.</p>
            <h3>Free Helplines</h3>
            <div className="law-card">
              <h4>💜 iCall — 9152987821</h4>
              <p>Free psychological counselling in Hindi and English. Mon–Sat, 8am–10pm.</p>
            </div>
            <div className="law-card">
              <h4>💜 SNEHI — 044-24640050</h4>
              <p>Emotional support and mental health counselling. Available 8am–10pm daily.</p>
            </div>
            <div className="law-card">
              <h4>💜 Vandrevala Foundation — 1860-2662-345</h4>
              <p>24/7 mental health helpline in multiple languages. Free and confidential.</p>
            </div>
            <div className="law-card">
              <h4>💜 iDiva Foundation Helpline — 9820466627</h4>
              <p>Counselling specifically for women facing domestic violence and abuse.</p>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}

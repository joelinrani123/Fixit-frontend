import { Link } from 'react-router-dom'
import { useIssues } from '../context/IssuesContext'

export default function Home() {
  const { issues } = useIssues()
  const open = issues.filter(i => i.status === 'open').length
  const inProgress = issues.filter(i => i.status === 'in-progress').length
  const resolved = issues.filter(i => i.status === 'resolved').length

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container text-center">
          <div className="hero-icon">🔧</div>
          <h1 className="hero-title">Fix Your Neighbourhood</h1>
          <p className="hero-sub">
            Spot a problem? Report it. Anyone can volunteer to fix it.<br />
            Together we make our streets safer, cleaner and brighter.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-hero-primary" to="/board">View Issues</Link>
            <Link className="btn btn-hero-secondary" to="/signup">Join FixIt</Link>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="stat-card stat-open">
                <div className="stat-number">{open}</div>
                <div className="stat-label">Open Issues</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card stat-progress">
                <div className="stat-number">{inProgress}</div>
                <div className="stat-label">Being Fixed</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card stat-resolved">
                <div className="stat-number">{resolved}</div>
                <div className="stat-label">Resolved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="row g-4 mt-2">
            <div className="col-md-4 text-center">
              <div className="how-icon">📸</div>
              <h4>1. Spot & Report</h4>
              <p>See a broken streetlight, pothole, or dirty park? Report it in 30 seconds.</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="how-icon">🙋</div>
              <h4>2. Volunteer or Vote</h4>
              <p>Claim the fix yourself or upvote to push it up the priority list for authorities.</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="how-icon">✅</div>
              <h4>3. Mark Resolved</h4>
              <p>Once fixed, mark it resolved. The community sees real change happening.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

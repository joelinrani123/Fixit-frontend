import { useAuth } from '../context/AuthContext'
import { useIssues } from '../context/IssuesContext'
import IssueCard from '../components/IssueCard'

export default function Dashboard() {
  const { user } = useAuth()
  const { issues } = useIssues()

  const myReported = issues.filter(i => i.reportedBy === user.name)
  const myClaimed = issues.filter(i => i.claimedBy === user.name)

  return (
    <div className="board-page">
      <div className="container py-4">
        <div className="dashboard-header">
          <h2 className="page-title">👤 My Dashboard</h2>
          <p className="page-sub">Manage your reported and claimed issues.</p>
        </div>

        <div className="dashboard-stats row g-3 mb-5">
          <div className="col-6 col-md-3">
            <div className="dash-stat">
              <div className="dash-stat-num">{myReported.length}</div>
              <div className="dash-stat-label">Reported</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="dash-stat">
              <div className="dash-stat-num">{myClaimed.length}</div>
              <div className="dash-stat-label">Claimed</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="dash-stat">
              <div className="dash-stat-num">{myClaimed.filter(i => i.status === 'resolved').length}</div>
              <div className="dash-stat-label">Fixed</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="dash-stat">
              <div className="dash-stat-num">{myReported.reduce((acc, i) => acc + i.votes, 0)}</div>
              <div className="dash-stat-label">Total Votes</div>
            </div>
          </div>
        </div>

        <h4 className="section-title mb-3">📋 Issues I Reported</h4>
        {myReported.length === 0 ? (
          <p className="text-muted mb-5">You haven't reported any issues yet.</p>
        ) : (
          <div className="row g-4 mb-5">
            {myReported.map(issue => (
              <div key={issue.id} className="col-md-6 col-lg-4">
                <IssueCard issue={issue} />
              </div>
            ))}
          </div>
        )}

        <h4 className="section-title mb-3">🏗️ Issues I'm Fixing</h4>
        {myClaimed.length === 0 ? (
          <p className="text-muted">You haven't claimed any issues yet. Head to the board!</p>
        ) : (
          <div className="row g-4">
            {myClaimed.map(issue => (
              <div key={issue.id} className="col-md-6 col-lg-4">
                <IssueCard issue={issue} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

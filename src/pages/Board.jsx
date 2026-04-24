import { useState } from 'react'
import { useIssues } from '../context/IssuesContext'
import IssueCard from '../components/IssueCard'

const CATEGORIES = ['All', 'Lighting', 'Roads', 'Sanitation', 'Parks', 'Water', 'Other']

export default function Board() {
  const { issues } = useIssues()
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('active') // 'active' | 'resolved'

  const activeIssues = issues.filter(i => i.status !== 'resolved')
  const resolvedIssues = issues.filter(i => i.status === 'resolved')

  const filterFn = (list) => list.filter(i => {
    const matchCat = category === 'All' || i.category === category
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const activeFiltered = [...filterFn(activeIssues)].sort((a, b) => b.votes - a.votes)
  const resolvedFiltered = [...filterFn(resolvedIssues)].sort((a, b) => b.votes - a.votes)

  return (
    <div className="board-page">
      <div className="container py-4">
        <h2 className="page-title">Issue Board</h2>
        <p className="page-sub">Browse and act on neighbourhood problems near you.</p>

        <div className="filters-row row g-2 mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control filter-input"
              placeholder="🔍 Search by title or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select className="form-select filter-input" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="board-tabs mb-4">
          <button className={`board-tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
            📋 Active Issues <span className="tab-count">{activeIssues.length}</span>
          </button>
          <button className={`board-tab ${tab === 'resolved' ? 'active' : ''}`} onClick={() => setTab('resolved')}>
            ✅ Resolved <span className="tab-count">{resolvedIssues.length}</span>
          </button>
        </div>

        {tab === 'active' && (
          activeFiltered.length === 0 ? (
            <div className="empty-state text-center py-5">
              <div className="empty-icon">🔍</div>
              <h4>No issues found</h4>
              <p>Try different filters or be the first to report one!</p>
            </div>
          ) : (
            <div className="row g-4">
              {activeFiltered.map(issue => (
                <div key={issue.id} className="col-md-6 col-lg-4">
                  <IssueCard issue={issue} />
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'resolved' && (
          resolvedFiltered.length === 0 ? (
            <div className="empty-state text-center py-5">
              <div className="empty-icon">✅</div>
              <h4>No resolved issues yet</h4>
              <p>Resolved issues will appear here.</p>
            </div>
          ) : (
            <div className="row g-4">
              {resolvedFiltered.map(issue => (
                <div key={issue.id} className="col-md-6 col-lg-4">
                  <IssueCard issue={issue} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useIssues } from '../context/IssuesContext'

const STATUS_LABELS = {
  open: { label: 'Open', cls: 'badge-open' },
  'in-progress': { label: 'In Progress', cls: 'badge-progress' },
  resolved: { label: 'Resolved', cls: 'badge-resolved' },
}

const CATEGORY_ICONS = {
  Lighting: '💡', Roads: '🚧', Sanitation: '🗑️', Parks: '🌳', Water: '💧', Other: '📌',
}

const CATEGORIES = ['Lighting', 'Roads', 'Sanitation', 'Parks', 'Water', 'Other']

export default function IssueCard({ issue }) {
  const { user } = useAuth()
  const { voteIssue, claimIssue, resolveIssue, unresolveIssue, editIssue, deleteIssue } = useIssues()
  const { label, cls } = STATUS_LABELS[issue.status] || { label: issue.status, cls: '' }

  const [showDesc, setShowDesc] = useState(false)
  const [showClaim, setShowClaim] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [claimForm, setClaimForm] = useState({ name: user?.name || '', phone: '', org: '' })
  const [claimErr, setClaimErr] = useState('')
  const [editForm, setEditForm] = useState({ title: issue.title, category: issue.category, location: issue.location, mapLink: issue.mapLink || '', description: issue.description })
  const [editErr, setEditErr] = useState('')

  const hasVoted = user && (issue.votedBy || []).includes(user.id)
  const isOwner = user && issue.reportedById === user.id

  const handleVote = () => {
    if (!user || hasVoted) return
    voteIssue(issue.id, user.id)
  }

  const handleClaimSubmit = () => {
    if (!claimForm.phone.trim()) { setClaimErr('Phone number is required.'); return }
    const lbl = claimForm.org ? `${claimForm.name} (${claimForm.org})` : claimForm.name
    claimIssue(issue.id, lbl, claimForm.phone)
    setShowClaim(false)
  }

  const handleResolve = () => {
    if (window.confirm('Mark this issue as resolved?')) {
      resolveIssue(issue.id, user.name)
    }
  }

  const handleUnresolve = () => {
    if (window.confirm('Move this issue back to the board?')) {
      unresolveIssue(issue.id)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Delete this issue permanently?')) {
      deleteIssue(issue.id)
    }
  }

  const handleEditSubmit = () => {
    if (!editForm.title || !editForm.location || !editForm.description) { setEditErr('Please fill all required fields.'); return }
    editIssue(issue.id, editForm)
    setShowEdit(false)
  }

  const DESC_LIMIT = 100
  const isLong = issue.description.length > DESC_LIMIT

  return (
    <>
      <div className="issue-card card h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className={`issue-badge ${cls}`}>{label}</span>
            <span className="issue-category">{CATEGORY_ICONS[issue.category] || '📌'} {issue.category}</span>
          </div>
          <h5 className="issue-title">{issue.title}</h5>
          <p className="issue-location">📍 {issue.location}</p>
          {issue.mapLink && (
            <a className="issue-maplink" href={issue.mapLink} target="_blank" rel="noreferrer">🗺️ View on Map</a>
          )}
          <p className="issue-desc">
            {isLong ? issue.description.slice(0, DESC_LIMIT) + '…' : issue.description}
            {isLong && (
              <button className="btn-read-more" onClick={() => setShowDesc(true)}>Read more</button>
            )}
          </p>
          {issue.claimedBy && (
            <p className="issue-claimed">
              🏗️ Claimed by: {issue.claimedBy}
              {issue.claimerPhone && <span className="claimer-phone"> · 📞 {issue.claimerPhone}</span>}
            </p>
          )}
          {issue.status === 'resolved' && issue.resolvedBy && (
            <p className="issue-claimed" style={{color:'var(--success)'}}>
              ✅ Solved by: {issue.resolvedBy} {issue.resolvedDate && <span>· {issue.resolvedDate}</span>}
            </p>
          )}
          <div className="issue-meta">
            <span>By {issue.reportedBy}</span>
            {issue.reporterPhone && <span>📞 {issue.reporterPhone}</span>}
            <span>{issue.date}</span>
          </div>
        </div>
        <div className="card-footer issue-footer">
          <button
            className={`btn btn-vote ${hasVoted ? 'btn-voted' : ''}`}
            onClick={handleVote}
            disabled={!user || hasVoted}
            title={!user ? 'Login to vote' : hasVoted ? 'Already voted' : 'Upvote'}
          >
            👍 {issue.votes}
          </button>
          {user && issue.status === 'open' && (
            <button className="btn btn-claim" onClick={() => setShowClaim(true)}>Claim Fix</button>
          )}
          {user && issue.status === 'in-progress' && issue.claimedBy?.startsWith(user.name) && (
            <button className="btn btn-resolve" onClick={handleResolve}>Mark Resolved</button>
          )}
          {isOwner && issue.status === 'resolved' && (
            <button className="btn btn-claim" onClick={handleUnresolve}>↩ Reopen</button>
          )}
          {isOwner && issue.status !== 'resolved' && (
            <>
              <button className="btn btn-edit" onClick={() => { setEditForm({ title: issue.title, category: issue.category, location: issue.location, mapLink: issue.mapLink || '', description: issue.description }); setShowEdit(true) }}>✏️</button>
              <button className="btn btn-delete" onClick={handleDelete}>🗑️</button>
            </>
          )}
        </div>
      </div>

      {/* Description Modal */}
      {showDesc && (
        <div className="modal-overlay" onClick={() => setShowDesc(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <h5 className="modal-issue-title">{issue.title}</h5>
              <button className="btn-modal-close" onClick={() => setShowDesc(false)}>✕</button>
            </div>
            <p className="modal-issue-location">📍 {issue.location}</p>
            {issue.mapLink && <a className="issue-maplink" href={issue.mapLink} target="_blank" rel="noreferrer">🗺️ View on Map</a>}
            <p className="modal-issue-desc">{issue.description}</p>
            <div className="issue-meta mt-2">
              <span>By {issue.reportedBy}</span>
              {issue.reporterPhone && <span>📞 {issue.reporterPhone}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaim && (
        <div className="modal-overlay" onClick={() => setShowClaim(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <h5 className="modal-issue-title">🏗️ Claim this Fix</h5>
              <button className="btn-modal-close" onClick={() => setShowClaim(false)}>✕</button>
            </div>
            <p className="modal-sub">Provide your details so the community can trust your commitment.</p>
            {claimErr && <div className="alert alert-danger py-2">{claimErr}</div>}
            <div className="mb-3">
              <label className="form-label">Your Name</label>
              <input className="form-control" value={claimForm.name} onChange={e => setClaimForm({ ...claimForm, name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number <span className="text-danger">*</span></label>
              <input className="form-control" placeholder="e.g. 9876543210" value={claimForm.phone} onChange={e => setClaimForm({ ...claimForm, phone: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="form-label">Organisation (optional)</label>
              <input className="form-control" placeholder="e.g. City Roads Dept." value={claimForm.org} onChange={e => setClaimForm({ ...claimForm, org: e.target.value })} />
            </div>
            <button className="btn btn-primary w-100" onClick={handleClaimSubmit}>Confirm Claim</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <h5 className="modal-issue-title">✏️ Edit Issue</h5>
              <button className="btn-modal-close" onClick={() => setShowEdit(false)}>✕</button>
            </div>
            {editErr && <div className="alert alert-danger py-2">{editErr}</div>}
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input className="form-control" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input className="form-control" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Map Link (optional)</label>
              <input className="form-control" value={editForm.mapLink} onChange={e => setEditForm({ ...editForm, mapLink: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
            <button className="btn btn-primary w-100" onClick={handleEditSubmit}>Save Changes</button>
          </div>
        </div>
      )}
    </>
  )
}

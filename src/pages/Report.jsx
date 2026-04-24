import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useIssues } from '../context/IssuesContext'

const CATEGORIES = ['Lighting', 'Roads', 'Sanitation', 'Parks', 'Water', 'Other']

export default function Report() {
  const { user } = useAuth()
  const { addIssue } = useIssues()
  const navigate = useNavigate()

  const [form, setForm] = useState({ title: '', category: 'Roads', location: '', mapLink: '', description: '', reporterPhone: '' })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    if (!form.title || !form.location || !form.description || !form.reporterPhone) {
      setError('Please fill in all required fields including your phone number.')
      return
    }
    addIssue({ ...form, reportedBy: user.name, reportedById: user.id })
    setSuccess(true)
    setTimeout(() => navigate('/board'), 1800)
  }

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="form-card mx-auto">
          <h2 className="form-title">📋 Report an Issue</h2>
          <p className="form-sub">Tell us what's broken. Your report goes live instantly.</p>

          {success && (
            <div className="alert alert-success">✅ Issue reported! Redirecting to board...</div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Issue Title <span className="text-danger">*</span></label>
              <input name="title" className="form-control" placeholder="e.g. Broken streetlight on Oak Ave" value={form.title} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Location <span className="text-danger">*</span></label>
              <input name="location" className="form-control" placeholder="e.g. Main Street, Block 4" value={form.location} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Map Location Link <span className="label-optional">(optional)</span></label>
              <input name="mapLink" className="form-control" placeholder="Paste a Google Maps link to the exact spot" value={form.mapLink} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description <span className="text-danger">*</span></label>
              <textarea name="description" className="form-control" rows="4" placeholder="Describe the problem in detail..." value={form.description} onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="form-label">Your Phone Number <span className="text-danger">*</span></label>
              <input name="reporterPhone" className="form-control" placeholder="e.g. 9876543210" value={form.reporterPhone} onChange={handleChange} />
              <div className="form-text">Required so the community can verify this is a real report.</div>
            </div>
            <button type="submit" className="btn btn-primary w-100 btn-submit">Submit Report</button>
          </form>
        </div>
      </div>
    </div>
  )
}

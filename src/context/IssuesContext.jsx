import { createContext, useContext, useState } from 'react'

const IssuesContext = createContext(null)

const SEED_ISSUES = [
  { id: 1, title: 'Broken Street Light on Oak Avenue', category: 'Lighting', location: 'Oak Avenue, Near Bus Stop 14, New York', mapLink: '', description: 'The street light has been non-functional for over two weeks. The area is very dark at night making it unsafe for pedestrians and cyclists.', reportedBy: 'Ethan Walker', reportedById: 'seed1', reporterPhone: '2125550134', votes: 14, votedBy: [], status: 'open', date: '2026-04-10', claimedBy: null, claimerPhone: null, resolvedBy: null, resolvedDate: null },
  { id: 2, title: 'Pothole on Camden High Street', category: 'Roads', location: 'Camden High Street, London', mapLink: '', description: 'A large pothole has formed near the petrol station junction. Several bikes have been damaged. It needs urgent patching before the rainy season makes it worse.', reportedBy: 'Olivia Bennett', reportedById: 'seed2', reporterPhone: '447700900123', votes: 22, votedBy: [], status: 'in-progress', date: '2026-04-08', claimedBy: 'Camden Council Roads', claimerPhone: '442079460000', resolvedBy: null, resolvedDate: null },
  { id: 3, title: 'Overflowing Garbage Bin at Bondi Market', category: 'Sanitation', location: 'Campbell Parade, 4th Street, Sydney', mapLink: '', description: 'The garbage bin near the fish market has been overflowing for 4 days. Stray animals are spreading waste onto the road causing a health hazard.', reportedBy: 'Liam Harrison', reportedById: 'seed3', reporterPhone: '61412345678', votes: 9, votedBy: [], status: 'open', date: '2026-04-15', claimedBy: null, claimerPhone: null, resolvedBy: null, resolvedDate: null },
  { id: 4, title: 'Park Benches Vandalized at High Park', category: 'Parks', location: 'High Park, Toronto', mapLink: '', description: 'Three benches in the park have been broken and vandalised. Elderly residents who regularly visit the park have no place to sit. Immediate repair needed.', reportedBy: 'Sophie Tremblay', reportedById: 'seed4', reporterPhone: '14165550199', votes: 7, votedBy: [], status: 'open', date: '2026-04-17', claimedBy: null, claimerPhone: null, resolvedBy: null, resolvedDate: null },
  { id: 5, title: 'Water Pipe Leaking Near Shibuya Crossing', category: 'Water', location: 'Shibuya Crossing, Tokyo', mapLink: '', description: 'An underground water supply pipe is leaking and water has been flowing onto the road for 5 days. The wet road is causing accidents and wasting potable water.', reportedBy: 'Haruki Tanaka', reportedById: 'seed5', reporterPhone: '819012345678', votes: 18, votedBy: [], status: 'open', date: '2026-04-12', claimedBy: null, claimerPhone: null, resolvedBy: null, resolvedDate: null },
  { id: 6, title: 'Open Drain on Unter den Linden', category: 'Roads', location: 'Unter den Linden, Berlin', mapLink: '', description: 'An open drain without a cover has been reported near Brandenburg Gate. It was a danger to night commuters. The cover has now been fixed by the city team.', reportedBy: 'Lena Müller', reportedById: 'seed6', reporterPhone: '4915112345678', votes: 31, votedBy: [], status: 'resolved', date: '2026-04-05', claimedBy: 'Berlin City Works', claimerPhone: '493090260', resolvedBy: 'Berlin City Works', resolvedDate: '2026-04-20' },
]
export function IssuesProvider({ children }) {
  const [issues, setIssues] = useState(() => {
    const saved = localStorage.getItem('fixit_issues')
    return saved ? JSON.parse(saved) : SEED_ISSUES
  })

  const save = (updated) => {
    setIssues(updated)
    localStorage.setItem('fixit_issues', JSON.stringify(updated))
  }

  const addIssue = (issue) => {
    const newIssue = { ...issue, id: Date.now(), votes: 0, votedBy: [], status: 'open', date: new Date().toISOString().split('T')[0], claimedBy: null, claimerPhone: null, resolvedBy: null, resolvedDate: null }
    save([newIssue, ...issues])
  }

  const editIssue = (id, updates) => {
    save(issues.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  const deleteIssue = (id) => {
    save(issues.filter(i => i.id !== id))
  }

  const voteIssue = (id, userId) => {
    save(issues.map(i => {
      if (i.id !== id || i.votedBy.includes(userId)) return i
      return { ...i, votes: i.votes + 1, votedBy: [...i.votedBy, userId] }
    }))
  }

  const claimIssue = (id, claimedBy, claimerPhone) => {
    save(issues.map(i => i.id === id ? { ...i, status: 'in-progress', claimedBy, claimerPhone } : i))
  }

  const resolveIssue = (id, resolvedBy) => {
    save(issues.map(i => i.id === id ? { ...i, status: 'resolved', resolvedBy, resolvedDate: new Date().toISOString().split('T')[0] } : i))
  }

  const unresolveIssue = (id) => {
    save(issues.map(i => i.id === id ? { ...i, status: 'in-progress', resolvedBy: null, resolvedDate: null } : i))
  }

  return (
    <IssuesContext.Provider value={{ issues, addIssue, editIssue, deleteIssue, voteIssue, claimIssue, resolveIssue, unresolveIssue }}>
      {children}
    </IssuesContext.Provider>
  )
}

export const useIssues = () => useContext(IssuesContext)

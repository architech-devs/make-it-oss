
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Layout/Navbar'
import Footer from '@/components/Footer/Footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Repo {
  id: number
  full_name: string
  private: boolean
  html_url: string
}
interface User {
  id: number
  username: string
  avatarUrl: string
}

const Dashboard = () => {
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)
  const [repos, setRepos] = useState<Repo[]>([])
  const [showRepos, setShowRepos] = useState(true) 
  const navigate=useNavigate()

  const handleBack = () => {
    setShowRepos(false)
    navigate("/")
  }

  useEffect(() => {
    fetch('http://localhost:3000/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user || null))

    fetch('http://localhost:3000/api/github/repos', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setRepos(data || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please login.</div>

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto pt-2">
      <div className="sticky top-0 z-50 backdrop-blur py-2 bg-background/80">
        <Navbar />
      </div>

      <div className="px-4 md:px-0 mt-4">
        {showRepos && (
          <div className="flex items-center gap-4 mb-4">
            <img src={user.avatarUrl} alt={user.username} className="w-12 h-12 rounded-full" />
            <h2 className="text-xl font-semibold">{user.username}'s Dashboard</h2>
            <Button variant="ghost" onClick={handleBack} className="ml-auto flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        )}

        {showRepos && (
          <ul className="space-y-2">
            {repos.length > 0 ? (
              repos.map((repo) => (
                <li key={repo.id} className="p-2 border rounded hover:bg-gray-600 transition">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-medium">
                    {repo.full_name}
                  </a>
                  {repo.private && <span className="ml-2 text-sm text-red-500">(Private)</span>}
                </li>
              ))
            ) : (
              <li>No repositories found.</li>
            )}
          </ul>
        )}
      </div>

      <div className="mt-auto pt-20">
        <Footer />
      </div>
    </div>
  )
}

export default Dashboard


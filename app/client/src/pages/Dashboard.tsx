
// import React, { useEffect, useState } from 'react'
// import Navbar from '@/components/Layout/Navbar'
// import Footer from '@/components/Footer/Footer'
// import { Button } from '@/components/ui/button'
// import { ArrowLeft } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'

// interface Repo {
//   id: number
//   full_name: string
//   private: boolean
//   html_url: string
// }
// interface User {
//   id: number
//   username: string
//   avatarUrl: string
// }

// const Dashboard = () => {
//   const [user, setUser] = useState<User>()
//   const [loading, setLoading] = useState(true)
//   const [repos, setRepos] = useState<Repo[]>([])
//   const [showRepos, setShowRepos] = useState(true) 
//   const navigate=useNavigate()

//   const handleBack = () => {
//     setShowRepos(false)
//     navigate("/")
//   }

//   useEffect(() => {
//     fetch('http://localhost:3000/api/auth/me', { credentials: 'include' })
//       .then((r) => (r.ok ? r.json() : null))
//       .then((data) => setUser(data?.user || null))

//     fetch('http://localhost:3000/api/github/repos', { credentials: 'include' })
//       .then((r) => r.json())
//       .then((data) => setRepos(data || []))
//       .finally(() => setLoading(false))
//   }, [])

//   if (loading) return <div>Loading...</div>
//   if (!user) return <div>Please login.</div>

//   return (
//     <div className="flex flex-col min-h-screen max-w-2xl mx-auto pt-2">
//       <div className="sticky top-0 z-50 backdrop-blur py-2 bg-background/80">
//         <Navbar />
//       </div>

//       <div className="px-4 md:px-0 mt-4">
//         {showRepos && (
//           <div className="flex items-center gap-4 mb-4">
//             <img src={user.avatarUrl} alt={user.username} className="w-12 h-12 rounded-full" />
//             <h2 className="text-xl font-semibold">{user.username}'s Dashboard</h2>
//             <Button variant="ghost" onClick={handleBack} className="ml-auto flex items-center gap-2">
//               <ArrowLeft className="w-4 h-4" />
//               Back
//             </Button>
//           </div>
//         )}

//         {showRepos && (
//           <ul className="space-y-2">
//             {repos.length > 0 ? (
//               repos.map((repo) => (
//                 <li key={repo.id} className="p-2 border rounded hover:bg-gray-600 transition">
//                   <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-medium">
//                     {repo.full_name}
//                   </a>
//                   {repo.private && <span className="ml-2 text-sm text-red-500">(Private)</span>}
//                 </li>
//               ))
//             ) : (
//               <li>No repositories found.</li>
//             )}
//           </ul>
//         )}
//       </div>

//       <div className="mt-auto pt-20">
//         <Footer />
//       </div>
//     </div>
//   )
// }

// export default Dashboard

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Layout/Navbar'
import Footer from '@/components/Footer/Footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, GitFork, Lock, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
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

const REPOS_PER_PAGE = 6

const Dashboard = () => {
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)
  const [repos, setRepos] = useState<Repo[]>([])
  const [showRepos, setShowRepos] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const api=import.meta.env.VITE_BACKEND_URL

  const handleBack = () => {
    setShowRepos(false)
    navigate("/")
  }

  useEffect(() => {
    fetch(`${api}/api/auth/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user || null))

    fetch(`${api}/api/github/repos`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setRepos(data || []))
      .finally(() => setLoading(false))
  }, [])

  // Pagination logic
  const totalPages = Math.ceil(repos.length / REPOS_PER_PAGE)
  const startIndex = (currentPage - 1) * REPOS_PER_PAGE
  const endIndex = startIndex + REPOS_PER_PAGE
  const currentRepos = repos.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToPrevious = () => {
    if (currentPage > 1) goToPage(currentPage - 1)
  }

  const goToNext = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to access your dashboard.</p>
          <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="sticky top-0 z-50 backdrop-blur-xl py-3  ">
        <div className="max-w-5xl mx-auto px-4">
          <Navbar />
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {showRepos && (
          <>
            {/* User Header Card */}
            <div className="rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={user.avatarUrl} 
                      alt={user.username} 
                      className="w-16 h-16 rounded-full ring-4 ring-blue-500/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.username}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {repos.length} {repos.length === 1 ? 'repository' : 'repositories'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </div>
            </div>

            {/* Repositories Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Repositories
                </h2>
                {repos.length > REPOS_PER_PAGE && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </p>
                )}
              </div>
              
              {repos.length > 0 ? (
                <>
                  <div className="grid gap-4">
                    {currentRepos.map((repo) => (
                      <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-xl p-5 border border-gray-200 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {repo.private ? (
                                <Lock className="w-4 h-4 text-amber-500" />
                              ) : (
                                <Globe className="w-4 h-4 text-green-500" />
                              )}
                              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {repo.full_name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                {repo.private ? (
                                  <>
                                    <Lock className="w-3 h-3" />
                                    Private
                                  </>
                                ) : (
                                  <>
                                    <Globe className="w-3 h-3" />
                                    Public
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          // Show first page, last page, current page, and pages around current
                          const showPage = 
                            page === 1 || 
                            page === totalPages || 
                            (page >= currentPage - 1 && page <= currentPage + 1)

                          if (!showPage) {
                            // Show ellipsis
                            if (page === currentPage - 2 || page === currentPage + 2) {
                              return (
                                <span key={page} className="px-2 text-gray-400">
                                  ...
                                </span>
                              )
                            }
                            return null
                          }

                          return (
                            <Button
                              key={page}
                              onClick={() => goToPage(page)}
                              variant={currentPage === page ? "default" : "outline"}
                              className={`w-10 h-10 p-0 ${
                                currentPage === page 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                  : ''
                              }`}
                            >
                              {page}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GitFork className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No repositories found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You don't have any repositories yet. Start by creating one on GitHub!
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-5 border-t ">
        <div className="max-w-5xl mx-auto pt-5">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
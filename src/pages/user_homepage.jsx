"use client"
import { useMemo, useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useUserContext } from "../context/UserContext"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import axios from "axios"
import calculateProfileCompletion from "../utils/profileCompletion"

dayjs.extend(relativeTime)

// Simple inline chevron icon
function Chevron({ direction = "right", className = "" }) {
  const rotate = direction === "left" ? "rotate-180" : ""
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${rotate} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

function ArrowButton({ onClick, direction = "right", className = "", label }) {
  return (
    <button
      type="button"
      aria-label={label || (direction === "left" ? "Previous" : "Next")}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full bg-white text-gray-700 shadow-md ring-1 ring-gray-200 hover:bg-gray-50 h-10 w-10 ${className}`}
    >
      <Chevron direction={direction} />
    </button>
  )
}

function Dots({ total, active, onDot }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onDot?.(i)}
          className={`h-1.5 rounded-full transition-all ${i === active ? "bg-gray-700 w-5" : "bg-gray-300 w-3"}`}
        />
      ))}
    </div>
  )
}

/* Profile Completion Component */
function ProfileCompletion({ user }) {
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [lastUpdated, setLastUpdated] = useState("")
  const [profileData, setProfileData] = useState({
    education: [],
    certificates: [],
    projects: [],
    skills: [],
    about: "",
    social_links: {},
    full_address: "",
    workExperiences: [],
    userProfile: null,
    recruiterProfile: null
  })

  const getProgressColor = (value) => {
    if (value <= 10) return '#f44336'
    if (value <= 60) return '#ff9800'
    return '#4caf50'
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (!user) return

        let promises = []
        promises.push(
          axios.get("https://job-portal-server-six-eosin.vercel.app/api/user-profile/skills", 
            { withCredentials: true })
            .then(res => {
              return { skills: res.data.skills || res.data || [] }
            })
            .catch(() => {
              return { skills: [] }
            })
        )

        if (user.role === 3) {
          promises = promises.concat([
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/user-profile", 
              { withCredentials: true })
              .then(res => {
                return { 
                  userProfile: res.data,
                  about: res.data.about || "",
                  full_address: res.data.full_address || "",
                  social_links: res.data.social_links || {}
                }
              })
              .catch(() => {
                return {}
              }),
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/education", 
              { withCredentials: true })
              .then(res => {
                return { education: res.data.result || res.data || [] }
              })
              .catch(() => {
                return { education: [] }
              }),
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/work-experience", 
              { withCredentials: true })
              .then(res => {
                return { workExperiences: res.data.result || res.data || [] }
              })
              .catch(() => {
                return { workExperiences: [] }
              }),
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/certificates", 
              { withCredentials: true })
              .then(res => {
                return { certificates: res.data.result || res.data || [] }
              })
              .catch(() => {
                return { certificates: [] }
              }),
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/projects", 
              { withCredentials: true })
              .then(res => {
                return { projects: res.data.result || res.data || [] }
              })
              .catch(() => {
                return { projects: [] }
              })
          ])
        } else if (user.role === 2) {
          promises.push(
            axios.get("https://job-portal-server-six-eosin.vercel.app/api/recruiter-profile", 
              { withCredentials: true })
              .then(res => {
                return { recruiterProfile: res.data }
              })
              .catch(() => {
                return {}
              })
          )
        }

        const results = await Promise.all(promises)
        const mergedData = results.reduce((acc, curr) => {
          const normalized = {}
          Object.keys(curr).forEach(key => {
            normalized[key] = curr[key]?.result || curr[key]
          })
          return { ...acc, ...normalized }
        }, {})
        
        setProfileData(prev => ({ ...prev, ...mergedData }))

      } catch (error) {
        console.error("Error in fetchAllData:", error)
      }
    }

    fetchAllData()
  }, [user])

  useEffect(() => {
    if (!user) return
    const completion = calculateProfileCompletion(user, profileData)
    setProfileCompletion(completion)
    
    if (user?.updated_at) {
      setLastUpdated(dayjs(user.updated_at).fromNow())
    }
  }, [user, profileData])

  const progressColor = getProgressColor(profileCompletion)

  return (
    <div className="mb-10 md:mb-14">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <div 
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(${progressColor} ${profileCompletion * 3.6}deg, #e0e0e0 ${profileCompletion * 3.6}deg)`
                }}
              >
                <div className="bg-white w-[88px] h-[88px] rounded-full flex items-center justify-center">
                  {user?.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex flex-col items-center justify-center text-gray-500 text-center">
                      <div className="text-lg font-bold">+</div>
                      <div className="text-xs">Add photo</div>
                    </div>
                  )}
                </div>
              </div>
              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full text-xs font-medium border"
                style={{ 
                  borderColor: progressColor,
                  color: progressColor
                }}
              >
                {profileCompletion}%
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-base font-semibold mb-1">{user?.full_name || "User"}</h2>
              <p className="text-sm text-gray-500 mb-1">
                Updated {lastUpdated || "recently"}
              </p>
              <Link
                to={`/dashboard/edit-profile/${user?.id}`}
                className="text-blue-600 font-semibold text-sm hover:text-blue-600"
              >
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* 1) Top banner carousel (two banners side-by-side) + Featured Opportunities */
function BannerCarousel() {
  // One "slide" shows two banners side-by-side
  const slides = useMemo(
    () => [
      [
        { id: "a1", color: "from-slate-900 to-indigo-900", title: "Hiring Challenge Season 4", cta: "Register Now" },
        {
          id: "a2",
          color: "from-emerald-500 to-teal-400",
          title: "Where can your imagination take you?",
          cta: "Registration",
        },
      ],
      [
        { id: "b1", color: "from-fuchsia-600 to-rose-500", title: "CodeFest 2025", cta: "Join" },
        { id: "b2", color: "from-blue-600 to-cyan-500", title: "Designathon", cta: "Apply" },
      ],
    ],
    [],
  )
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)

  return (
    <section className="relative mx-auto w-full">
      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        {slides[index].map((b) => (
          <div
            key={b.id}
            className={`rounded-2xl bg-gradient-to-r ${b.color} p-6 text-white h-56 md:h-60 lg:h-64 flex items-end`}
          >
            <div>
              <p className="text-xs/5 uppercase tracking-wide text-white/80">Featured</p>
              <h3 className="text-2xl font-semibold max-w-[28ch] text-pretty">{b.title}</h3>
              <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900">
                {b.cta}
                <Chevron className="h-4 w-4 text-gray-900" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 md:-left-6">
        <div className="pointer-events-auto">
          <ArrowButton direction="left" onClick={prev} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 md:-right-6">
        <div className="pointer-events-auto">
          <ArrowButton direction="right" onClick={next} />
        </div>
      </div>

      <div className="mt-4">
        <Dots total={slides.length} active={index} onDot={setIndex} />
      </div>
    </section>
  )
}

function FeaturedOpportunities() {
  const cards = [
    {
      id: 1,
      badge: "Online",
      badge2: "Free",
      title: "Win dream internships with TATA Group!",
      desc: "Curious minds, here's your time to shine!",
      stats: "22,660 Registered",
      time: "1 month left",
      color: "from-fuchsia-500 to-pink-400",
    },
    {
      id: 2,
      badge: "Online",
      badge2: "Free",
      title: "Win Cash Prizes worth upto INR 1.8 Lakhs",
      desc: "Aspire 2.0 by HDFC Life",
      stats: "14 Registered",
      time: "18 days left",
      color: "from-rose-400 to-orange-300",
    },
    {
      id: 3,
      badge: "Online",
      badge2: "Free",
      title: "UST D3CODE 2025",
      desc: "UST Hackathon",
      stats: "21,519 Registered",
      time: "7 days left",
      color: "from-indigo-500 to-blue-400",
    },
    {
      id: 4,
      badge: "Festival",
      badge2: null,
      title: "Meesho DICE Challenge 2.0",
      desc: "Compete with the sharpest minds",
      stats: "1,342 Registered",
      time: "—",
      color: "from-amber-400 to-yellow-300",
    },
  ]

  return (
    <section className="relative rounded-3xl bg-gradient-to-b from-white to-gray-50 p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-balance text-2xl font-semibold text-gray-900 sm:text-3xl">Featured Opportunities</h2>
          <p className="mt-2 text-sm text-gray-600">
            Check out the curated opportunities handpicked for you from top organizations.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <ArrowButton direction="left" onClick={() => {}} />
          <ArrowButton direction="right" onClick={() => {}} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <article
            key={c.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className={`h-40 bg-gradient-to-r ${c.color} p-3`}>
              <div className="flex gap-2">
                {c.badge && (
                  <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-black/5">
                    {c.badge}
                  </span>
                )}
                {c.badge2 && (
                  <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-black/5">
                    {c.badge2}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2 p-4">
              <h3 className="font-semibold text-gray-900">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.desc}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{c.stats}</span>
                <span>{c.time}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* Shared horizontal rail with overlay arrows */
function ScrollRail({ children }) {
  const scrollerRef = useRef(null)
  const scrollBy = (amount) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: amount, behavior: "smooth" })
  }
  return (
    <div className="relative">
      <div ref={scrollerRef} className="scroll-smooth overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]">
        <div className="flex min-w-full gap-6">{children}</div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
        <div className="pointer-events-auto -ml-3">
          <ArrowButton direction="left" onClick={() => scrollBy(-360)} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
        <div className="pointer-events-auto -mr-3">
          <ArrowButton direction="right" onClick={() => scrollBy(360)} />
        </div>
      </div>
    </div>
  )
}

/* 2) AI-Powered Mock Tests */
function MockTests() {
  const tabs = ["Tech", "Management", "General"]
  const [active, setActive] = useState("Tech")
  const tests = [
    {
      id: 1,
      role: "Software Developer",
      desc: "Designs, codes, and maintains software solutions.",
      color: "from-fuchsia-600 to-indigo-600",
    },
    {
      id: 2,
      role: "Data Analyst",
      desc: "Analyzes and interprets complex data for insights.",
      color: "from-purple-600 to-pink-500",
    },
    {
      id: 3,
      role: "Backend Developer",
      desc: "Develops and maintains server-side applications.",
      color: "from-blue-600 to-indigo-500",
    },
    {
      id: 4,
      role: "Frontend Developer",
      desc: "Creates engaging, responsive web interfaces.",
      color: "from-violet-600 to-fuchsia-500",
    },
  ]

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">AI-Powered Mock Tests</h2>
          <p className="mt-1 text-sm text-gray-600">
            Master your concepts with AI-Powered full-length mock tests for 360° preparation!
          </p>
        </div>
        <a href="#" className="shrink-0 text-sm font-medium text-blue-600 hover:underline">
          View all →
        </a>
      </div>

      <div className="flex flex-wrap gap-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              active === t
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <ScrollRail>
        {tests.map((t) => (
          <article
            key={t.id}
            className="w-72 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className={`h-36 bg-gradient-to-tr ${t.color} p-4 text-white`}>
              <div className="mt-5 text-xl font-semibold">{t.role}</div>
            </div>
            <div className="space-y-3 p-4">
              <p className="text-sm text-gray-600">{t.desc}</p>
              <div className="flex items-center justify-between">
                <a href="#" className="text-sm font-medium text-blue-700 hover:underline">
                  Start Test
                </a>
                <ArrowButton onClick={() => {}} label="Open" />
              </div>
            </div>
          </article>
        ))}
      </ScrollRail>
    </section>
  )
}

/* 3) Internships & Jobs rails */
function ListingCard({ item }) {
  return (
    <article className="w-80 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className={`h-28 bg-gradient-to-r ${item.color} relative`}>
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-black/5">
          {item.tag}
        </span>
        {item.tag2 && (
          <span className="absolute left-20 top-3 rounded-md bg-amber-400/95 px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-black/5">
            {item.tag2}
          </span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-semibold text-gray-900">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.company}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{item.meta1}</span>
          <span>{item.meta2}</span>
        </div>
      </div>
    </article>
  )
}

function RailSection({ title, items }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {title === "Internships"
              ? "Find the Internships that fit your career aspirations."
              : "Find jobs that fit your career aspirations."}
          </p>
        </div>
        <a href="#" className="shrink-0 text-sm font-medium text-blue-600 hover:underline">
          View all →
        </a>
      </div>
      <ScrollRail>
        {items.map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}
      </ScrollRail>
    </section>
  )
}

export default function UserHomepage() {
  const { user } = useUserContext()
  const internships = [
    {
      id: 1,
      title: "Field Sales and Marketing Internship",
      company: "BBM Method",
      meta1: "Bangalore",
      meta2: "Urban, Chennai, Gurgaon, Mumbai",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-blue-700 to-sky-500",
    },
    {
      id: 2,
      title: "HR Internship",
      company: "Centennial Infotech",
      meta1: "8 Applied",
      meta2: "Not Disclosed",
      tag: "WFH",
      tag2: "Actively Hiring",
      color: "from-rose-500 to-amber-400",
    },
    {
      id: 3,
      title: "WordPress Developer Internship",
      company: "Suventure Services",
      meta1: "170 Views",
      meta2: "Not Disclosed",
      tag: "WFH",
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: 4,
      title: "Software Engineer Apprenticeship",
      company: "Microsoft",
      meta1: "231 Views",
      meta2: "Bangalore Urban, Hyderabad",
      tag: "In Office",
      color: "from-amber-500 to-yellow-400",
    },
  ]

  const jobs = [
    {
      id: 1,
      title: "Field Sales Executive",
      company: "CloudCache Consulting",
      meta1: "125 Views",
      meta2: "Bangalore Urban",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-blue-700 to-sky-500",
    },
    {
      id: 2,
      title: "Branch Manager",
      company: "Advance Consultant",
      meta1: "172 Views",
      meta2: "Orai, Bisalpur, Nautanwa",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-rose-500 to-amber-400",
    },
    {
      id: 3,
      title: "Non IT Recruiter",
      company: "Sunshine Manpower Solution and Services",
      meta1: "29 Views",
      meta2: "Goregaon",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: 4,
      title: "Search Specialist",
      company: "Google",
      meta1: "94 Views",
      meta2: "Hyderabad",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-amber-500 to-yellow-400",
    },
  ]

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6 md:py-8 lg:py-10">
      {/* Profile Completion Section */}
      <ProfileCompletion user={user} />
      
      {/* 1) Hero banners + Featured opportunities */}
      <BannerCarousel />
      <div className="mt-10 md:mt-14">
        <FeaturedOpportunities />
      </div>

      {/* 2) AI-Powered Mock Tests */}
      <div className="mt-12 md:mt-16">
        <MockTests />
      </div>

      {/* 3) Internships & Jobs */}
      <div className="mt-12 md:mt-16 space-y-12">
        <RailSection title="Internships" items={internships} />
        <RailSection title="Jobs" items={jobs} />
      </div>
    </main>
  )
}
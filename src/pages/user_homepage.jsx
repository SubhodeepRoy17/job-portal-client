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
      className={`h-4 w-4 md:h-5 md:w-5 ${rotate} ${className}`}
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
      className={`inline-flex items-center justify-center rounded-full bg-white text-gray-700 shadow-md ring-1 ring-gray-200 hover:bg-gray-50 h-8 w-8 md:h-10 md:w-10 ${className}`}
    >
      <Chevron direction={direction} />
    </button>
  )
}

function Dots({ total, active, onDot }) {
  return (
    <div className="flex items-center justify-center gap-1.5 md:gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onDot?.(i)}
          className={`h-1.5 rounded-full transition-all ${i === active ? "bg-gray-700 w-4 md:w-5" : "bg-gray-300 w-2 md:w-3"}`}
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
    <div className="mb-6 md:mb-10 lg:mb-14">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-xl p-4 md:p-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0">
              <div 
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(${progressColor} ${profileCompletion * 3.6}deg, #e0e0e0 ${profileCompletion * 3.6}deg)`
                }}
              >
                <div className="bg-white w-[56px] h-[56px] md:w-[88px] md:h-[88px] rounded-full flex items-center justify-center">
                  {user?.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt="Profile"
                      className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gray-100 flex flex-col items-center justify-center text-gray-500 text-center">
                      <div className="text-sm md:text-lg font-bold">+</div>
                      <div className="text-[10px] md:text-xs">Add photo</div>
                    </div>
                  )}
                </div>
              </div>
              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[10px] md:text-xs font-medium border"
                style={{ 
                  borderColor: progressColor,
                  color: progressColor
                }}
              >
                {profileCompletion}%
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-sm md:text-base font-semibold mb-1 truncate">{user?.full_name || "User"}</h2>
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                Updated {lastUpdated || "recently"}
              </p>
              <Link
                to={`/dashboard/edit-profile/${user?.id}`}
                className="text-blue-600 font-semibold text-xs md:text-sm hover:text-blue-600"
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

function BannerCarousel() {
  const banners = useMemo(
    () => [
      { id: "a1", color: "from-slate-900 to-indigo-900", title: "Hiring Challenge Season 4", cta: "Register Now" },
      { id: "a2", color: "from-emerald-500 to-teal-400", title: "Where can your imagination take you?", cta: "Registration" },
      { id: "b1", color: "from-fuchsia-600 to-rose-500", title: "CodeFest 2025", cta: "Join" },
      { id: "b2", color: "from-blue-600 to-cyan-500", title: "Designathon", cta: "Apply" },
      { id: "c1", color: "from-orange-500 to-red-500", title: "Startup Pitch Competition", cta: "Apply Now" },
      { id: "c2", color: "from-purple-600 to-pink-500", title: "Data Science Hackathon", cta: "Participate" },
    ],
    [],
  )
  
  const scrollerRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const autoPlayRef = useRef()
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Create duplicated banners for infinite scroll effect
  const duplicatedBanners = useMemo(() => {
    return [...banners, ...banners, ...banners];
  }, [banners]);

  // Reset scroll position when at the beginning or end of duplicated items
  const checkScrollPosition = () => {
    const el = scrollerRef.current;
    if (!el) return;
    
    const scrollWidth = el.scrollWidth;
    const scrollLeft = el.scrollLeft;
    const clientWidth = el.clientWidth;
    
    // If we're at the beginning of the duplicated set, jump to the middle
    if (scrollLeft < clientWidth) {
      isScrollingRef.current = true;
      el.scrollTo({
        left: scrollWidth / 3,
        behavior: 'instant'
      });
      setCurrentIndex(0);
    } 
    // If we're at the end of the duplicated set, jump to the middle
    else if (scrollLeft > scrollWidth - clientWidth * 2) {
      isScrollingRef.current = true;
      el.scrollTo({
        left: scrollWidth / 3 - clientWidth,
        behavior: 'instant'
      });
      setCurrentIndex(banners.length - 1);
    }
  }

  // Auto-scroll for mobile - continuous in same direction
  useEffect(() => {
    const el = scrollerRef.current
    if (!el || !isMobile) return

    autoPlayRef.current = setInterval(() => {
      const cardWidth = el.querySelector('.banner-card')?.offsetWidth || 0;
      const gap = 16; // gap-4 is 16px
      const scrollAmount = cardWidth + gap;
      
      el.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      // Update current index based on scroll position
      const scrollPosition = el.scrollLeft;
      const newIndex = Math.round((scrollPosition % (banners.length * (cardWidth + gap))) / (cardWidth + gap));
      setCurrentIndex(newIndex);
    }, 6000) // Changed from 4000 to 6000

    return () => clearInterval(autoPlayRef.current)
  }, [isMobile, banners.length])

  const handleScroll = () => {
    if (isScrollingRef.current) {
      isScrollingRef.current = false;
      return;
    }
    
    const el = scrollerRef.current
    if (!el) return
    
    checkScrollPosition();
    
    const scrollPosition = el.scrollLeft
    const cardWidth = el.querySelector('.banner-card')?.offsetWidth || 0
    const gap = 16;
    
    // Calculate index based on modulo to handle the infinite scroll
    const newIndex = Math.round((scrollPosition % (banners.length * (cardWidth + gap))) / (cardWidth + gap));
    
    if (newIndex !== currentIndex && newIndex < banners.length) {
      setCurrentIndex(newIndex)
    }
  }

  // Desktop navigation functions
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length)
  }

  // Auto-scroll for desktop
  useEffect(() => {
    if (isMobile) return; // Skip if mobile
    
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 6000) // Changed from 4000 to 6000

    return () => clearInterval(autoPlayRef.current)
  }, [isMobile])

  return (
    <section className="relative mx-auto w-full">
      {/* Mobile view */}
      <div className="md:hidden relative">
        <div 
          ref={scrollerRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 snap-x snap-mandatory no-scrollbar"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedBanners.map((b, index) => (
            <div
              key={`${b.id}-${index}`}
              className="banner-card flex-shrink-0 w-[85vw] snap-start"
            >
              <div className={`rounded-xl bg-gradient-to-r ${b.color} p-4 text-white h-40 flex items-end`}>
                <div>
                  <p className="text-xs/5 uppercase tracking-wide text-white/80">Featured</p>
                  <h3 className="text-lg font-semibold max-w-[28ch] text-pretty">{b.title}</h3>
                  <button className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-900">
                    {b.cta}
                    <Chevron className="h-3 w-3 text-gray-900" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile dots indicator - same as desktop */}
        <div className="mt-3 flex justify-center">
          <Dots total={banners.length} active={currentIndex} onDot={(index) => {
            const el = scrollerRef.current;
            if (!el) return;
            
            const cardWidth = el.querySelector('.banner-card')?.offsetWidth || 0;
            const gap = 16;
            const middleSectionStart = banners.length * (cardWidth + gap);
            
            el.scrollTo({
              left: middleSectionStart + index * (cardWidth + gap),
              behavior: 'smooth'
            });
            
            setCurrentIndex(index);
          }} />
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block relative">
        <div className="flex gap-4 relative">
          {[
            banners[currentIndex % banners.length],
            banners[(currentIndex + 1) % banners.length]
          ].map((b) => (
            <div
              key={b.id}
              className={`flex-shrink-0 w-1/2 rounded-2xl bg-gradient-to-r ${b.color} p-6 text-white h-60 flex items-end`}
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
        
        {/* Desktop navigation arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-4">
          <ArrowButton direction="left" onClick={prevSlide} label="Previous banner" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-4">
          <ArrowButton direction="right" onClick={nextSlide} label="Next banner" />
        </div>
        
        <div className="mt-4">
          <Dots total={banners.length} active={currentIndex} onDot={(index) => setCurrentIndex(index)} />
        </div>
      </div>
    </section>
  )
}

function FeaturedOpportunities() {
  const cards = [
    { id: 1, badge: "Online", badge2: "Free", title: "Win dream internships with TATA Group!", desc: "Curious minds, here's your time to shine!", stats: "22,660 Registered", time: "1 month left", color: "from-fuchsia-500 to-pink-400" },
    { id: 2, badge: "Online", badge2: "Free", title: "Win Cash Prizes worth upto INR 1.8 Lakhs", desc: "Aspire 2.0 by HDFC Life", stats: "14 Registered", time: "18 days left", color: "from-rose-400 to-orange-300" },
    { id: 3, badge: "Online", badge2: "Free", title: "UST D3CODE 2025", desc: "UST Hackathon", stats: "21,519 Registered", time: "7 days left", color: "from-indigo-500 to-blue-400" },
    { id: 4, badge: "Festival", badge2: null, title: "Meesho DICE Challenge 2.0", desc: "Compete with the sharpest minds", stats: "1,342 Registered", time: "—", color: "from-amber-400 to-yellow-300" },
    { id: 5, badge: "Hackathon", badge2: "Prize", title: "AI Innovation Challenge 2025", desc: "Build the next big AI solution", stats: "5,230 Registered", time: "12 days left", color: "from-purple-500 to-blue-400" },
    { id: 6, badge: "Competition", badge2: "Scholarship", title: "National Coding Championship", desc: "Showcase your coding skills", stats: "18,450 Registered", time: "25 days left", color: "from-green-500 to-teal-400" },
  ]

  const scrollerRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const autoPlayRef = useRef()
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Create duplicated cards for infinite scroll effect
  const duplicatedCards = useMemo(() => {
    return [...cards, ...cards, ...cards];
  }, [cards]);

  // Reset scroll position when at the beginning or end of duplicated items
  const checkScrollPosition = () => {
    const el = scrollerRef.current;
    if (!el) return;
    
    const scrollWidth = el.scrollWidth;
    const scrollLeft = el.scrollLeft;
    const clientWidth = el.clientWidth;
    
    // If we're at the beginning of the duplicated set, jump to the middle
    if (scrollLeft < clientWidth) {
      isScrollingRef.current = true;
      el.scrollTo({
        left: scrollWidth / 3,
        behavior: 'instant'
      });
      setCurrentIndex(0);
    } 
    // If we're at the end of the duplicated set, jump to the middle
    else if (scrollLeft > scrollWidth - clientWidth * 2) {
      isScrollingRef.current = true;
      el.scrollTo({
        left: scrollWidth / 3 - clientWidth,
        behavior: 'instant'
      });
      setCurrentIndex(cards.length - 1);
    }
  }

  // Auto-scroll for mobile - continuous in same direction
  useEffect(() => {
    const el = scrollerRef.current
    if (!el || !isMobile) return

    autoPlayRef.current = setInterval(() => {
      const cardWidth = el.querySelector('.opportunity-card')?.offsetWidth || 0;
      const gap = 16; // gap-4 is 16px
      const scrollAmount = cardWidth + gap;
      
      el.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      // Update current index based on scroll position
      const scrollPosition = el.scrollLeft;
      const newIndex = Math.round((scrollPosition % (cards.length * (cardWidth + gap))) / (cardWidth + gap));
      setCurrentIndex(newIndex);
    }, 4000)

    return () => clearInterval(autoPlayRef.current)
  }, [isMobile, cards.length])

  const handleScroll = () => {
    if (isScrollingRef.current) {
      isScrollingRef.current = false;
      return;
    }
    
    const el = scrollerRef.current
    if (!el) return
    
    checkScrollPosition();
    
    const scrollPosition = el.scrollLeft
    const cardWidth = el.querySelector('.opportunity-card')?.offsetWidth || 0
    const gap = 16;
    
    // Calculate index based on modulo to handle the infinite scroll
    const newIndex = Math.round((scrollPosition % (cards.length * (cardWidth + gap))) / (cardWidth + gap));
    
    if (newIndex !== currentIndex && newIndex < cards.length) {
      setCurrentIndex(newIndex)
    }
  }

  // Desktop navigation functions
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % cards.length)
  }

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length)
  }

  // Auto-scroll for desktop
  useEffect(() => {
    if (isMobile) return; // Skip if mobile
    
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 4000)

    return () => clearInterval(autoPlayRef.current)
  }, [isMobile, currentIndex]) // Added currentIndex to dependencies

  return (
    <section className="relative rounded-xl md:rounded-3xl bg-gradient-to-b from-white to-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mb-4 md:mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Featured Opportunities</h2>
          <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-600">
            Check out the curated opportunities handpicked for you from top organizations.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 md:gap-3">
          <ArrowButton direction="left" onClick={prevSlide} />
          <ArrowButton direction="right" onClick={nextSlide} />
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden relative">
        <div 
          ref={scrollerRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 snap-x snap-mandatory no-scrollbar"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedCards.map((c, index) => (
            <article
              key={`${c.id}-${index}`}
              className="opportunity-card flex-shrink-0 w-[85vw] snap-start"
            >
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                <div className={`h-32 bg-gradient-to-r ${c.color} p-3`}>
                  <div className="flex gap-1.5">
                    {c.badge && <span className="rounded-md bg-white/90 px-1.5 py-1 text-xs font-medium text-gray-900">{c.badge}</span>}
                    {c.badge2 && <span className="rounded-md bg-white/90 px-1.5 py-1 text-xs font-medium text-gray-900">{c.badge2}</span>}
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <h3 className="text-sm font-semibold text-gray-900">{c.title}</h3>
                  <p className="text-xs text-gray-600">{c.desc}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{c.stats}</span>
                    <span>{c.time}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Mobile dots indicator - same as desktop */}
        <div className="mt-3 flex justify-center">
          <Dots total={cards.length} active={currentIndex} onDot={(index) => {
            const el = scrollerRef.current;
            if (!el) return;
            
            const cardWidth = el.querySelector('.opportunity-card')?.offsetWidth || 0;
            const gap = 16;
            const middleSectionStart = cards.length * (cardWidth + gap);
            
            el.scrollTo({
              left: middleSectionStart + index * (cardWidth + gap),
              behavior: 'smooth'
            });
            
            setCurrentIndex(index);
          }} />
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block relative">
        <div className="flex gap-4 relative">
          {[
            cards[currentIndex % cards.length],
            cards[(currentIndex + 1) % cards.length],
            cards[(currentIndex + 2) % cards.length],
            cards[(currentIndex + 3) % cards.length]
          ].map((c, i) => (
            <div key={`${c.id}-${i}`} className="flex-shrink-0 w-1/4">
              <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                <div className={`h-40 bg-gradient-to-r ${c.color} p-3`}>
                  <div className="flex gap-2">
                    {c.badge && <span className="rounded-md bg-white/90 px-1.5 py-1 text-xs font-medium text-gray-900">{c.badge}</span>}
                    {c.badge2 && <span className="rounded-md bg-white/90 px-1.5 py-1 text-xs font-medium text-gray-900">{c.badge2}</span>}
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="text-base font-semibold text-gray-900">{c.title}</h3>
                  <p className="text-sm text-gray-600">{c.desc}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{c.stats}</span>
                    <span>{c.time}</span>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Dots total={cards.length} active={currentIndex} onDot={(index) => setCurrentIndex(index)} />
        </div>
      </div>
    </section>
  )
}

/* Shared horizontal rail with overlay arrows - Hidden on mobile */
function ScrollRail({ children }) {
  const scrollerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])
  
  const scrollBy = (amount) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: amount, behavior: "smooth" })
  }
  
  return (
    <div className="relative">
      <div ref={scrollerRef} className="scroll-smooth overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]">
        <div className="flex min-w-full gap-4 md:gap-6 pb-2">{children}</div>
      </div>
      {/* Hide arrows on mobile */}
      {!isMobile && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
            <div className="pointer-events-auto -ml-2 md:-ml-3">
              <ArrowButton direction="left" onClick={() => scrollBy(-300)} />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
            <div className="pointer-events-auto -mr-2 md:-mr-3">
              <ArrowButton direction="right" onClick={() => scrollBy(300)} />
            </div>
          </div>
        </>
      )}
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
    {
      id: 5,
      role: "Software Developer",
      desc: "Designs, codes, and maintains software solutions.",
      color: "from-fuchsia-600 to-indigo-600",
    },
    {
      id: 6,
      role: "Data Analyst",
      desc: "Analyzes and interprets complex data for insights.",
      color: "from-purple-600 to-pink-500",
    },
    {
      id: 7,
      role: "Backend Developer",
      desc: "Develops and maintains server-side applications.",
      color: "from-blue-600 to-indigo-500",
    },
    {
      id: 8,
      role: "Frontend Developer",
      desc: "Creates engaging, responsive web interfaces.",
      color: "from-violet-600 to-fuchsia-500",
    },
    {
      id: 9,
      role: "Software Developer",
      desc: "Designs, codes, and maintains software solutions.",
      color: "from-fuchsia-600 to-indigo-600",
    },
    {
      id: 10,
      role: "Data Analyst",
      desc: "Analyzes and interprets complex data for insights.",
      color: "from-purple-600 to-pink-500",
    },
    {
      id: 11,
      role: "Backend Developer",
      desc: "Develops and maintains server-side applications.",
      color: "from-blue-600 to-indigo-500",
    },
    {
      id: 12,
      role: "Frontend Developer",
      desc: "Creates engaging, responsive web interfaces.",
      color: "from-violet-600 to-fuchsia-500",
    },
    {
      id: 13,
      role: "Software Developer",
      desc: "Designs, codes, and maintains software solutions.",
      color: "from-fuchsia-600 to-indigo-600",
    },
    {
      id: 14,
      role: "Data Analyst",
      desc: "Analyzes and interprets complex data for insights.",
      color: "from-purple-600 to-pink-500",
    },
    {
      id: 15,
      role: "Backend Developer",
      desc: "Develops and maintains server-side applications.",
      color: "from-blue-600 to-indigo-500",
    },
    {
      id: 16,
      role: "Frontend Developer",
      desc: "Creates engaging, responsive web interfaces.",
      color: "from-violet-600 to-fuchsia-500",
    },
  ]

  return (
    <section className="space-y-4 md:space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 sm:text-2xl md:sm:text-3xl">AI-Powered Mock Tests</h2>
          <p className="mt-1 text-xs md:text-sm text-gray-600">
            Master your concepts with AI-Powered full-length mock tests for 360° preparation!
          </p>
        </div>
        <a href="#" className="shrink-0 text-xs md:text-sm font-medium text-blue-600 hover:underline">
          View all →
        </a>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-full border px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm transition ${
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
            className="w-64 md:w-72 shrink-0 overflow-hidden rounded-xl md:rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className={`h-28 md:h-36 bg-gradient-to-tr ${t.color} p-3 md:p-4 text-white`}>
              <div className="mt-4 md:mt-5 text-lg md:text-xl font-semibold">{t.role}</div>
            </div>
            <div className="space-y-2 md:space-y-3 p-3 md:p-4">
              <p className="text-xs md:text-sm text-gray-600">{t.desc}</p>
              <div className="flex items-center justify-between">
                <a href="#" className="text-xs md:text-sm font-medium text-blue-700 hover:underline">
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
    <article className="w-64 md:w-80 shrink-0 overflow-hidden rounded-xl md:rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className={`h-24 md:h-28 bg-gradient-to-r ${item.color} relative`}>
        {/* Tags */}
        <div className="absolute left-2 top-2 md:left-3 md:top-3 flex items-center">
          <span className="rounded-md bg-white/95 px-1.5 py-1 text-xs font-medium text-gray-900 ring-1 ring-black/5">
            {item.tag}
          </span>
          {item.tag2 && (
            <span className="ml-1 rounded-md bg-amber-400/95 px-1.5 py-1 text-xs font-medium text-gray-900 ring-1 ring-black/5">
              {item.tag2}
            </span>
          )}
        </div> 

        {/* Company Logo (inside gradient box) */}
        <img
          src="https://bluestock.in/static/assets/logo/logo-android.webp"
          alt="logo"
          className="absolute right-2 bottom-0 md:right-3 md:bottom-1 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white p-2 shadow-lg"
        />
      </div>

      <div className="space-y-2 p-3 md:p-4">
        <h3 className="text-sm md:text-base font-semibold text-gray-900">{item.title}</h3>
        <p className="text-xs md:text-sm text-gray-600">{item.company}</p>
        <div className="mt-2 md:mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{item.meta1}</span>
          <span>{item.meta2}</span>
        </div>
      </div>
    </article>
  )
}

function RailSection({ title, items }) {
  return (
    <section className="space-y-3 md:space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-xs md:text-sm text-gray-600">
            {title === "Internships"
              ? "Find the Internships that fit your career aspirations."
              : "Find jobs that fit your career aspirations."}
          </p>
        </div>
        <a href="#" className="shrink-0 text-xs md:text-sm font-medium text-blue-600 hover:underline">
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

function TopMentors() {
  const mentors = [
    {
      id: 1,
      name: "Vedansh Dubey",
      title: "Assistant Manager HR @Wipro | MBA @XIMB, Ex-TCS, Nestlé, Tata Media | ...",
      rating: 4.9,
      image: "/professional-man-in-suit-smiling.jpg",
    },
    {
      id: 2,
      name: "Rutwik Borkar",
      title: "Flipkart | Bain & Co.| Gold Medalist, IIT Madras | XLRI Jamshedpur-BM' 24 | ...",
      rating: 4.9,
      image: "/professional-businessman.png",
    },
    {
      id: 3,
      name: "Yash Patel",
      title: "Strategy Manager @ Parag Milk Foods [MD's Office] | 300k+ Impressions | 32x ...",
      rating: 4.8,
      image: "/professional-man-with-beard-smiling.png",
    },
    {
      id: 4,
      name: "Shiri Agarwal",
      title: "Product @Telstra | MBA @MDI Gurgaon'24 | Rank 6th Unstoppable ...",
      rating: 4.9,
      image: "/professional-woman-smiling.png",
    },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Top Mentors</h3>
          <p className="mt-1 text-sm text-gray-600">
            In search of excellence? Explore the highest-rated mentors as recognized by the learner community.
          </p>
        </div>
        <a href="#" className="shrink-0 text-sm font-medium text-blue-600 hover:underline">
          View all →
        </a>
      </div>

      <ScrollRail>
        {mentors.map((mentor) => (
          <article
            key={mentor.id}
            className="w-80 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="relative h-32 bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-500 p-4">
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 right-8 h-8 w-8 rounded-full bg-white/30"></div>
                <div className="absolute bottom-4 left-8 h-4 w-4 rounded-full bg-white/20"></div>
                <div className="absolute top-8 left-12 h-2 w-8 rounded-full bg-white/25"></div>
              </div>

              {/* Available badge */}
              <div className="relative flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-900/80 px-2 py-1 text-xs font-medium text-white">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                  Available
                </span>

                {/* Trophy icon */}
                <div className="rounded-full bg-amber-400 p-1.5">
                  <svg className="h-4 w-4 text-amber-800" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2L7.5 7H2l4.5 3.5L5 16l5-3 5 3-1.5-5.5L18 7h-5.5L10 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative -mt-8 px-4 pb-4">
              {/* Profile image */}
              <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100">
                <img
                  src={mentor.image || "/placeholder.svg"}
                  alt={mentor.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Rating */}
              <div className="mb-2 flex items-center justify-center gap-1">
                <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">{mentor.rating}</span>
              </div>

              {/* Name and title */}
              <div className="space-y-2 text-center">
                <h4 className="font-semibold text-gray-900">{mentor.name}</h4>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{mentor.title}</p>
              </div>

              {/* View Profile button */}
              <div className="mt-4">
                <button className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  View Profile
                </button>
              </div>
            </div>
          </article>
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
    {
      id: 5,
      title: "Field Sales and Marketing Internship",
      company: "BBM Method",
      meta1: "Bangalore",
      meta2: "Urban, Chennai, Gurgaon, Mumbai",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-blue-700 to-sky-500",
    },
    {
      id: 6,
      title: "HR Internship",
      company: "Centennial Infotech",
      meta1: "8 Applied",
      meta2: "Not Disclosed",
      tag: "WFH",
      tag2: "Actively Hiring",
      color: "from-rose-500 to-amber-400",
    },
    {
      id: 7,
      title: "WordPress Developer Internship",
      company: "Suventure Services",
      meta1: "170 Views",
      meta2: "Not Disclosed",
      tag: "WFH",
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: 8,
      title: "Software Engineer Apprenticeship",
      company: "Microsoft",
      meta1: "231 Views",
      meta2: "Bangalore Urban, Hyderabad",
      tag: "In Office",
      color: "from-amber-500 to-yellow-400",
    },
    {
      id: 9,
      title: "Field Sales and Marketing Internship",
      company: "BBM Method",
      meta1: "Bangalore",
      meta2: "Urban, Chennai, Gurgaon, Mumbai",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-blue-700 to-sky-500",
    },
    {
      id: 10,
      title: "HR Internship",
      company: "Centennial Infotech",
      meta1: "8 Applied",
      meta2: "Not Disclosed",
      tag: "WFH",
      tag2: "Actively Hiring",
      color: "from-rose-500 to-amber-400",
    },
    {
      id: 11,
      title: "WordPress Developer Internship",
      company: "Suventure Services",
      meta1: "170 Views",
      meta2: "Not Disclosed",
      tag: "WFH",
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: 12,
      title: "Software Engineer Apprenticeship",
      company: "Microsoft",
      meta1: "231 Views",
      meta2: "Bangalore Urban, Hyderabad",
      tag: "In Office",
      color: "from-amber-500 to-yellow-400",
    },
    {
      id: 13,
      title: "Field Sales and Marketing Internship",
      company: "BBM Method",
      meta1: "Bangalore",
      meta2: "Urban, Chennai, Gurgaon, Mumbai",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-blue-700 to-sky-500",
    },
    {
      id: 14,
      title: "HR Internship",
      company: "Centennial Infotech",
      meta1: "8 Applied",
      meta2: "Not Disclosed",
      tag: "WFH",
      tag2: "Actively Hiring",
      color: "from-rose-500 to-amber-400",
    },
    {
      id: 15,
      title: "WordPress Developer Internship",
      company: "Suventure Services",
      meta1: "170 Views",
      meta2: "Not Disclosed",
      tag: "WFH",
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: 16,
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
    {
      id: 5,
      title: "Field Sales Executive",
      company: "CloudCache Consulting",
      meta1: "125 Views",
      meta2: "Bangalore Urban",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-blue-700 to-sky-500",
    },
    {
      id: 6,
      title: "Branch Manager",
      company: "Advance Consultant",
      meta1: "172 Views",
      meta2: "Orai, Bisalpur, Nautanwa",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-rose-500 to-amber-400",
    },
    {
      id: 7,
      title: "Non IT Recruiter",
      company: "Sunshine Manpower Solution and Services",
      meta1: "29 Views",
      meta2: "Goregaon",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: 8,
      title: "Search Specialist",
      company: "Google",
      meta1: "94 Views",
      meta2: "Hyderabad",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-amber-500 to-yellow-400",
    },
    {
      id: 9,
      title: "Field Sales Executive",
      company: "CloudCache Consulting",
      meta1: "125 Views",
      meta2: "Bangalore Urban",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-blue-700 to-sky-500",
    },
    {
      id: 10,
      title: "Branch Manager",
      company: "Advance Consultant",
      meta1: "172 Views",
      meta2: "Orai, Bisalpur, Nautanwa",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-rose-500 to-amber-400",
    },
    {
      id: 11,
      title: "Non IT Recruiter",
      company: "Sunshine Manpower Solution and Services",
      meta1: "29 Views",
      meta2: "Goregaon",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: 12,
      title: "Search Specialist",
      company: "Google",
      meta1: "94 Views",
      meta2: "Hyderabad",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-amber-500 to-yellow-400",
    },
    {
      id: 13,
      title: "Field Sales Executive",
      company: "CloudCache Consulting",
      meta1: "125 Views",
      meta2: "Bangalore Urban",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-blue-700 to-sky-500",
    },
    {
      id: 14,
      title: "Branch Manager",
      company: "Advance Consultant",
      meta1: "172 Views",
      meta2: "Orai, Bisalpur, Nautanwa",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-rose-500 to-amber-400",
    },
    {
      id: 15,
      title: "Non IT Recruiter",
      company: "Sunshine Manpower Solution and Services",
      meta1: "29 Views",
      meta2: "Goregaon",
      tag: "In Office",
      tag2: "Actively Hiring",
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: 16,
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
    <main className="mx-auto max-w-[1400px] px-3 py-4 md:px-4 md:py-6 lg:py-8 pb-20 md:pb-8">
      {/* Profile Completion Section */}
      <ProfileCompletion user={user} />
      
      {/* 1) Hero banners + Featured opportunities */}
      <BannerCarousel />
      <div className="mt-6 md:mt-10 lg:mt-14">
        <FeaturedOpportunities />
      </div>

      {/* 2) AI-Powered Mock Tests */}
      <div className="mt-8 md:mt-12 lg:mt-16">
        <MockTests />
      </div>

      {/* 3) Internships & Jobs */}
      <div className="mt-8 md:mt-12 lg:mt-16 space-y-8 md:space-y-12">
        <RailSection title="Internships" items={internships} />
        <RailSection title="Jobs" items={jobs} />
        <TopMentors />
      </div>
    </main>
  )
}
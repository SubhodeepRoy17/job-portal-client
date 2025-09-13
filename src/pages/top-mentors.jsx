// src/pages/top-mentors.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TopMentorsPage = () => {
  const [mentors, setMentors] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchMentors = async (pageNum) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/mentors?role=3&page=${pageNum}&limit=20&exclude_current=true`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (pageNum === 1) {
          setMentors(data.mentors);
        } else {
          setMentors(prev => [...prev, ...data.mentors]);
        }
        
        setHasMore(data.hasMore);
      } else {
        console.error('Failed to fetch mentors');
        // Fallback to mock data if API fails
        useMockData(pageNum);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      // Fallback to mock data
      useMockData(pageNum);
    } finally {
      setLoading(false);
    }
  };

  const useMockData = (pageNum) => {
    const mockMentors = [
      {
        id: 1,
        full_name: "Vedansh Dubey",
        headline: "Assistant Manager HR @Wipro | MBA @XIMB, Ex-TCS, Nestlé, Tata Media",
        rating: 4.9,
        profile_photo: "/professional-man-in-suit-smiling.jpg",
        type: 3
      },
      {
        id: 2,
        full_name: "Rutwik Borkar",
        headline: "Flipkart | Bain & Co.| Gold Medalist, IIT Madras | XLRI Jamshedpur-BM' 24",
        rating: 4.9,
        profile_photo: "/professional-businessman.png",
        type: 3
      },
      {
        id: 3,
        full_name: "Yash Patel",
        headline: "Strategy Manager @ Parag Milk Foods [MD's Office] | 300k+ Impressions | 32x",
        rating: 4.8,
        profile_photo: "/professional-man-with-beard-smiling.png",
        type: 3
      },
      {
        id: 4,
        full_name: "Shiri Agarwal",
        headline: "Product @Telstra | MBA @MDI Gurgaon'24 | Rank 6th Unstoppable",
        rating: 4.9,
        profile_photo: "/professional-woman-smiling.png",
        type: 3
      }
    ];
    
    if (pageNum === 1) {
      setMentors(mockMentors);
    } else {
      setMentors(prev => [...prev, ...mockMentors]);
    }
    
    setHasMore(pageNum < 2);
  };

  useEffect(() => {
    fetchMentors(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      
      if (window.innerHeight + document.documentElement.scrollTop > 
          document.documentElement.offsetHeight - 100) {
        setPage(prev => {
          const newPage = prev + 1;
          fetchMentors(newPage);
          return newPage;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Top Mentors</h1>
        <p className="text-gray-600 mb-8">
          Browse through our community of highly-rated mentors as recognized by learners.
        </p>

        {/* Mobile: 2 cards per row */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-4">
            {mentors.map((mentor) => (
              <MobileMentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>

        {/* Tablet/Desktop: 3-4 cards per row */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl: grid-cols-4 gap-6">
            {mentors.map((mentor) => (
              <DesktopMentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!hasMore && mentors.length > 0 && (
          <div className="text-center mt-8 text-gray-500">
            You've reached the end of the list
          </div>
        )}
      </div>
    </div>
  );
};

// Mobile Mentor Card (2 per row)
const MobileMentorCard = ({ mentor }) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header gradient */}
      <div className="relative h-24 bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-500 p-2">
        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
            Available
          </span>
          <div className="rounded-full bg-amber-400 p-1">
            <svg className="h-3.5 w-3.5 text-amber-800" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2L7.5 7H2l4.5 3.5L5 16 l5-3 5 3-1.5-5.5L18 7h-5.5L10 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative -mt-8 px-3 pb-3">
        <div className="mx-auto mb-2 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-gray-100">
          <img
            src={mentor.profile_photo || "/placeholder.svg"}
            alt={mentor.full_name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Rating */}
        <div className="mb-1 flex items-center justify-center gap-1">
          <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0 l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1. 07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-semibold text-gray-900">{mentor.rating}</span>
        </div>

        {/* Text Content */}
        <div className="space-y-1 text-center">
          <h4 className="font-semibold text-gray-900 text-sm">{mentor.full_name}</h4>
          <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">
            {mentor.headline}...
          </p>
        </div>

        {/* Button */}
        <div className="mt-2">
          <button className="w-full rounded-full border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
            View Profile
          </button>
        </div>
      </div>
    </article>
  );
};

// Desktop Mentor Card (3-4 per row)
const DesktopMentorCard = ({ mentor }) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-32 bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-500 p-4">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-8 h-8 w-8 rounded-full bg-white/30"></div>
          <div className="absolute bottom-4 left-8 h-4 w-4 rounded-full bg-white/20"></div>
          <div className="absolute top-8 left-12 h-2 w-8 rounded-full bg-white/25"></div>
        </div>

        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-900/80 px-2 py-1 text-xs font-medium text-white">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
            Available
          </span>
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
        <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100">
          <img
            src={mentor.profile_photo || "/placeholder.svg"}
            alt={mentor.full_name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mb-2 flex items-center justify-center gap-1">
          <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292 z" />
          </svg>
          <span className="text-sm font-semibold text-gray-900">{mentor.rating}</span>
        </div>

        <div className="space-y-2 text-center">
          <h4 className="font-semibold text-gray-900">{mentor.full_name}</h4>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
            {mentor.headline}...
          </p>
        </div>

        <div className="mt-4">
          <button className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            View Profile
          </button>
        </div>
      </div>
    </article>
  );
};

export default TopMentorsPage;
// pages/top-mentors.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const TopMentorsPage = () => {
  const [mentors, setMentors] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchMentors = async (pageNum) => {
    setLoading(true);
    try {
      // Simulate API call - replace with your actual API endpoint
      setTimeout(() => {
        // Mock data - in reality, fetch from your API filtering by type=3
        const mockMentors = [
          // Your initial mentors plus more
          {
            id: 1,
            name: "Vedansh Dubey",
            title: "Assistant Manager HR @Wipro | MBA @XIMB, Ex-TCS, Nestlé, Tata Media | ...",
            rating: 4.9,
            image: "/professional-man-in-suit-smiling.jpg",
            type: 3
          },
          {
            id: 2,
            name: "Rutwik Borkar",
            title: "Flipkart | Bain & Co.| Gold Medalist, IIT Madras | XLRI Jamshedpur-BM' 24 | ...",
            rating: 4.9,
            image: "/professional-businessman.png",
            type: 3
          },
          // Add more mock mentors with type=3
          {
            id: 5,
            name: "Alex Johnson",
            title: "Senior Product Manager @Google | Ex-Microsoft | Tech Lead",
            rating: 4.8,
            image: "/professional-man-smiling.jpg",
            type: 3
          },
          {
            id: 6,
            name: "Sarah Williams",
            title: "Data Scientist @Amazon | Machine Learning Expert | PhD in CS",
            rating: 4.9,
            image: "/professional-woman-smiling.jpg",
            type: 3
          },
          // Add more as needed
        ];
        
        if (pageNum === 1) {
          setMentors(mockMentors);
        } else {
          setMentors(prev => [...prev, ...mockMentors]);
        }
        
        // For demo purposes, we'll stop after 2 pages
        setHasMore(pageNum < 2);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setLoading(false);
    }
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
      <Head>
        <title>All Top Mentors</title>
      </Head>
      
      <div className="container mx-auto px-4">
        <button 
          onClick={() => router.back()}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
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

const MentorCard = ({ mentor }) => {
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
            src={mentor.image || "/placeholder.svg"}
            alt={mentor.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mb-2 flex items-center justify-center gap-1">
          <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-semibold text-gray-900">{mentor.rating}</span>
        </div>

        <div className="space-y-2 text-center">
          <h4 className="font-semibold text-gray-900">{mentor.name}</h4>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{mentor.title}</p>
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
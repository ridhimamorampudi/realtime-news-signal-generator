
// "use client";

// import { useEffect, useState } from "react";

// export default function Home() {
//   const [signals, setSignals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdated, setLastUpdated] = useState("");

//   async function fetchSignals() {
//     try {
//       const res = await fetch("http://localhost:8000/fetch-signals");
//       const data = await res.json();
//       setSignals(data.signals || []);
//       setLastUpdated(new Date().toLocaleTimeString());
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching signals:", error);
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchSignals();
//     const interval = setInterval(fetchSignals, 60000); // refresh every 60 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const getSourceStyle = (source) => {
//     switch (source.toLowerCase()) {
//       case "nyt":
//         return "bg-blue-100 text-blue-800";
//       case "yahoo":
//         return "bg-purple-100 text-purple-800";
//       case "sec":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-200 text-gray-700";
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">🚨 Real-Time News Signals</h1>

//       <div className="text-center text-sm text-gray-500 mb-6">
//         {loading ? "Loading signals..." : `Last updated: ${lastUpdated}`}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {signals.length === 0 && !loading && (
//           <div className="text-center text-gray-400">No market-moving signals found.</div>
//         )}

//         {signals.map((signal, index) => (
//           <div
//             key={index}
//             className="bg-white hover:shadow-lg transition-shadow p-6 rounded-xl border border-gray-200"
//           >
//             {/* Source badge */}
//             <div
//               className={`inline-block mb-4 px-3 py-1 text-xs font-medium rounded-full ${getSourceStyle(signal.source)}`}
//             >
//               {signal.source.toUpperCase()}
//             </div>

//             {/* Title */}
//             <h2 className="text-lg font-semibold mb-2 text-gray-900">
//               {signal.title}
//             </h2>

//             {/* Detected Events */}
//             <p className="text-sm text-gray-500 mb-3">
//               <span className="font-semibold">Events:</span> {signal.detected_events.join(", ")}
//             </p>

//             {/* Link */}
//             <a
//               href={signal.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 hover:underline text-sm font-semibold"
//             >
//               View Full Article →
//             </a>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }

"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  async function fetchSignals() {
    try {
      const res = await fetch("http://localhost:8000/fetch-signals");
      const data = await res.json();
      setSignals(data.signals || []);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching signals:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 60000); // refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const getSourceStyle = (source) => {
    switch (source.toLowerCase()) {
      case "nyt":
        return "bg-blue-100 text-blue-800";
      case "yahoo":
        return "bg-purple-100 text-purple-800";
      case "sec":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Market Intelligence Dashboard</h1>
            <p className="text-slate-500 mt-1">Real-time signals from trusted financial sources</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 gap-3">
            <div className="text-sm text-slate-500 flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${loading ? "bg-green-500 animate-pulse" : "bg-slate-400"}`}></div>
              {loading ? "Updating..." : `Last updated: ${lastUpdated}`}
            </div>
            <button 
              onClick={fetchSignals}
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 shadow p-6 animate-pulse">
                <div className="h-4 w-16 bg-slate-200 rounded mb-4"></div>
                <div className="h-6 w-full bg-slate-200 rounded mb-4"></div>
                <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {signals.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-slate-200 shadow">
                <svg className="w-12 h-12 text-slate-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-500 text-lg font-medium">No market-moving signals detected</p>
                <p className="text-slate-400 text-sm mt-2">Check back later for updates</p>
              </div>
            ) : (
              /* Signal Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {signals.map((signal, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-slate-200 shadow hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${getSourceStyle(signal.source)}`}>
                        {signal.source.toUpperCase()}
                      </div>
                    </div>
                    
                    <h2 className="text-lg font-semibold mb-3 text-slate-800">
                      {signal.title}
                    </h2>
                    
                    <div className="text-sm text-slate-600 mb-4">
                      <span className="font-medium">Detected Events:</span>{" "}
                      {signal.detected_events.join(", ")}
                    </div>
                    
                    <a
                      href={signal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Full Article
                      <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
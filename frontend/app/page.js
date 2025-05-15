"use client";

import { useEffect, useState } from "react";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


export default function Home() {
  useAuthRedirect();
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

const handleLogout = async () => {
  try {
    await signOut(auth);
    toast.success("Logged out successfully");
    router.push("/login");
  } catch (error) {
    toast.error("Failed to logout");
  }
};


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
    <main className="min-h-screen bg-[#0A0F1C] text-white">
      {/* Header Section with Gradient Border */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-12 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                <div className="pb-1">
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight leading-[1.2]">
                    Market Intelligence
                  </h1>
                  <p className="text-slate-400 text-lg font-light tracking-wide mt-3">Real-time trading signals from financial sources</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center mt-8 md:mt-0 gap-4">
              <div className="text-sm text-slate-300 flex items-center bg-[#1A1F2E] px-5 py-3 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                <div className={`w-2 h-2 rounded-full mr-3 ${loading ? "bg-blue-500 animate-pulse" : "bg-slate-600"}`}></div>
                {loading ? "Updating..." : `Last updated: ${lastUpdated}`}
              </div>
              <button
                onClick={fetchSignals}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-7 py-3 rounded-2xl text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
              >
                <svg className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Refresh
              </button>
              {user && (
                <div className="flex flex-col items-end text-right bg-[#1A1F2E] px-6 py-3 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                  <p className="text-sm text-slate-300">
                    Welcome, <span className="font-medium text-blue-400">{user.email}</span>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 text-sm font-medium mt-1 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-[#1A1F2E] rounded-3xl border border-slate-800/50 p-8 animate-pulse">
                <div className="h-5 w-32 bg-slate-800/50 rounded-full mb-8"></div>
                <div className="h-7 w-full bg-slate-800/50 rounded-xl mb-6"></div>
                <div className="h-4 w-full bg-slate-800/50 rounded-xl mb-3"></div>
                <div className="h-4 w-3/4 bg-slate-800/50 rounded-xl mb-8"></div>
                <div className="h-4 w-40 bg-slate-800/50 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-24 bg-[#1A1F2E] rounded-3xl border border-slate-800/50">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl flex items-center justify-center mb-10">
              <svg className="w-16 h-16 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-semibold text-white mb-4">No market-moving signals detected</p>
            <p className="text-slate-400 text-xl">Check back later for updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {signals.map((signal, index) => (
              <div
                key={index}
                className="bg-[#1A1F2E] hover:bg-[#1F2433] transition-all duration-300 p-8 rounded-3xl border border-slate-800/50 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Source badge */}
                <div
                  className={`inline-block mb-8 px-5 py-2 text-xs font-semibold rounded-full ${
                    signal.source.toLowerCase() === "nyt" 
                      ? "bg-blue-500/10 text-blue-400" 
                      : signal.source.toLowerCase() === "yahoo"
                      ? "bg-purple-500/10 text-purple-400"
                      : signal.source.toLowerCase() === "sec"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-slate-500/10 text-slate-400"
                  }`}
                >
                  {signal.source.toUpperCase()}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold mb-6 text-white group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                  {signal.title}
                </h2>

                {/* Content Container */}
                <div className="space-y-4 mb-8">
                  {/* Ticker */}
                  {signal.ticker && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">Ticker:</span>
                      <span className="text-slate-300 text-sm font-medium">{signal.ticker}</span>
                    </div>
                  )}

                  {/* Events */}
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 text-sm">Events:</span>
                    <span className="text-slate-300 text-sm font-medium">{signal.detected_events.join(", ")}</span>
                  </div>

                  {/* Suggested Action */}
                  {signal.suggestion && (
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 text-sm">Suggestion:</span>
                      <span className="text-slate-300 text-sm font-medium">{signal.suggestion}</span>
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="flex flex-col gap-4">
                  {signal.link && (
                    <a
                      href={signal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center transition-colors group/link relative z-20"
                    >
                      <span className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 group-hover/link:bg-blue-500/20 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </span>
                      <span className="relative z-20">View Full Article</span>
                    </a>
                  )}
                  {signal.ticker && (
                    <a
                      href={`https://finance.yahoo.com/quote/${signal.ticker}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center transition-colors group/link relative z-20"
                    >
                      <span className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mr-4 group-hover/link:bg-purple-500/20 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      </span>
                      <span className="relative z-20">View {signal.ticker} Chart</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

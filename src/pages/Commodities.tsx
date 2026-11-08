'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';

const CATEGORIES = ['All', 'Cereals', 'Vegetables', 'Meat & Poultry', 'Fish', 'Spices & Extras'];

export default function Commodities() {
  const [commodities, setCommodities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeTrend, setActiveTrend] = useState<any | null>(null);
  const [trendLoading, setTrendLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCommodities() {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/analytics/overview');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }

        const result = await response.json();
        const rawRows = result.data || [];

        const groupedMap = new Map();

        rawRows.forEach((row: any) => {
          if (!groupedMap.has(row.id)) {
            groupedMap.set(row.id, {
              id: row.id,
              name: row.name,
              category: row.category || 'Cereals',
              specification: row.specification,
              unit: row.unit,
              market_location: row.market,
              currentPrice: null,
              previousPrice: null,
            });
          }

          const item = groupedMap.get(row.id);
          if (row.rn === 1) {
            item.currentPrice = Number(row.price);
            item.period_of = row.period_of;
          } else if (row.rn === 2) {
            item.previousPrice = Number(row.price);
          }
        });

        const processedItems = Array.from(groupedMap.values()).map(item => {
          const current = item.currentPrice || 0;
          const previous = item.previousPrice || current;
          
          let movement = 0;
          if (previous > 0) {
            movement = Number((((current - previous) / previous) * 100).toFixed(1));
          }

          return { ...item, movement };
        });

        setCommodities(processedItems);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCommodities();
  }, []);

  async function openTrendModal(id: number) {
    try {
      setTrendLoading(true);
      setActiveTrend({ name: 'Loading...' });
      
      const res = await fetch(`http://localhost:3000/api/analytics/trend/${id}`);
      const json = await res.json();
      
      if (json.success) {
        setActiveTrend(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch trend data', err);
    } finally {
      setTrendLoading(false);
    }
  }

  const filteredCommodities = commodities.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-12 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="mt-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">InPlate Commodity Dashboard</h1>
            <p className="text-slate-500 mt-1 italic">Track real-time market prices, weekly inflation trends, and regional costs.</p>
          </div> 
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(category => (
                <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                    ? 'bg-green-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
                >
                {category}
                </button>
            ))}
            </div>
            <div className="w-full lg:w-72">
                <input
                type="text"
                placeholder="Search food item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-900 text-sm"
                />
            </div>
        </div>

        {loading && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-medium animate-pulse">Loading live market data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 bg-red-50 text-red-900 rounded-xl border border-red-200">
            <p className="font-semibold">Connection Error</p>
            <p className="text-sm mt-1 px-3">{error}. Server Error</p>
          </div>
        )}

        {!loading && !error && filteredCommodities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-400 font-medium">No commodities found matching your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCommodities.map(item => {
              const movement = item.movement ?? 0;
              const isInflationary = movement > 0;
              const isNeutral = movement === 0;

              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
                        {item.category}
                      </span>
                      
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        isNeutral 
                          ? 'bg-slate-100 text-slate-600' 
                          : isInflationary 
                            ? 'bg-red-50 text-red-600' 
                            : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {isNeutral ? '• 0.0%' : isInflationary ? `↑ +${movement}%` : `↓ ${movement}%`}
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-800 text-lg leading-snug mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">{item.market_location || 'Metro Manila (NCR)'}</p>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-2xl font-bold text-slate-900">₱{Number(item.currentPrice).toFixed(2)}</span>
                        <span className="text-xs text-slate-500 ml-1">/ {item.unit}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => openTrendModal(item.id)}
                        className="w-full py-2 px-1 text-xs font-medium text-white bg-green-700 hover:bg-white hover:text-green-700 border border-green-700 rounded-lg transition-colors text-center"
                      >
                        View Trend
                      </button> 
                      
                      <div className="w-full py-2 px-1 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg text-center flex flex-col justify-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Prev Price</span>
                        <span className="font-semibold text-slate-800">
                          {item.previousPrice ? `₱${item.previousPrice.toFixed(2)}` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {activeTrend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 rounded-full">
                  {activeTrend.category || 'Commodity Trend'}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">{activeTrend.name}</h2>
                <p className="text-xs text-slate-500">Historical price movement per tracking period ({activeTrend.unit})</p>
              </div>
              <button 
                onClick={() => setActiveTrend(null)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {trendLoading ? (
              <div className="py-16 text-center text-slate-400 animate-pulse">Loading trend analysis...</div>
            ) : activeTrend.data && activeTrend.data.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="h-48 w-full flex items-end gap-3 pt-6 px-2">
                    {activeTrend.data.map((pt: any, idx: number) => {
                      const prices = activeTrend.data.map((d: any) => d.price);
                      const maxPrice = Math.max(...prices, 1);
                      const minPrice = Math.min(...prices, 0);
                      const range = maxPrice - minPrice || 1;
                      const heightPercent = Math.max(
                        15,
                        Math.round(((pt.price - minPrice) / range) * 100)
                      );

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                          <div className="absolute -top-10 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
                            ₱{pt.price.toFixed(2)} ({pt.period_of})
                          </div>
                          
                          <span className="text-[10px] font-bold text-slate-600 mb-1">₱{pt.price}</span>
                          <div 
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-green-600 rounded-t group-hover:bg-green-500 transition-all"
                          ></div>
                          <span className="text-[9px] text-slate-400 mt-2 truncate w-full text-center">
                            {pt.period_of.split(' - ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase">
                      <tr>
                        <th className="p-3">Monitoring Period</th>
                        <th className="p-3 text-right">Recorded Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeTrend.data.map((log: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 text-slate-700 font-medium">{log.period_of}</td>
                          <td className="p-3 text-right font-bold text-slate-900">₱{log.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">No historical data points found.</div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveTrend(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
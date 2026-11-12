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
          const rowNum = Number(row.rn || row.ROW_NUM || 1);

          if (!groupedMap.has(row.id)) {
            groupedMap.set(row.id, {
              id: row.id,
              name: row.name,
              category: row.category === 'Fish' ? 'Fish' : (row.category || 'Cereals'),
              specification: row.specification,
              unit: row.unit,
              market_location: row.market,
              currentPrice: null,
              previousPrice: null,
            });
          }

          const item = groupedMap.get(row.id);
          if (rowNum === 1) {
            item.currentPrice = Number(row.price);
            item.period_of = row.period_of;
          } else if (rowNum === 2) {
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
                      <span className="px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-green-900 rounded-full">
                        {item.category}
                      </span>
                      
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        isNeutral 
                          ? 'bg-slate-100 text-slate-600' 
                          : isInflationary 
                            ? 'bg-white text-red-600' 
                            : 'bg-white text-emerald-600'
                      }`}>
                        {isNeutral ? '• 0.0%' : isInflationary ? `↑ +${movement}%` : `↓ ${movement}%`}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-xl leading-snug mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4 italic">{item.market_location || 'Metro Manila (NCR)'}</p>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-3xl font-bold text-slate-900">₱{Number(item.currentPrice).toFixed(2)}</span>
                        <span className="text-sm text-slate-500 ml-1">/ {item.unit}</span>
                      </div>
                    </div>

                    <div className="">
                      <button 
                        onClick={() => openTrendModal(item.id)}
                        className="w-full py-2 px-1 text-xs font-medium text-white bg-green-900 hover:bg-white hover:text-green-900 border border-green-900 rounded-lg transition-colors text-center"
                      >
                        View Trend
                      </button> 
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {activeTrend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-green-900 tracking-wider uppercase">
                  {activeTrend.category || 'Trend Analysis'}
                </span>
                <h2 className="text-xl font-bold text-slate-900">{activeTrend.name}</h2>
              </div>
              <button 
                onClick={() => setActiveTrend(null)}
                className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            {trendLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading trend analysis...</div>
            ) : activeTrend.data && activeTrend.data.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-center items-center">
                  <div className="w-full flex justify-between items-center mb-4">
                    <span className="text-xs font-medium text-slate-500">Price trajectory over time</span>
                    <span className="text-xs text-slate-400">Unit: {activeTrend.unit}</span>
                  </div>

                  <div className="relative h-44 w-full pt-2 flex items-center justify-center">
                    {(() => {
                      const prices = activeTrend.data.map((d: any) => d.price);
                      const maxPrice = Math.max(...prices, 1);
                      const minPrice = Math.min(...prices, 0);
                      const range = maxPrice - minPrice || 1;

                      const width = 500;
                      const height = 140;
                      const points = activeTrend.data.map((pt: any, idx: number) => {
                        const x = (idx / (activeTrend.data.length - 1 || 1)) * width;
                        const y = height - ((pt.price - minPrice) / range) * (height - 20) - 10;
                        return { x, y, ...pt };
                      });

                      const pointsString = points.map((p: any) => `${p.x},${p.y}`).join(' ');
                      const latestPoint = points[points.length - 1];

                      return (
                        <div className="relative w-full h-full flex flex-col justify-center items-center">
                          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible">
                            <line x1="0" y1={height} x2={width} y2={height} stroke="#e2e8f0" strokeWidth="1" />

                            <polyline
                              fill="none"
                              stroke="#065f46"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={pointsString}
                            />

                            {points.map((p: any, idx: number) => {
                              const isLatest = idx === points.length - 1;
                              return (
                                <g key={idx} className="group cursor-pointer">
                                  <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={isLatest ? "5" : "4"}
                                    className={`${isLatest ? 'fill-green-700 stroke-white' : 'fill-white stroke-green-900'} stroke-2 transition-transform duration-150 group-hover:scale-125`}
                                  />
                                </g>
                              );
                            })}
                          </svg>

                          {latestPoint && (
                            <div 
                              className="absolute -top-3 bg-green-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 pointer-events-none transform -translate-x-1/2"
                              style={{ 
                                left: `${(latestPoint.x / width) * 100}%`,
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                              Latest: ₱{latestPoint.price.toFixed(2)}
                            </div>
                          )}

                          <div className="w-full flex justify-between items-center text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                            {activeTrend.data.map((pt: any, idx: number) => (
                              <span key={idx} className="truncate text-center">
                                {pt.period_of.split(' - ')[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="border border-slate-200 rounded-sm overflow-hidden mb-5">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-black uppercase">
                      <tr>
                        <th className="p-3">Monitoring Period</th>
                        <th className="p-3 text-right">Recorded Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeTrend.data.map((log: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-3 text-green-900 font-medium"><p className="border border-green-900/20 w-fit mr-auto px-2 py-1 rounded-full">₱{log.period_of}</p></td>
                          <td className="p-3 text-right font-bold text-green-900">
                            <p className="border border-green-900/20 w-fit ml-auto px-2 py-1 rounded-full">₱{log.price.toFixed(2)}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">No historical data found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
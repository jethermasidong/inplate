import { Header } from "../components/Header";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      
      <div className="relative mx-4 my-4 md:mx-6 md:my-6 rounded-3xl shadow-2xl shadow-slate-300/50 border border-slate-200/80 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-b from-white via-white/40 to-transparent z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="relative z-20 p-6 md:p-8">
          <Header />
          <section
              id="home"
              className="px-6 pt-12 pb-24 md:pt-20 md:pb-32 lg:pt-24 lg:pb-36 flex flex-col items-center"
              >
              <div className="max-w-4xl mx-auto text-center space-y-5 md:space-y-6">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black leading-tight">
                    Behind every price hike is a trend.{" "}
                  <span className="text-green-900 bg-clip-text border-2 border-green-900 rounded-full px-3">
                    Spot it.
                  </span>
                  </h1>
                  <p className="text-lg md:text-xl px-6 w-fit text-white max-w-2xl mx-auto italic bg-green-900 shadow-sm transition-all">
                    InPlate tracks Philippine commodity prices and inflation so you
                  </p>
                  <p className="text-lg md:text-xl px-6 -mt-5 w-fit text-white max-w-2xl mx-auto italic bg-green-900 shadow-sm transition-all">
                    can see what’s rising, where, and how fast.
                  </p>
              </div>
          </section>
        </div>
      </div>

      <div className="relative mx-4 my-4 md:mx-6 md:my-6 rounded-3xl shadow-2xl shadow-slate-300/50 border border-black/20 overflow-hidden">
        <section id="#about" className="px-6 py-24 md:py-32 bg-green-900/10 backdrop-blur-md border-y border-slate-200/60">
          <div className="max-w-4xl mx-auto space-y-9">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl -mt-15 font-extrabold tracking-tight text-black leading-tight transition-all">
                ABOUT INPLATE
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="group space-y-3 border-t border-green-900">
                <h3 className="text-lg font-medium text-green-900 tracking-tight mt-4">Price Hikes & Inflation</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light hover:text-gray-900">
                  Philippine inflation is driven by typhoon crop damage, transport costs, and supply shocks in staples like rice and pork, directly raising everyday market expenses.
                </p>
              </div>

              <div className="group space-y-3 border-t border-green-900">
                <h3 className="text-lg font-medium text-green-900 tracking-tight mt-4">AI-Powered Extraction</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light hover:text-gray-900">
                  In InPlate, Gemini automatically extracts messy agricultural pricing from government PDFs into clean records for PostgreSQL.
                </p>
              </div>

              <div className="group space-y-3 border-t border-green-900">
                <h3 className="text-lg font-medium text-green-900 tracking-tight mt-4">Data Analytics</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light hover:text-gray-900">
                  In InPlate, analytics power interactive charts that track market volatility, price shifts, and inflation trends.
                </p>
              </div>
            </div>

          </div>
        </section>

        <section id="#information" className="px-6 py-20 md:py-18">
          <div className="max-w-3xl mx-auto bg-linear-to-r rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-black/20 border border-green-900 relative overflow-hidden space-y-6">
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <h2 className="text-2xl md:text-4xl text-green-900 font-extrabold tracking-tight uppercase">
              Need More Info? <br /> About this project.
            </h2>
            <p className="text-black/50 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Ask some questions, or contribute in this project?
            </p>
            <div className="pt-2">
              <button className="px-6 py-3 text-base font-semibold text-black bg-white hover:bg-emerald-50 hover:text-green-900 border border-gray-300 rounded-xl shadow-lg transition-all active:scale-95 leading-relaxed">
                Connect with Dev
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
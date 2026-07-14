import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  UserCheck, 
  TrendingUp,
  Sprout,
  CircleDollarSign,
  ArrowRightLeft,
  FileCheck,
  PhoneCall,
  Truck
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden pt-[70px]">
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-28 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-left z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 rounded-full px-4 py-1.5 text-sm text-emerald-400 font-medium">
            <Sparkles size={16} />
            <span>AgriLink Direct Trade Platform</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-300 to-green-200">
            Direct Trade.<br />
            Fair Price.<br />
            Zero Middlemen.
          </h1>

          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            AgriLink bridges the gap between farmers and buyers. Experience transparent crop negotiation, dynamic tracking timelines, and secure double-verification transaction systems.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition duration-300 cursor-pointer"
                >
                  <span>Browse Crops</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold px-8 py-4 rounded-xl hover:-translate-y-0.5 transition duration-300 cursor-pointer"
                >
                  Log In
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition duration-300 cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-900 max-w-lg">
            <div>
              <p className="text-3xl font-bold text-slate-100">0%</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Broker Fees</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-100">100%</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Direct Trade</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-100">Verified</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Negotiations</p>
            </div>
          </div>
        </div>

        {/* Hero Illustration Block */}
        <div className="flex-1 w-full lg:w-auto relative z-10">
          <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative backdrop-blur-xl">
            {/* Window Header */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-850 pb-4">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500/70" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/70" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-500/70" />
              <span className="text-xs font-semibold text-slate-500 ml-4 font-mono">agrilink_deal_flow.exe</span>
            </div>

            {/* Simulated Live UI Preview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="font-semibold text-slate-200">Fresh Organic Potatoes</h3>
                  <p className="text-xs text-slate-500">1,200 kg Listing • Bihar, India</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">
                    Active Negotiation
                  </span>
                  <p className="text-sm font-bold text-slate-300 mt-1">$0.85/kg</p>
                </div>
              </div>

              {/* Negotiation Logs */}
              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-teal-400 uppercase tracking-wider text-[10px]">Negotiation Log</span>
                  <span className="text-slate-500">Direct Message</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-xl border-l-2 border-emerald-500 text-slate-300">
                    <p className="font-semibold text-emerald-400 mb-0.5">Buyer Offer:</p>
                    <p>"Hi, I can offer $0.75/kg for the entire batch. Fast delivery requested."</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border-l-2 border-teal-500 text-slate-300">
                    <p className="font-semibold text-teal-400 mb-0.5">Farmer Counter-Offer:</p>
                    <p>"Let's meet at $0.80/kg. I can arrange logistics directly."</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center text-xs text-slate-500 pt-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Verified End-to-End Deal Negotiation Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose AgriLink */}
      <section className="px-6 py-20 bg-slate-900/30 border-y border-slate-900 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">Why Choose AgriLink</h2>
            <p className="text-3xl lg:text-5xl font-extrabold text-slate-100 tracking-tight font-sans">
              Why Farmers & Buyers Choose AgriLink
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We empower agricultural trade with modern deal cycles, transparent verification locks, and direct farmer-to-buyer interaction.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard 
              icon={<ArrowRightLeft className="text-emerald-400" size={24} />}
              title="Smart Negotiation"
              description="Make custom bids, send messages, and bargain prices via counter-offers directly on crop listings."
            />
            <FeatureCard 
              icon={<Coins className="text-emerald-400" size={24} />}
              title="Fair Pricing"
              description="Eliminate middlemen markup. Farmers set their target rates, and buyers negotiate transparently."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-400" size={24} />}
              title="Secure Contact Sharing"
              description="Mobile numbers are shielded and only shared once the farmer explicitly approves contact requests."
            />
            <FeatureCard 
              icon={<TrendingUp className="text-emerald-400" size={24} />}
              title="Deal Tracking"
              description="Track your active negotiations and deals transparently through a real-time progress timeline."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">Workflow</h2>
          <p className="text-3xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            How It Works
          </p>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            AgriLink simplifies agricultural trade in six simple steps, moving from crop discovery to offline delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
          
          <StepCard 
            step="1"
            icon={<Sprout className="text-emerald-400" size={24} />}
            title="List Crop"
            description="Farmers list crops with details, photos, and standard price guidelines."
          />
          
          <StepCard 
            step="2"
            icon={<CircleDollarSign className="text-emerald-400" size={24} />}
            title="Make Offer"
            description="Buyers browse listings and submit initial offers with custom messages."
          />
          
          <StepCard 
            step="3"
            icon={<ArrowRightLeft className="text-emerald-400" size={24} />}
            title="Negotiate"
            description="Both parties trade proposals back-and-forth until a price is settled."
          />
          
          <StepCard 
            step="4"
            icon={<FileCheck className="text-emerald-400" size={24} />}
            title="Accept Deal"
            description="Farmer or buyer accepts the active offer to establish agreement terms."
          />
          
          <StepCard 
            step="5"
            icon={<PhoneCall className="text-emerald-400" size={24} />}
            title="Contact Approval"
            description="Both parties request and approve mobile details for safe communication."
          />
          
          <StepCard 
            step="6"
            icon={<Truck className="text-emerald-400" size={24} />}
            title="Offline Transaction"
            description="Crops are delivered, verified, and complete offline payment takes place."
          />

        </div>
      </section>

      {/* Call To Action */}
      <section className="px-6 py-20 text-center relative max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/10 rounded-3xl p-10 space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-100">Ready to Start Trading?</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Join AgriLink today and connect directly with trusted farmers and buyers.
          </p>
          <div className="flex justify-center gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3 rounded-xl cursor-pointer hover:-translate-y-0.5 transition duration-300"
                >
                  Register
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 text-sm px-6 py-3 rounded-xl cursor-pointer hover:-translate-y-0.5 transition duration-300"
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3 rounded-xl cursor-pointer hover:-translate-y-0.5 transition duration-300"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

// FeatureCard Sub-Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="group bg-slate-900/50 hover:bg-slate-900/90 border border-slate-850 hover:border-slate-800 p-6 rounded-2xl space-y-4 hover:-translate-y-1 transition-all duration-300 shadow-md">
    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
      {title}
    </h3>
    <p className="text-xs text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);

// StepCard Sub-Component
const StepCard = ({ step, icon, title, description }) => (
  <div className="relative bg-slate-950 border border-slate-900 hover:border-emerald-500/30 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-emerald-950/20 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/10">
        {icon}
      </div>
      <span className="text-2xl font-black text-slate-800/80 font-mono">
        0{step}
      </span>
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-slate-200">{title}</h4>
      <p className="text-[11px] text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default LandingPage;

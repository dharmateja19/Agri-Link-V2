import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Coins,
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
    <div className="bg-[#F8FAF5] text-[#475569] min-h-screen font-sans selection:bg-[#16A34A] selection:text-white overflow-x-hidden pt-[70px]">

      {/* Hero Section */}
      <section className="relative px-6 py-16 lg:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#CA8A04]/10 border border-[#CA8A04]/20 rounded-full px-3 py-1 text-xs text-[#CA8A04] font-semibold">
            <span>Direct Agricultural Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Direct Trade.<br />
            Fair Price.<br />
            Zero Middlemen.
          </h1>

          <p className="text-base text-slate-650 max-w-xl leading-relaxed">
            AgriLink bridges the gap between farmers and buyers. Experience transparent crop negotiation, dynamic tracking timelines, and secure direct-to-buyer transaction systems.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="group flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <span>Browse Crops</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white hover:bg-[#EEF7EA]/50 border border-[#65A30D] text-[#65A30D] font-semibold px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  Log In
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="group flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 max-w-lg">
            <div>
              <p className="text-2xl font-bold text-slate-900">0%</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Broker Fees</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Direct Trade</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">Secure</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Negotiations</p>
            </div>
          </div>
        </div>

        {/* Hero UI Preview Block */}
        <div className="flex-1 w-full lg:w-auto relative z-10">
          <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">

            {/* Simulated Live UI Preview */}
            {/* Hero Preview Card */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 max-w-md mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">Crop Listing</h3>
                    <p className="text-xs text-slate-500">
                      Direct Farmer Marketplace
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    Negotiating
                  </span>
                </div>

                {/* Crop */}
                <div className="mt-5 space-y-4">

                  <div className="bg-[#EEF7EA] rounded-xl p-4">
                    <h2 className="text-lg font-bold text-slate-900">
                      🥔 Fresh Organic Potatoes
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      📍 AP, India
                    </p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">

                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Quantity</p>
                      <p className="font-semibold text-slate-900">
                        1,200 kg
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Listed Price</p>
                      <p className="font-semibold text-slate-900">
                        ₹35/kg
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Current Offer</p>
                      <p className="font-semibold text-green-700">
                        ₹33/kg
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Buyer</p>
                      <p className="font-semibold text-slate-900">
                        FreshMart
                      </p>
                    </div>

                  </div>

                  {/* Latest Activity */}
                  <div className="border rounded-xl p-4 space-y-3">

                    <h4 className="text-sm font-semibold text-slate-800">
                      Latest Activity
                    </h4>

                    <div className="flex justify-between text-sm">
                      <span>Buyer offered</span>
                      <span className="font-semibold text-green-700">
                        ₹33/kg
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Farmer countered</span>
                      <span className="font-semibold text-amber-600">
                        ₹34/kg
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose AgriLink */}
      <section className="px-6 py-20 bg-[#EEF7EA] border-y border-slate-200 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-semibold text-[#16A34A] uppercase tracking-widest">Why Choose AgriLink</h2>
            <p className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Why Farmers & Buyers Choose AgriLink
            </p>
            <p className="text-[#475569] max-w-xl mx-auto text-sm">
              We empower agricultural trade with modern deal cycles, transparent verification locks, and direct farmer-to-buyer interaction.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<ArrowRightLeft className="text-[#16A34A]" size={24} />}
              title="Smart Negotiation"
              description="Make custom bids, send messages, and bargain prices via counter-offers directly on crop listings."
            />
            <FeatureCard
              icon={<Coins className="text-[#16A34A]" size={24} />}
              title="Fair Pricing"
              description="Eliminate middlemen markup. Farmers set their target rates, and buyers negotiate rates directly."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-[#16A34A]" size={24} />}
              title="Secure Contact Sharing"
              description="Mobile numbers are shielded and only shared once the farmer explicitly approves contact requests."
            />
            <FeatureCard
              icon={<TrendingUp className="text-[#16A34A]" size={24} />}
              title="Deal Tracking"
              description="Track your active negotiations and deals transparently through a real-time progress timeline."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-semibold text-[#16A34A] uppercase tracking-widest">Workflow</h2>
          <p className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            How It Works
          </p>
          <p className="text-[#475569] max-w-xl mx-auto text-sm">
            AgriLink simplifies agricultural trade in six simple steps, moving from crop discovery to offline delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
          <StepCard
            step="1"
            icon={<Sprout className="text-[#16A34A]" size={24} />}
            title="Farmer Lists Crop"
            description="Farmers list crops with details, photos, and standard price guidelines."
          />
          <StepCard
            step="2"
            icon={<CircleDollarSign className="text-[#16A34A]" size={24} />}
            title="Buyer Makes Offer"
            description="Buyers browse listings and submit initial offers with custom messages."
          />
          <StepCard
            step="3"
            icon={<ArrowRightLeft className="text-[#16A34A]" size={24} />}
            title="Negotiate"
            description="Both parties trade proposals back-and-forth until a price is settled."
          />
          <StepCard
            step="4"
            icon={<FileCheck className="text-[#16A34A]" size={24} />}
            title="Deal Accepted"
            description="Farmer or buyer accepts the active offer to establish agreement terms."
          />
          <StepCard
            step="5"
            icon={<PhoneCall className="text-[#16A34A]" size={24} />}
            title="Contact Approved"
            description="Both parties request and approve mobile details for safe communication."
          />
          <StepCard
            step="6"
            icon={<Truck className="text-[#16A34A]" size={24} />}
            title="Offline Transaction"
            description="Crops are delivered, verified, and complete offline payment takes place."
          />
        </div>
      </section>

      {/* Platform Statistics Section */}
      {/* <section className="px-6 py-20 bg-[#EEF7EA] border-y border-slate-200 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-semibold text-[#16A34A] uppercase tracking-widest">Platform Activity</h2>
            <p className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              AgriLink in Numbers
            </p>
            <p className="text-[#475569] max-w-xl mx-auto text-sm">
              Connecting thousands of agricultural producers and buyers across the nation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            <StatCard value="5,000+" label="Active Listings" description="Fresh crops listed directly by farmers." />
            <StatCard value="12,000+" label="Deals Completed" description="Successful direct transactions completed." />
            <StatCard value="8,500+" label="Verified Users" description="Trusted farmers and registered buyers." />
            <StatCard value="0%" label="Middlemen Fees" description="Absolutely no broker charges or commissions." />
          </div>
        </div>
      </section> */}

      {/* Call To Action */}
      <section className="px-6 py-16 text-center max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 space-y-6 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Ready to Start Trading?</h2>
          <p className="text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
            Join AgriLink today and connect directly with trusted farmers and buyers.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm px-6 py-3 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Register
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white border border-[#65A30D] text-[#65A30D] hover:bg-[#EEF7EA]/50 font-semibold text-sm px-6 py-3 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm px-6 py-3 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
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
  <div className="group bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
    <div className="w-10 h-10 bg-[#EEF7EA] text-[#16A34A] rounded-xl flex items-center justify-center border border-[#16A34A]/10">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900">
      {title}
    </h3>
    <p className="text-xs text-[#475569] leading-relaxed">
      {description}
    </p>
  </div>
);

// StepCard Sub-Component
const StepCard = ({ step, icon, title, description }) => (
  <div className="relative bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 bg-[#EEF7EA] text-[#16A34A] rounded-xl flex items-center justify-center border border-[#16A34A]/10">
        {icon}
      </div>
      <span className="text-xl font-bold text-slate-350 font-mono">
        0{step}
      </span>
    </div>
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      <p className="text-[11px] text-[#475569] leading-relaxed">{description}</p>
    </div>
  </div>
);

// StatCard Sub-Component
const StatCard = ({ value, label, description }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-2 shadow-sm">
    <p className="text-3xl font-extrabold text-[#16A34A]">{value}</p>
    <p className="text-sm font-bold text-slate-900">{label}</p>
    <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;

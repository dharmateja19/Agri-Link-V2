import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, crops, deals

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    axios.get(`${apiurl}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data.users || []));
    axios.get(`${apiurl}/crops`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProducts(res.data.crops || []));
    axios.get(`${apiurl}/deals`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDeals(res.data.deals || []));
    axios.get(`${apiurl}/contact`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setContactRequests(res.data.requests || []));
  }, []);

  const filteredUsers = users.filter(u => u.role !== 'admin');
  const farmersCount = users.filter(u => u.role === 'farmer').length;
  const buyersCount = users.filter(u => u.role === 'buyer').length;

  const completedDealsCount = deals.filter(d => d.status === 'COMPLETED').length;
  const activeNegotiationsCount = deals.filter(d => ['PENDING', 'NEGOTIATING'].includes(d.status)).length;
  const pendingContactsCount = contactRequests.filter(r => r.status === 'pending').length;

  // Deal Analytics breakdown
  const pendingDealsCount = deals.filter(d => d.status === 'PENDING').length;
  const negotiatingDealsCount = deals.filter(d => d.status === 'NEGOTIATING').length;
  const acceptedDealsCount = deals.filter(d => d.status === 'ACCEPTED').length;
  const completionPendingDealsCount = deals.filter(d => d.status === 'COMPLETION_PENDING').length;
  const completedDealsCountPhase2 = deals.filter(d => d.status === 'COMPLETED').length;
  const rejectedDealsCount = deals.filter(d => d.status === 'REJECTED').length;
  const cancelledDealsCount = deals.filter(d => d.status === 'CANCELLED').length;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "NEGOTIATING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "COMPLETION_PENDING":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F8FAF5] pt-24 pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-green-700">Admin Dashboard</h2>

        {/* Tabs */}
        <div className="flex justify-center bg-white p-1.5 rounded-lg border max-w-lg mx-auto shadow-sm">
          {['overview', 'users', 'crops', 'deals'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer capitalize
                ${activeTab === tab ? 'bg-green-75 text-green-800 border border-green-200 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab (Phase 1 & Phase 2) */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Overview Cards (Phase 1) */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Overview Cards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white shadow-sm border border-gray-150 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Users</p>
                  <p className="text-3xl font-black text-gray-800 mt-2">{filteredUsers.length}</p>
                </div>
                <div className="bg-white shadow-sm border border-gray-150 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Farmers</p>
                  <p className="text-3xl font-black text-green-700 mt-2">{farmersCount}</p>
                </div>
                <div className="bg-white shadow-sm border border-gray-150 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Buyers</p>
                  <p className="text-3xl font-black text-blue-700 mt-2">{buyersCount}</p>
                </div>
                <div className="bg-white shadow-sm border border-gray-150 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Crop Listings</p>
                  <p className="text-3xl font-black text-yellow-700 mt-2">{products.length}</p>
                </div>
                <div className="bg-white shadow-sm border border-gray-150 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Deals</p>
                  <p className="text-3xl font-black text-indigo-700 mt-2">{deals.length}</p>
                </div>
                <div className="bg-white shadow-sm border border-gray-150 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Completed Deals</p>
                  <p className="text-3xl font-black text-emerald-700 mt-2">{completedDealsCount}</p>
                </div>
                <div className="bg-white shadow-sm border border-gray-150 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Negotiations</p>
                  <p className="text-3xl font-black text-purple-700 mt-2">{activeNegotiationsCount}</p>
                </div>
                <div className="bg-white shadow-sm border border-gray-150 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pending Contact Requests</p>
                  <p className="text-3xl font-black text-red-700 mt-2">{pendingContactsCount}</p>
                </div>
              </div>
            </div>

            {/* Deal Analytics (Phase 2) */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Deal Analytics</h3>
              <div className="bg-white shadow-sm border border-gray-150 rounded-2xl p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div className="bg-yellow-50/50 border border-yellow-200 rounded-2xl p-4 text-center">
                    <p className="text-xs text-yellow-700 font-bold uppercase tracking-wider">Pending</p>
                    <p className="text-2xl font-black text-yellow-800 mt-1">{pendingDealsCount}</p>
                  </div>
                  <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 text-center">
                    <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Negotiating</p>
                    <p className="text-2xl font-black text-blue-800 mt-1">{negotiatingDealsCount}</p>
                  </div>
                  <div className="bg-green-50/50 border border-green-200 rounded-2xl p-4 text-center">
                    <p className="text-xs text-green-700 font-bold uppercase tracking-wider">Accepted</p>
                    <p className="text-2xl font-black text-green-800 mt-1">{acceptedDealsCount}</p>
                  </div>
                  <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-4 text-center">
                    <p className="text-xs text-purple-700 font-bold uppercase tracking-wider">Completion Pending</p>
                    <p className="text-2xl font-black text-purple-800 mt-1">{completionPendingDealsCount}</p>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 text-center">
                    <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Completed</p>
                    <p className="text-2xl font-black text-emerald-800 mt-1">{completedDealsCountPhase2}</p>
                  </div>
                  <div className="bg-red-50/50 border border-red-200 rounded-2xl p-4 text-center">
                    <p className="text-xs text-red-700 font-bold uppercase tracking-wider">Rejected</p>
                    <p className="text-2xl font-black text-red-800 mt-1">{rejectedDealsCount}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-300 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
                    <p className="text-xs text-gray-700 font-bold uppercase tracking-wider">Cancelled</p>
                    <p className="text-2xl font-black text-gray-800 mt-1">{cancelledDealsCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Users */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            {filteredUsers.map(u => (
              <div key={u._id} className="bg-white p-5 rounded-xl shadow border border-gray-155">
                <h3 className="font-bold text-lg text-gray-800">{u.name}</h3>
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Email:</span> {u.email}</p>
                  <p><span className="font-medium">Mobile:</span> {u.mobile}</p>
                  <p><span className="font-medium">Role:</span> <span className="capitalize font-semibold text-green-700">{u.role}</span></p>
                  <p><span className="font-medium">Location:</span> {u.location || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Crops */}
        {activeTab === 'crops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            {products.map(p => (
              <div key={p._id} className="bg-white p-4 rounded-xl shadow border border-gray-155">
                {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="h-40 w-full object-cover rounded mb-3" />}
                <h3 className="font-bold text-lg text-gray-800">{p.name}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Price:</span> ₹{p.price}/kg</p>
                  <p><span className="font-medium">Quantity:</span> {p.quantity} kg</p>
                  <p><span className="font-medium">Farmer:</span> {p.farmer?.name || 'N/A'}</p>
                  <p><span className="font-medium">Location:</span> {p.farmer?.location || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Deals */}
        {activeTab === 'deals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {deals.map(deal => (
              <div key={deal._id} className="bg-white p-5 rounded-xl shadow border border-gray-155 flex flex-col justify-between">
                <div>
                  {deal.crop?.imageUrl && (
                    <img src={deal.crop.imageUrl} alt={deal.crop.name} className="h-40 w-full object-cover rounded mb-4" />
                  )}
                  <h3 className="font-bold text-xl text-gray-800">{deal.crop?.name || 'N/A'}</h3>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Farmer:</span> {deal.farmer?.name || 'N/A'}</p>
                    <p><span className="font-medium">Buyer:</span> {deal.buyer?.name || 'N/A'}</p>
                    <p><span className="font-medium">Listed Price:</span> ₹{deal.listedPrice}/kg</p>
                    <p><span className="font-medium">Current Offer:</span> ₹{deal.currentOffer}/kg</p>
                    {deal.agreedPrice && (
                      <p><span className="font-medium">Agreed Price:</span> <span className="font-semibold text-green-700">₹{deal.agreedPrice}/kg</span></p>
                    )}
                    <p><span className="font-medium">Quantity:</span> {deal.quantity} kg</p>
                    <div className="flex items-center pt-2">
                      <span className="font-medium mr-2">Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusBadgeClass(deal.status)}`}>
                        {deal.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

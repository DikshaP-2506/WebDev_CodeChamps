import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users, TrendingUp, Clock, MapPin, CheckCircle, XCircle, Plus, User, Edit, Camera, Mail, Phone, Building, Shield, Star, Calendar, Award, Truck, DollarSign, Menu, Settings, HelpCircle, LogOut } from "lucide-react";

const SupplierDashboard = () => {
  const [activeTab, setActiveTab] = useState("group");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ 
    product: "", 
    quantity: "", 
    location: "", 
    deadline: "", 
    deadlineTime: "" 
  });
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  // Helper function to format deadline for display
  const formatDeadline = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
    } else {
      return "Expired";
    }
  };

  const groupRequests = [
    {
      id: 1,
      product: "Tomatoes",
      quantity: "500 kg",
      vendors: 12,
      location: "Sector 15",
      deadline: "2025-07-28T18:00:00",
      status: "Pending",
      estimatedValue: "₹12,500"
    },
    {
      id: 2,
      product: "Onions", 
      quantity: "300 kg",
      vendors: 8,
      location: "Sector 22",
      deadline: "2025-07-27T15:30:00",
      status: "Pending",
      estimatedValue: "₹5,400"
    }
  ];

  const individualOrders = [
    {
      id: 1,
      vendor: "Rajesh Kumar",
      product: "Mixed Vegetables",
      quantity: "50 kg",
      location: "Sector 18",
      requestedPrice: "₹22/kg",
      status: "New",
      totalValue: "₹1,100"
    }
  ];

  const confirmedOrders = [
    {
      id: 1,
      type: "Group",
      product: "Potatoes",
      quantity: "400 kg",
      vendors: 10,
      deliveryDate: "Today",
      value: "₹8,000",
      status: "Ready to Ship"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-green-600 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Supplier Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                  className="p-2 hover:bg-green-500 rounded-lg text-white"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                {showHamburgerMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button 
                      onClick={() => {
                        setShowProfileEditModal(true);
                        setShowHamburgerMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center">
                      <Settings className="w-4 h-4 mr-3" />
                      Account Settings
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center">
                      <HelpCircle className="w-4 h-4 mr-3" />
                      Help & Support
                    </button>
                    <hr className="my-2" />
                    <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center">
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Orders Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-lg border shadow-sm">
            <TabsTrigger value="group" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Group Requests</TabsTrigger>
            <TabsTrigger value="individual" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Individual Orders</TabsTrigger>
            <TabsTrigger value="confirmed" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Confirmed Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="group" className="space-y-4">
            <div className="bg-blue-500 text-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Group Order Requests</h2>
              <p className="text-blue-100 mb-4">Manage incoming group order requests from vendors</p>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowGroupModal(true)} className="text-white border-white hover:bg-blue-400">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product Group
                </Button>
              </div>
            </div>
            {showGroupModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-semibold mb-4">Create Product Group</h2>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newGroup.product}
                      onChange={e => setNewGroup({ ...newGroup, product: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Quantity (e.g. 500 kg)"
                      value={newGroup.quantity}
                      onChange={e => setNewGroup({ ...newGroup, quantity: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={newGroup.location}
                      onChange={e => setNewGroup({ ...newGroup, location: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Deadline Date (YYYY-MM-DD)"
                      value={newGroup.deadline}
                      onChange={e => setNewGroup({...newGroup, deadline: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                    <input
                      type="time"
                      value={newGroup.deadlineTime}
                      onChange={e => setNewGroup({...newGroup, deadlineTime: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowGroupModal(false)}>Cancel</Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        if (newGroup.product && newGroup.quantity && newGroup.location && newGroup.deadline && newGroup.deadlineTime) {
                          const deadlineDateTime = `${newGroup.deadline}T${newGroup.deadlineTime}`;
                          groupRequests.unshift({
                            id: Date.now(),
                            product: newGroup.product,
                            quantity: newGroup.quantity,
                            vendors: 0,
                            location: newGroup.location,
                            deadline: deadlineDateTime,
                            status: "Pending",
                            estimatedValue: "-"
                          });
                          setShowGroupModal(false);
                          setNewGroup({ product: "", quantity: "", location: "", deadline: "", deadlineTime: "" });
                        }
                      }}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
                  <div className="mb-3">
                    <div className="w-full h-32 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <Package className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">{request.product}</div>
                  <div className="text-gray-600 text-sm">Group order request</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                    <span>{request.vendors} vendors</span>
                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{request.status}</span>
                  </div>
                  <div className="text-blue-600 font-bold text-lg mb-1">{request.estimatedValue}</div>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>Qty: {request.quantity}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Due {formatDeadline(request.deadline)}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded text-xs font-medium transition-colors">
                      Decline
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-xs font-medium transition-colors">
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <div className="bg-green-500 text-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Individual Orders</h2>
              <p className="text-green-100 mb-4">Process direct vendor orders and requests</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {individualOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
                  <div className="mb-3">
                    <div className="w-full h-32 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <Package className="w-12 h-12 text-green-600" />
                    </div>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">{order.product}</div>
                  <div className="text-gray-600 text-sm">by {order.vendor}</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                    <span>{order.location}</span>
                    <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">{order.status}</span>
                  </div>
                  <div className="text-green-600 font-bold text-lg mb-1">{order.totalValue}</div>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>Qty: {order.quantity}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span>Price: {order.requestedPrice}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded text-xs font-medium transition-colors">
                      Decline
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs font-medium transition-colors">
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            <div className="bg-purple-500 text-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Confirmed Orders</h2>
              <p className="text-purple-100 mb-4">Track and manage your confirmed deliveries</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {confirmedOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
                  <div className="mb-3">
                    <div className="w-full h-32 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                      <Package className="w-12 h-12 text-purple-600" />
                    </div>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">{order.product}</div>
                  <div className="text-gray-600 text-sm">{order.type} Order</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                    {order.vendors && <span>{order.vendors} vendors</span>}
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${order.status === 'Ready to Ship' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-purple-600 font-bold text-lg mb-1">{order.value}</div>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>Qty: {order.quantity}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Deliver {order.deliveryDate}</span>
                  </div>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors">
                    Mark as Delivered
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Profile Edit Modal */}
      {showProfileEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold">Edit Supplier Profile</h2>
              <button 
                onClick={() => setShowProfileEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company Name</label>
                      <input type="text" defaultValue="Green Valley Supplies" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Type</label>
                      <select className="w-full border rounded px-3 py-2">
                        <option>Wholesale Distributor</option>
                        <option>Manufacturer</option>
                        <option>Retailer</option>
                        <option>Importer/Exporter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">GST Number</label>
                      <input type="text" defaultValue="27AABCU9603R1ZX" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">License Number</label>
                      <input type="text" defaultValue="WB/2022/15847" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Years in Business</label>
                      <input type="number" defaultValue="8" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Employee Count</label>
                      <select className="w-full border rounded px-3 py-2">
                        <option>1-10</option>
                        <option>11-25</option>
                        <option>25-50</option>
                        <option>50-100</option>
                        <option>100+</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Email</label>
                      <input type="email" defaultValue="amit@greenvalleysupplies.com" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input type="tel" defaultValue="+91 99887 76543" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">WhatsApp Business</label>
                      <input type="tel" defaultValue="+91 99887 76543" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Website</label>
                      <input type="url" defaultValue="www.greenvalleysupplies.com" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Address</label>
                      <textarea 
                        defaultValue="Plot 45, Industrial Area, Sector 22, Gurgaon, Haryana 122015"
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Service & Product Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Products & Services</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Categories</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Fresh Vegetables
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Fruits
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Spices
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Grains
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Dairy Products
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Minimum Order Value</label>
                      <input type="number" defaultValue="5000" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Delivery Time</label>
                      <select className="w-full border rounded px-3 py-2">
                        <option>Same Day</option>
                        <option>1-2 Business Days</option>
                        <option>3-5 Business Days</option>
                        <option>1 Week</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Payment Terms</label>
                      <select className="w-full border rounded px-3 py-2">
                        <option>Cash on Delivery</option>
                        <option>15 Days Credit</option>
                        <option>30 Days Credit</option>
                        <option>45 Days Credit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Areas</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Delhi NCR
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Haryana
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Punjab
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Rajasthan
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Uttar Pradesh
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Food Safety License</label>
                      <input type="text" placeholder="License Number" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Organic Certification</label>
                      <input type="text" placeholder="Certificate Number" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ISO Certification</label>
                      <input type="text" defaultValue="ISO 22000:2018" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Export License</label>
                      <input type="text" placeholder="License Number" className="w-full border rounded px-3 py-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowProfileEditModal(false)}>
                Cancel
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
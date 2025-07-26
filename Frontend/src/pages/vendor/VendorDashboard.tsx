import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, ShoppingCart, Package, Clock, MapPin, Filter, Search, TrendingUp, User, Edit, Camera, Mail, Phone, Building, Shield, Star, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("group");
  const [groupSearch, setGroupSearch] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [joinQuantity, setJoinQuantity] = useState(0);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showGroupSuggestionsModal, setShowGroupSuggestionsModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoinGroup = (group) => {
    setSelectedGroup(group);
    setJoinQuantity(0);
    setShowJoinModal(true);
  };

  const handleJoinGroupWithSuggestions = (group) => {
    setSelectedGroup(group);
    setShowGroupSuggestionsModal(true);
  };

  const handleOrderNow = (supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierModal(true);
  };

  const handlePlaceOrder = (supplier, product) => {
    toast({
      title: "Order Placed!",
      description: `You've placed an order for ${product} from ${supplier.name}`,
    });
    setShowSupplierModal(false);
  };

  const handleJoinGroupOrder = (group, quantity) => {
    const pricePerKg = parseInt(group.pricePerKg.replace('₹', ''));
    const totalCost = quantity * pricePerKg;

    toast({
      title: "Successfully Joined Group!",
      description: `You've joined the ${group.product} group with ${quantity} kg for ₹${totalCost}`,
    });
    setShowGroupSuggestionsModal(false);
  };

  const confirmJoinGroup = () => {
    if (joinQuantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity",
        variant: "destructive"
      });
      return;
    }

    // Calculate total cost
    const pricePerKg = parseInt(selectedGroup.pricePerKg.replace('₹', ''));
    const totalCost = joinQuantity * pricePerKg;

    toast({
      title: "Successfully Joined Group!",
      description: `You've joined the ${selectedGroup.product} group with ${joinQuantity} kg for ₹${totalCost}`,
    });

    // Update the group data (in a real app, this would be an API call)
    const updatedGroups = groupOrders.map(group => 
      group.id === selectedGroup.id 
        ? { 
            ...group, 
            currentQty: `${parseInt(group.currentQty) + joinQuantity} kg`,
            participants: group.participants + 1
          }
        : group
    );
    
    // In a real app, you'd update the state here
    // setGroupOrders(updatedGroups);

    setShowJoinModal(false);
    setSelectedGroup(null);
    setJoinQuantity(0);
  };

  // Update groupOrders to use ISO datetime strings for deadline
  const groupOrders = [
    {
      id: 1,
      supplier: "Fresh Foods Co.",
      supplierId: "1",
      product: "Tomatoes",
      targetQty: "500 kg",
      currentQty: "320 kg",
      pricePerKg: "₹25",
      deadline: "2025-07-28T18:00:00", // Example future datetime
      location: "Sector 15",
      deliveryAddress: "Sector 15, Market Area, Near City Mall",
      participants: 12,
      status: "Active",
      discount: "15%",
      image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80",
      otherGroupProducts: [
        { product: "Potatoes", targetQty: "400 kg", currentQty: "250 kg", pricePerKg: "₹22", discount: "12%", participants: 8, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80" },
        { product: "Carrots", targetQty: "200 kg", currentQty: "120 kg", pricePerKg: "₹35", discount: "10%", participants: 6, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80" }
      ]
    },
    {
      id: 2,
      supplier: "Green Valley Supplies",
      supplierId: "2", 
      product: "Onions",
      targetQty: "300 kg",
      currentQty: "280 kg",
      pricePerKg: "₹18",
      deadline: "2025-07-27T15:30:00", // Example future datetime
      location: "Sector 22",
      deliveryAddress: "Sector 22, Wholesale Market, Gate No. 3",
      participants: 8,
      status: "Almost Full",
      discount: "10%",
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80",
      otherGroupProducts: [
        { product: "Garlic", targetQty: "100 kg", currentQty: "65 kg", pricePerKg: "₹80", discount: "15%", participants: 4, image: "https://images.unsplash.com/photo-1553978297-833d17b3b640?auto=format&fit=crop&w=400&q=80" },
        { product: "Ginger", targetQty: "150 kg", currentQty: "90 kg", pricePerKg: "₹120", discount: "18%", participants: 7, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80" }
      ]
    }
  ];

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

  const supplierOffers = [
    {
      id: 1,
      supplier: "City Wholesale",
      supplierId: "3",
      product: "Mixed Vegetables",
      minQty: "100 kg",
      pricePerKg: "₹22",
      deliveryTime: "Next day",
      location: "Sector 18",
      deliveryAddress: "Sector 18, Fresh Market Complex",
      rating: 4.5
    }
  ];

  // Example supplier data for grid layout
  const suppliers = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
      name: "Quality Foods",
      product: "Rice - Grains",
      price: "₹52/kg",
      location: "Thane",
      verified: true,
      memberYears: 3,
      rating: 4.8,
      otherProducts: [
        { name: "Wheat - Grains", price: "₹45/kg", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" },
        { name: "Barley - Grains", price: "₹38/kg", image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" },
        { name: "Oats - Grains", price: "₹65/kg", image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" }
      ]
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      name: "ABC Suppliers",
      product: "Rice - Grains",
      price: "₹50/kg",
      location: "Mumbai",
      verified: true,
      memberYears: 5,
      rating: 4.5,
      otherProducts: [
        { name: "Brown Rice", price: "₹68/kg", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
        { name: "Quinoa - Grains", price: "₹180/kg", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" },
        { name: "Millet - Grains", price: "₹75/kg", image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" }
      ]
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
      name: "Spice Masters",
      product: "Turmeric - Spices",
      price: "₹200/kg",
      location: "Nashik",
      verified: false,
      memberYears: 2,
      rating: 4.6,
      otherProducts: [
        { name: "Cumin - Spices", price: "₹450/kg", image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" },
        { name: "Coriander - Spices", price: "₹180/kg", image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80" },
        { name: "Red Chili - Spices", price: "₹320/kg", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" }
      ]
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
      name: "XYZ Traders",
      product: "Rice - Grains",
      price: "₹48/kg",
      location: "Pune",
      verified: true,
      memberYears: 4,
      rating: 4.2,
      otherProducts: [
        { name: "Basmati Rice", price: "₹95/kg", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
        { name: "Black Rice", price: "₹125/kg", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" },
        { name: "Broken Rice", price: "₹35/kg", image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-600 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">MarketConnect</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  className="p-2 hover:bg-blue-500 rounded-lg text-white"
                  onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {/* Hamburger Menu Dropdown */}
                {showHamburgerMenu && (
                  <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border min-w-[200px] z-50">
                    <div className="py-2">
                      <button 
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                        onClick={() => {
                          setShowProfileEditModal(true);
                          setShowHamburgerMenu(false);
                        }}
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">My Profile</span>
                      </button>
                      <button 
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                        onClick={() => setShowHamburgerMenu(false)}
                      >
                        <Shield className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">Account Settings</span>
                      </button>
                      <button 
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                        onClick={() => setShowHamburgerMenu(false)}
                      >
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">Help & Support</span>
                      </button>
                      <hr className="my-2" />
                      <button 
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600"
                        onClick={() => setShowHamburgerMenu(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Orders Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-lg border shadow-sm">
            <TabsTrigger value="individual" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Browse Suppliers</TabsTrigger>
            <TabsTrigger value="group" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Group Orders</TabsTrigger>
            <TabsTrigger value="my-orders" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">My Orders</TabsTrigger>
            <TabsTrigger value="price-trends" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Price Trends</TabsTrigger>
            </TabsList>

          <TabsContent value="individual" className="space-y-4">
            <div className="bg-blue-500 text-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Find Suppliers</h2>
              <p className="text-blue-100 mb-4">Search and filter suppliers based on your needs</p>
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for materials, suppliers..."
                    className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900 bg-white"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <Button variant="outline" className="flex items-center gap-2 text-white border-white hover:bg-blue-400">
                  <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {suppliers.map(supplier => (
                <div key={supplier.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
                  <img src={supplier.image} alt={supplier.name} className="h-40 w-full object-cover rounded-lg mb-3" />
                  <div className="font-semibold text-lg text-gray-900">{supplier.product}</div>
                  <div className="text-gray-600 text-sm">{supplier.name}</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                    <span>{supplier.location}</span>
                    {supplier.verified && <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Verified</span>}
                  </div>
                  <div className="text-blue-600 font-bold text-lg mb-1">{supplier.price}</div>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span>Member: {supplier.memberYears} yrs</span>
                    <span className="ml-2">⭐ {supplier.rating}</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors" onClick={() => handleOrderNow(supplier)}>Order Now</button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="group" className="space-y-4">
            <div className="bg-green-500 text-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Group Orders</h2>
              <p className="text-green-100 mb-4">Join group orders for bulk discounts</p>
                      </div>
            <div className="flex items-center mb-4">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search product groups..."
                  value={groupSearch}
                  onChange={e => setGroupSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {groupOrders
                  .filter(order => {
                    const now = new Date();
                    const deadline = new Date(order.deadline);
                    return deadline > now && order.product.toLowerCase().includes(groupSearch.toLowerCase());
                  })
                  .map((order) => {
                    const progress = Math.min(100, Math.round((parseInt(order.currentQty) / parseInt(order.targetQty)) * 100));
                    return (
                      <div key={order.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
                        <div className="mb-3">
                          <div className="w-full h-32 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                            <Package className="w-12 h-12 text-green-600" />
                          </div>
                        </div>
                        <div className="font-semibold text-lg text-gray-900">{order.product}</div>
                        <div className="text-gray-600 text-sm">by {order.supplier}</div>
                        <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                          <span>{order.participants} members</span>
                          <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">{order.discount || '15%'} OFF</span>
                        </div>
                        <div className="text-green-600 font-bold text-lg mb-1">{order.pricePerKg}</div>
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <span>Target: {order.targetQty}</span>
                          <span className="ml-2">Current: {order.currentQty}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mb-3">
                          <div className="h-2 bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                        <button 
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors" 
                          onClick={() => handleJoinGroupWithSuggestions(order)}
                        >
                          Join Group
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-orders" className="space-y-4">
            <div className="bg-purple-500 text-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">My Orders</h2>
              <p className="text-purple-100 mb-4">Track your order history</p>
                      </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="font-semibold text-lg text-gray-900 mb-1">Rice (50kg)</div>
                  <div className="text-gray-600 text-sm mb-1">ABC Suppliers</div>
                  <div className="text-xs text-gray-500">2024-01-20</div>
                    </div>
                <div className="flex flex-col items-end min-w-[140px]">
                  <div className="text-lg font-semibold text-purple-600 mb-2">₹2,500</div>
                  <div className="text-green-600 text-sm mb-2 font-medium">Delivered</div>
                  <Button variant="outline" size="sm" className="font-medium border-purple-500 text-purple-600 hover:bg-purple-50">Track</Button>
                        </div>
                      </div>
                    </div>
          </TabsContent>

          <TabsContent value="price-trends" className="space-y-4">
            <div className="bg-orange-500 text-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Daily Price Trends</h2>
              <p className="text-orange-100 mb-4">Track price movements for your items</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Rice</h3>
                  <p className="text-green-600 text-sm font-medium">↓2% from yesterday</p>
                </div>
                <div className="text-lg font-semibold text-green-600">₹48/kg</div>
                      </div>
              <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Wheat</h3>
                  <p className="text-red-600 text-sm font-medium">↑1.5% from yesterday</p>
                    </div>
                <div className="text-lg font-semibold text-red-600">₹35/kg</div>
                    </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Join Group Modal */}
      {showJoinModal && selectedGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border">
            <h2 className="text-xl font-semibold mb-4">Join Group Order</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedGroup.product}</h3>
                <p className="text-muted-foreground">by {selectedGroup.supplier}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <div className="font-semibold">{selectedGroup.pricePerKg}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Available:</span>
                  <div className="font-semibold">{selectedGroup.targetQty}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Current:</span>
                  <div className="font-semibold">{selectedGroup.currentQty}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Members:</span>
                  <div className="font-semibold">{selectedGroup.participants}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Quantity (kg)</label>
                <input
                  type="number"
                  value={joinQuantity}
                  onChange={(e) => setJoinQuantity(parseInt(e.target.value) || 0)}
                  className="w-full border rounded px-3 py-2"
                  min="1"
                  max={parseInt(selectedGroup.targetQty.split(' ')[0]) - parseInt(selectedGroup.currentQty.split(' ')[0])}
                />
              </div>

              {joinQuantity > 0 && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between text-sm">
                    <span>Total Cost:</span>
                    <span className="font-semibold">
                      ₹{joinQuantity * parseInt(selectedGroup.pricePerKg.replace('₹', ''))}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowJoinModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={confirmJoinGroup}
                disabled={joinQuantity <= 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm Join
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Supplier Order Modal */}
      {showSupplierModal && selectedSupplier && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Order from {selectedSupplier.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{selectedSupplier.location}</span>
                  {selectedSupplier.verified && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Verified</span>}
                  <span>⭐ {selectedSupplier.rating}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowSupplierModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Current Product */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Selected Product</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-4">
                <img src={selectedSupplier.image} alt={selectedSupplier.product} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="font-semibold text-lg">{selectedSupplier.product}</div>
                  <div className="text-blue-600 font-bold text-xl">{selectedSupplier.price}</div>
                </div>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  onClick={() => handlePlaceOrder(selectedSupplier, selectedSupplier.product)}
                >
                  Place Order
                </button>
              </div>
            </div>

            {/* Other Products from Same Supplier */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">More from {selectedSupplier.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedSupplier.otherProducts.map((product, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-blue-600 font-bold mb-2">{product.price}</div>
                    <button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                      onClick={() => handlePlaceOrder(selectedSupplier, product.name)}
                    >
                      Add to Order
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Suppliers */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Similar Suppliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suppliers
                  .filter(supplier => supplier.id !== selectedSupplier.id && 
                    (supplier.product.includes(selectedSupplier.product.split(' ')[0]) || 
                     selectedSupplier.product.includes(supplier.product.split(' ')[0])))
                  .slice(0, 2)
                  .map((supplier) => (
                    <div key={supplier.id} className="bg-gray-50 border rounded-lg p-4 flex items-center gap-4">
                      <img src={supplier.image} alt={supplier.product} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <div className="font-semibold">{supplier.name}</div>
                        <div className="text-sm text-gray-600">{supplier.product}</div>
                        <div className="text-blue-600 font-bold">{supplier.price}</div>
                      </div>
                      <button 
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                        }}
                      >
                        View
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Group Order Suggestions Modal */}
      {showGroupSuggestionsModal && selectedGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Join Group Order</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>by {selectedGroup.supplier}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{selectedGroup.discount} OFF</span>
                  <span>{selectedGroup.participants} members</span>
                </div>
              </div>
              <button 
                onClick={() => setShowGroupSuggestionsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Selected Group Order */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Selected Group Order</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-4">
                <img src={selectedGroup.image} alt={selectedGroup.product} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="font-semibold text-lg">{selectedGroup.product}</div>
                  <div className="text-green-600 font-bold text-xl">{selectedGroup.pricePerKg}</div>
                  <div className="text-sm text-gray-600">Target: {selectedGroup.targetQty} | Current: {selectedGroup.currentQty}</div>
                  <div className="w-full h-2 bg-gray-200 rounded mt-2">
                    <div 
                      className="h-2 bg-green-500 rounded transition-all" 
                      style={{ width: `${Math.min(100, Math.round((parseInt(selectedGroup.currentQty) / parseInt(selectedGroup.targetQty)) * 100))}%` }}
                    />
                  </div>
                </div>
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                  onClick={() => handleJoinGroupOrder(selectedGroup, 10)}
                >
                  Join Group
                </button>
              </div>
            </div>

            {/* Other Group Orders from Same Supplier */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">More Group Orders from {selectedGroup.supplier}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedGroup.otherGroupProducts.map((groupProduct, index) => {
                  const progress = Math.min(100, Math.round((parseInt(groupProduct.currentQty) / parseInt(groupProduct.targetQty)) * 100));
                  return (
                    <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <img src={groupProduct.image} alt={groupProduct.product} className="w-full h-32 object-cover rounded-lg mb-3" />
                      <div className="font-semibold">{groupProduct.product}</div>
                      <div className="text-green-600 font-bold mb-1">{groupProduct.pricePerKg}</div>
                      <div className="text-xs text-gray-500 mb-2">
                        <span>{groupProduct.participants} members</span>
                        <span className="ml-2 bg-green-100 text-green-700 px-1 py-0.5 rounded">{groupProduct.discount} OFF</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Target: {groupProduct.targetQty} | Current: {groupProduct.currentQty}
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded mb-3">
                        <div className="h-2 bg-green-500 rounded transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                        onClick={() => handleJoinGroupOrder({...selectedGroup, product: groupProduct.product, pricePerKg: groupProduct.pricePerKg}, 5)}
                      >
                        Join This Group
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Similar Group Orders */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Similar Group Orders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupOrders
                  .filter(order => order.id !== selectedGroup.id && 
                    (order.product.toLowerCase().includes('vegetable') || 
                     selectedGroup.product.toLowerCase().includes('vegetable') ||
                     order.supplier !== selectedGroup.supplier))
                  .slice(0, 2)
                  .map((order) => {
                    const progress = Math.min(100, Math.round((parseInt(order.currentQty) / parseInt(order.targetQty)) * 100));
                    return (
                      <div key={order.id} className="bg-gray-50 border rounded-lg p-4 flex items-center gap-4">
                        <img src={order.image} alt={order.product} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <div className="font-semibold">{order.product}</div>
                          <div className="text-sm text-gray-600">by {order.supplier}</div>
                          <div className="text-green-600 font-bold">{order.pricePerKg}</div>
                          <div className="w-full h-1 bg-gray-200 rounded mt-1">
                            <div className="h-1 bg-green-500 rounded" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                        <button 
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
                          onClick={() => {
                            setSelectedGroup(order);
                          }}
                        >
                          View
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Profile Edit Modal */}
      {showProfileEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold">Edit Profile</h2>
              <button 
                onClick={() => setShowProfileEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Name</label>
                    <input type="text" defaultValue="Kumar Enterprises" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Type</label>
                    <select className="w-full border rounded px-3 py-2">
                      <option>Retail & Wholesale</option>
                      <option>Retail Only</option>
                      <option>Wholesale Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GST Number</label>
                    <input type="text" defaultValue="07AABCU9603R1ZM" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Budget</label>
                    <select className="w-full border rounded px-3 py-2">
                      <option>₹50,000 - ₹1,00,000</option>
                      <option>₹1,00,000 - ₹2,00,000</option>
                      <option>₹2,00,000+</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Business Address</label>
                    <textarea 
                      defaultValue="123, Commercial Street, Sector 15, Mumbai, Maharashtra 400001"
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Email</label>
                    <input type="email" defaultValue="rajesh@kumarenterprises.com" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Alternative Phone</label>
                    <input type="tel" defaultValue="+91 99876 54321" className="w-full border rounded px-3 py-2" />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Preference</label>
                    <select className="w-full border rounded px-3 py-2">
                      <option>Next Day Delivery</option>
                      <option>Same Day Delivery</option>
                      <option>Standard Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <select className="w-full border rounded px-3 py-2">
                      <option>Bank Transfer, UPI</option>
                      <option>Cash on Delivery</option>
                      <option>Credit Terms</option>
                    </select>
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

export default VendorDashboard;
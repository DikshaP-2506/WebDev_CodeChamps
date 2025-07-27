import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users, TrendingUp, Clock, MapPin, CheckCircle, XCircle, Plus, User, Edit, Camera, Mail, Phone, Building, Shield, Star, Calendar, Award, Truck, DollarSign, Menu, Settings, HelpCircle, LogOut, Navigation, Target, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProductGroups, createProductGroup, updateProductGroupStatus } from "@/lib/productGroupApi";

const SupplierDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("group");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ 
    product: "", 
    quantity: "", 
    actualRate: "",
    finalRate: "",
    discountPercentage: "",
    location: "", 
    deadline: "", 
    deadlineTime: "",
    latitude: "",
    longitude: ""
  });
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  
  // Location-based functionality states
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [autoFillLocation, setAutoFillLocation] = useState(true);
  const [groupSearch, setGroupSearch] = useState("");
  
  const { toast } = useToast();
  const [groupRequests, setGroupRequests] = useState<any[]>([]);

  // Calculate discount percentage
  const calculateDiscountPercentage = (actualRate: string, finalRate: string) => {
    const actual = parseFloat(actualRate);
    const final = parseFloat(finalRate);
    if (actual > 0 && final > 0 && final <= actual) {
      const discount = ((actual - final) / actual) * 100;
      return discount.toFixed(1);
    }
    return "";
  };

  // Auto-detect location on component mount
  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Fetch product groups from backend
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groups = await fetchProductGroups();
        setGroupRequests(groups);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch product groups.",
          variant: "destructive"
        });
      }
    };
    loadGroups();
  }, []);

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission('unavailable');
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setLocationPermission(permission.state);
      
      if (permission.state === 'granted') {
        detectCurrentLocation();
      }
    } catch (error) {
      console.log('Permission API not supported, trying geolocation directly');
      detectCurrentLocation();
    }
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
      return;
    }

    setIsDetectingLocation(true);
    
    toast({
      title: "Detecting location...",
      description: "Please allow location access when prompted.",
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Set basic coordinates first
        setCurrentLocation({ latitude, longitude, name: "Detecting address..." });
        
        // Get precise location name using reverse geocoding
        try {
          const locationName = await reverseGeocode(latitude, longitude);
          setCurrentLocation({ 
            latitude, 
            longitude, 
            name: locationName,
            accuracy: position.coords.accuracy 
          });
          
          // Auto-fill location in new group form if enabled
          if (autoFillLocation && showGroupModal) {
            setNewGroup(prev => ({
              ...prev,
              location: locationName,
              latitude: latitude.toString(),
              longitude: longitude.toString()
            }));
          }
          
          toast({
            title: "Location detected successfully",
            description: `📍 ${locationName}`,
          });
        } catch (error) {
          // Keep coordinates with fallback name
          const coords = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          setCurrentLocation({ 
            latitude, 
            longitude, 
            name: coords,
            accuracy: position.coords.accuracy 
          });
          
          if (autoFillLocation && showGroupModal) {
            setNewGroup(prev => ({
              ...prev,
              location: coords,
              latitude: latitude.toString(),
              longitude: longitude.toString()
            }));
          }
          
          toast({
            title: "Location detected",
            description: "Using coordinate-based location",
            variant: "default"
          });
        }
        
        setIsDetectingLocation(false);
      },
      (error) => {
        setIsDetectingLocation(false);
        let errorMessage = "Unable to detect location.";
        let errorTitle = "Location Error";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorTitle = "Location Access Denied";
            errorMessage = "Please enable location permissions in your browser settings and try again.";
            setLocationPermission('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorTitle = "Location Unavailable";
            errorMessage = "Your location information is currently unavailable. Please try again later.";
            break;
          case error.TIMEOUT:
            errorTitle = "Location Timeout";
            errorMessage = "Location request timed out. Please check your GPS signal and try again.";
            break;
          default:
            errorMessage = "An unknown error occurred while detecting location.";
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,    // Use GPS if available
        timeout: 15000,              // Wait up to 15 seconds
        maximumAge: 300000           // Cache location for 5 minutes
      }
    );
  };

  // Real reverse geocoding function using OpenStreetMap Nominatim API
  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API (free alternative to Google Maps)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MarketConnect-App/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        // Extract meaningful location components
        const address = data.address || {};
        
        // Build location string with available components
        let locationParts = [];
        
        if (address.suburb || address.neighbourhood) {
          locationParts.push(address.suburb || address.neighbourhood);
        }
        
        if (address.city || address.town || address.village) {
          locationParts.push(address.city || address.town || address.village);
        }
        
        if (address.state) {
          locationParts.push(address.state);
        }
        
        if (address.country) {
          locationParts.push(address.country);
        }
        
        // If we have components, join them, otherwise use display_name
        const locationName = locationParts.length > 0 
          ? locationParts.join(', ')
          : data.display_name.split(',').slice(0, 3).join(',').trim();
        
        return locationName;
      }
      
      // Fallback to coordinates if no address found
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      
      // Fallback to a secondary service or coordinates
      try {
        // Try with a simpler request
        const fallbackResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.locality && fallbackData.principalSubdivision) {
            return `${fallbackData.locality}, ${fallbackData.principalSubdivision}, ${fallbackData.countryName}`;
          }
          
          if (fallbackData.city && fallbackData.principalSubdivision) {
            return `${fallbackData.city}, ${fallbackData.principalSubdivision}, ${fallbackData.countryName}`;
          }
        }
      } catch (fallbackError) {
        console.warn('Fallback geocoding also failed:', fallbackError);
      }
      
      // Final fallback to coordinates
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setNewGroup(prev => ({
        ...prev,
        location: currentLocation.name,
        latitude: currentLocation.latitude.toString(),
        longitude: currentLocation.longitude.toString()
      }));
      
      toast({
        title: "Location set",
        description: "Current location added to group details.",
      });
    } else {
      detectCurrentLocation();
    }
  };

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

  // Filter group requests based on search
  const getFilteredGroupRequests = () => {
    return groupRequests.filter(request => 
      request.product.toLowerCase().includes(groupSearch.toLowerCase()) ||
      request.location.toLowerCase().includes(groupSearch.toLowerCase())
    );
  };

  // Individual orders will be fetched from backend when implemented
  const [individualOrders, setIndividualOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);

  // Fetch individual and confirmed orders (to be implemented)
  useEffect(() => {
    // TODO: Implement API calls to fetch individual and confirmed orders
    setIndividualOrders([]);
    setConfirmedOrders([]);
  }, []);

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
                    <button 
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
                      onClick={async () => {
                        setShowHamburgerMenu(false);
                        await logout();
                        navigate('/');
                      }}
                    >
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
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-100" />
                  {currentLocation ? (
                    <span className="text-blue-100 text-sm">
                      Current location: {currentLocation.name}
                    </span>
                  ) : (
                    <span className="text-blue-200 text-sm">
                      {isDetectingLocation ? "Detecting location..." : "No location detected"}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!currentLocation && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={detectCurrentLocation}
                      disabled={isDetectingLocation}
                      className="text-white border-white hover:bg-blue-400"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {isDetectingLocation ? "Detecting..." : "Detect Location"}
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => setShowGroupModal(true)} className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product Group
                  </Button>
                </div>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-white rounded-lg border p-4 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[300px]">
                  <input
                    type="text"
                    placeholder="Search group requests..."
                    value={groupSearch}
                    onChange={e => setGroupSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLocationModal(true)}
                  className="flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Location Settings
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getFilteredGroupRequests().map((request) => (
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
                  
                  {/* Location Info */}
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{request.location}</span>
                  </div>
                  
                  <div className="text-blue-600 font-bold text-lg mb-1">{request.estimatedValue}</div>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>Qty: {request.quantity}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Due {formatDeadline(request.deadline)}</span>
                  </div>

                                  </div>
                ))}
            </div>
            
            {getFilteredGroupRequests().length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Group Requests Found</h3>
                <p className="text-gray-500 mb-4">
                  {groupSearch 
                    ? "No requests match your search criteria."
                    : "Create your first product group to start receiving requests from vendors."}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowGroupModal(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create Product Group
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <div className="bg-green-500 text-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Individual Orders</h2>
              <p className="text-green-100 mb-4">Process direct vendor orders and requests</p>
            </div>
            
            {individualOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Individual Orders</h3>
                <p className="text-gray-500 mb-4">
                  Individual orders from vendors will appear here when they place direct orders.
                </p>
              </div>
            ) : (
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
                      <MapPin className="w-3 h-3 mr-1" />
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
                      <button 
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded text-xs font-medium transition-colors"
                        onClick={async () => {
                          try {
                            // TODO: Implement individual order decline API
                            toast({ title: 'Declined', description: 'Individual order declined.' });
                          } catch (err) {
                            toast({ title: 'Error', description: 'Failed to decline order.', variant: 'destructive' });
                          }
                        }}
                      >
                        Decline
                      </button>
                      <button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs font-medium transition-colors"
                        onClick={async () => {
                          try {
                            // TODO: Implement individual order accept API
                            toast({ title: 'Accepted', description: 'Individual order accepted.' });
                          } catch (err) {
                            toast({ title: 'Error', description: 'Failed to accept order.', variant: 'destructive' });
                          }
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            <div className="bg-purple-500 text-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Confirmed Orders</h2>
              <p className="text-purple-100 mb-4">Track and manage your confirmed deliveries</p>
            </div>
            
            {confirmedOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Confirmed Orders</h3>
                <p className="text-gray-500 mb-4">
                  Confirmed orders will appear here once you accept group requests or individual orders.
                </p>
              </div>
            ) : (
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
                    <button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
                      onClick={async () => {
                        try {
                          // TODO: Implement confirmed order delivery API
                          toast({ title: 'Delivered', description: 'Order marked as delivered.' });
                        } catch (err) {
                          toast({ title: 'Error', description: 'Failed to mark as delivered.', variant: 'destructive' });
                        }
                      }}
                    >
                      Mark as Delivered
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                      <input type="text" placeholder="Enter company name" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Type</label>
                      <select className="w-full border rounded px-3 py-2">
                        <option value="">Select business type</option>
                        <option value="Wholesale Distributor">Wholesale Distributor</option>
                        <option value="Manufacturer">Manufacturer</option>
                        <option value="Retailer">Retailer</option>
                        <option value="Importer/Exporter">Importer/Exporter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">GST Number</label>
                      <input type="text" placeholder="Enter GST number" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">License Number</label>
                      <input type="text" placeholder="Enter license number" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Years in Business</label>
                      <input type="number" placeholder="Enter years in business" className="w-full border rounded px-3 py-2" />
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
                      <input type="email" placeholder="Enter primary email" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input type="tel" placeholder="Enter phone number" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">WhatsApp Business</label>
                      <input type="tel" placeholder="Enter WhatsApp number" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Website</label>
                      <input type="url" placeholder="Enter website URL" className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Address</label>
                      <textarea 
                        placeholder="Enter business address"
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
                          <input type="checkbox" className="mr-2" />
                          Fresh Vegetables
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Fruits
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Spices
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
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
      
      {/* Enhanced Create Product Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg border">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">Create Product Group</h2>
              <button 
                onClick={() => setShowGroupModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Fresh Tomatoes"
                  value={newGroup.product}
                  onChange={e => setNewGroup({ ...newGroup, product: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Quantity *</label>
                <input
                  type="text"
                  placeholder="e.g., 500 kg"
                  value={newGroup.quantity}
                  onChange={e => setNewGroup({ ...newGroup, quantity: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Actual Rate (₹/kg) *</label>
                  <input
                    type="number"
                    placeholder="e.g., 25"
                    value={newGroup.actualRate}
                    onChange={e => {
                      const actualRate = e.target.value;
                      const discount = calculateDiscountPercentage(actualRate, newGroup.finalRate);
                      setNewGroup({ 
                        ...newGroup, 
                        actualRate,
                        discountPercentage: discount
                      });
                    }}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Final Rate (₹/kg) *</label>
                  <input
                    type="number"
                    placeholder="e.g., 20"
                    value={newGroup.finalRate}
                    onChange={e => {
                      const finalRate = e.target.value;
                      const discount = calculateDiscountPercentage(newGroup.actualRate, finalRate);
                      setNewGroup({ 
                        ...newGroup, 
                        finalRate,
                        discountPercentage: discount
                      });
                    }}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {newGroup.discountPercentage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Discount Calculated:</span>
                    <span className="text-lg font-bold text-green-600">{newGroup.discountPercentage}% OFF</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Actual: ₹{newGroup.actualRate}/kg → Final: ₹{newGroup.finalRate}/kg
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Location *</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter delivery location"
                    value={newGroup.location}
                    onChange={e => setNewGroup({ ...newGroup, location: e.target.value })}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {currentLocation && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUseCurrentLocation}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Use Current Location ({currentLocation.name})
                    </Button>
                  )}
                  {!currentLocation && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={detectCurrentLocation}
                      disabled={isDetectingLocation}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      {isDetectingLocation ? "Detecting Location..." : "Auto-Detect Location"}
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Deadline Date *</label>
                  <input
                    type="date"
                    value={newGroup.deadline}
                    onChange={e => setNewGroup({...newGroup, deadline: e.target.value})}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Deadline Time *</label>
                  <input
                    type="time"
                    value={newGroup.deadlineTime}
                    onChange={e => setNewGroup({...newGroup, deadlineTime: e.target.value})}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Auto-fill location preference */}
              <div className="bg-blue-50 rounded-lg p-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoFillLocation}
                    onChange={(e) => setAutoFillLocation(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-blue-800">
                    Auto-fill location for future groups
                  </span>
                </label>
                <p className="text-xs text-blue-600 mt-1">
                  When enabled, your current location will be automatically filled in new group forms.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowGroupModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={async () => {
                  if (newGroup.product && newGroup.quantity && newGroup.actualRate && newGroup.finalRate && newGroup.location && newGroup.deadline && newGroup.deadlineTime) {
                    const deadlineDateTime = `${newGroup.deadline}T${newGroup.deadlineTime}`;
                    try {
                      await createProductGroup({
                        product: newGroup.product,
                        quantity: newGroup.quantity,
                        price: `${newGroup.finalRate}/kg`,
                        actualRate: newGroup.actualRate,
                        finalRate: newGroup.finalRate,
                        discountPercentage: newGroup.discountPercentage,
                        location: newGroup.location,
                        deadline: deadlineDateTime,
                        created_by: 1,
                        latitude: newGroup.latitude,
                        longitude: newGroup.longitude
                      });
                      // Refetch groups after creation
                      const groups = await fetchProductGroups();
                      setGroupRequests(groups);
                      toast({
                        title: "Product Group Created!",
                        description: `${newGroup.product} group created for ${newGroup.location}`,
                      });
                      setShowGroupModal(false);
                      setNewGroup({ 
                        product: "", 
                        quantity: "", 
                        actualRate: "",
                        finalRate: "",
                        discountPercentage: "",
                        location: autoFillLocation && currentLocation ? currentLocation.name : "", 
                        deadline: "", 
                        deadlineTime: "",
                        latitude: autoFillLocation && currentLocation ? currentLocation.latitude.toString() : "",
                        longitude: autoFillLocation && currentLocation ? currentLocation.longitude.toString() : ""
                      });
                    } catch (err) {
                      toast({
                        title: "Error",
                        description: "Failed to create product group.",
                        variant: "destructive"
                      });
                    }
                  } else {
                    toast({
                      title: "Missing Information",
                      description: "Please fill in all required fields.",
                      variant: "destructive"
                    });
                  }
                }}
                disabled={!newGroup.product || !newGroup.quantity || !newGroup.actualRate || !newGroup.finalRate || !newGroup.location || !newGroup.deadline || !newGroup.deadlineTime}
              >
                Create Group
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Location Settings Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">Location Settings</h2>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Current Location Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Location</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  {currentLocation ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{currentLocation.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Location not detected</span>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={detectCurrentLocation}
                  disabled={isDetectingLocation}
                  className="w-full mt-3 flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  {isDetectingLocation ? "Detecting..." : "Detect Location"}
                </Button>
              </div>

              {/* Auto-fill Preferences */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Auto-fill Preferences</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={autoFillLocation}
                      onChange={(e) => setAutoFillLocation(e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Auto-fill location in new group forms</span>
                  </label>
                </div>
                
                {autoFillLocation && currentLocation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Location will be automatically filled as: {currentLocation.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Location Permission Status */}
              {locationPermission === 'denied' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mt-0.5"></div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Location Access Denied</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        To use location features, please enable location permissions in your browser settings.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowLocationModal(false)}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowLocationModal(false);
                  toast({
                    title: "Settings saved",
                    description: "Your location preferences have been updated.",
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
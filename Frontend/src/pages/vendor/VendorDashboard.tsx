import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, ShoppingCart, Package, Clock, MapPin, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("group");
  const [groupSearch, setGroupSearch] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [joinQuantity, setJoinQuantity] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoinGroup = (group) => {
    setSelectedGroup(group);
    setJoinQuantity(0);
    setShowJoinModal(true);
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
      status: "Active"
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
      status: "Almost Full"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Vendor Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Rajesh Kumar</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/vendor/orders')}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                My Orders
              </Button>
              <Button variant="vendor" onClick={() => navigate('/vendor/create-order')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹12,450</div>
              <p className="text-xs text-muted-foreground">Through group orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Group Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Joined this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Trusted partners</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="group">Group Orders</TabsTrigger>
              <TabsTrigger value="individual">Individual Orders</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <TabsContent value="group" className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search product groups..."
                  value={groupSearch}
                  onChange={e => setGroupSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-vendor"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="grid gap-4">
              {groupOrders
                .filter(order => {
                  // Only show if deadline is in the future
                  const now = new Date();
                  const deadline = new Date(order.deadline);
                  return deadline > now && order.product.toLowerCase().includes(groupSearch.toLowerCase());
                })
                .map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <button 
                          onClick={() => navigate(`/vendor/supplier/${order.supplierId}`)}
                          className="text-left hover:text-vendor transition-colors"
                        >
                          <h3 className="text-lg font-semibold hover:underline">{order.product}</h3>
                          <p className="text-muted-foreground">by {order.supplier}</p>
                        </button>
                      </div>
                      <Badge variant={order.status === "Active" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                          {order.currentQty} / {order.targetQty}
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          {order.participants} vendors joined
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="font-medium">{order.pricePerKg}</span>
                          <span className="text-muted-foreground ml-1">per kg</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          {formatDeadline(order.deadline)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-xs">Delivery: {order.deliveryAddress}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>Area: {order.location}</span>
                      </div>
                      <Button 
                        variant="vendor" 
                        size="sm"
                        onClick={() => handleJoinGroup(order)}
                      >
                        Join Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Find Suppliers</h2>
              <p className="text-muted-foreground mb-4">Search and filter suppliers based on your needs</p>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for materials, suppliers..."
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vendor"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                <select className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vendor">
                  <option>All Categories</option>
                  <option>Grains</option>
                  <option>Spices</option>
                  <option>Vegetables</option>
                </select>
                <select className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vendor">
                  <option>All Prices</option>
                  <option>Under ₹50</option>
                  <option>₹50-100</option>
                  <option>Above ₹100</option>
                </select>
                <select className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vendor">
                  <option>Distance</option>
                  <option>Under 2km</option>
                  <option>2-5km</option>
                  <option>Above 5km</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4">
              {supplierOffers.map((offer) => (
                <Card key={offer.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{offer.supplier}</h3>
                        <p className="text-lg text-muted-foreground mb-3">{offer.product}</p>
                        
                        <div className="flex items-center gap-6 mb-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-1" />
                            {offer.location}
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-yellow-500 mr-1">⭐</span>
                            {offer.rating}
                          </div>
                          <div className="text-lg font-semibold text-vendor">
                            {offer.pricePerKg}
                          </div>
                        </div>
                        
                        <Badge variant="outline" className="mb-4">
                          {offer.product.includes('Rice') ? 'Grains' : 'Spices'}
                        </Badge>
                      </div>
                      
                      <Button 
                        variant="default" 
                        size="lg"
                        onClick={() => navigate(`/vendor/supplier/${offer.supplierId}`)}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Order Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Join Group Modal */}
      {showJoinModal && selectedGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
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
                variant="vendor" 
                onClick={confirmJoinGroup}
                disabled={joinQuantity <= 0}
              >
                Confirm Join
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
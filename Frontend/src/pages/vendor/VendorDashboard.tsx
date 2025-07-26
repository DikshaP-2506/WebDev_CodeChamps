import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, ShoppingCart, Package, Clock, MapPin, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("group");
  const [groupSearch, setGroupSearch] = useState("");
  const navigate = useNavigate();

  const groupOrders = [
    {
      id: 1,
      supplier: "Fresh Foods Co.",
      supplierId: "1",
      product: "Tomatoes",
      targetQty: "500 kg",
      currentQty: "320 kg",
      pricePerKg: "₹25",
      deadline: "2 days left",
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
      deadline: "1 day left",
      location: "Sector 22",
      deliveryAddress: "Sector 22, Wholesale Market, Gate No. 3",
      participants: 8,
      status: "Almost Full"
    }
  ];

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
                .filter(order => order.product.toLowerCase().includes(groupSearch.toLowerCase()))
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
                          {order.deadline}
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
                      <Button variant="vendor" size="sm">
                        Join Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <div className="grid gap-4">
              {supplierOffers.map((offer) => (
                <Card key={offer.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <button 
                          onClick={() => navigate(`/vendor/supplier/${offer.supplierId}`)}
                          className="text-left hover:text-vendor transition-colors"
                        >
                          <h3 className="text-lg font-semibold hover:underline">{offer.product}</h3>
                          <p className="text-muted-foreground">by {offer.supplier}</p>
                        </button>
                      </div>
                      <Badge variant="outline">
                        ⭐ {offer.rating}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                          Min. {offer.minQty}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium">{offer.pricePerKg}</span>
                          <span className="text-muted-foreground ml-1">per kg</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          {offer.deliveryTime}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          {offer.location}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-xs">Delivery: {offer.deliveryAddress}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => navigate(`/vendor/supplier/${offer.supplierId}`)}
                      >
                        View Supplier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDashboard;
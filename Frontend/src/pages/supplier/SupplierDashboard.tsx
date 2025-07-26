import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users, TrendingUp, Clock, MapPin, CheckCircle, XCircle, Plus } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Supplier Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Green Valley Supplies</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Inventory
              </Button>
              <Button variant="supplier">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+3 new today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,24,500</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">6 group, 6 individual</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vendor Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Repeat customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="group">Group Requests</TabsTrigger>
            <TabsTrigger value="individual">Individual Orders</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="group" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button variant="vendor" onClick={() => setShowGroupModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Product Group
              </Button>
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
                      variant="vendor"
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
            <div className="grid gap-4">
              {groupRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{request.product}</h3>
                        <p className="text-muted-foreground">Group order request</p>
                      </div>
                      <Badge variant="secondary">
                        {request.status}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                          {request.quantity} required
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          {request.vendors} vendors
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          Due {formatDeadline(request.deadline)}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          {request.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-supplier">
                        Est. Value: {request.estimatedValue}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                        <Button variant="supplier" size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept & Quote
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <div className="grid gap-4">
              {individualOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{order.product}</h3>
                        <p className="text-muted-foreground">by {order.vendor}</p>
                      </div>
                      <Badge variant="outline">
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                          {order.quantity}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium">{order.requestedPrice}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          {order.location}
                        </div>
                        <div className="text-lg font-semibold text-supplier">
                          {order.totalValue}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                      <Button variant="supplier" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            <div className="grid gap-4">
              {confirmedOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{order.product}</h3>
                        <p className="text-muted-foreground">{order.type} Order</p>
                      </div>
                      <Badge variant="default">
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                          {order.quantity}
                        </div>
                        {order.vendors && (
                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                            {order.vendors} vendors
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          Deliver {order.deliveryDate}
                        </div>
                        <div className="text-lg font-semibold text-supplier">
                          {order.value}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="supplier" size="sm">
                        <Package className="w-4 h-4 mr-2" />
                        Mark as Delivered
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

export default SupplierDashboard;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Package, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Bridge the Gap Between
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Local Vendors</span>
            <br />
            and <span className="bg-gradient-hero bg-clip-text text-transparent">Suppliers</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect local vendors with reliable suppliers through our innovative platform. 
            Join group orders, save costs, and grow your business together.
          </p>
          
          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-2xl mx-auto">
            <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer border-2 hover:border-vendor/50" 
                  onClick={() => navigate('/vendor/login')}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-vendor rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">I'm a Vendor</CardTitle>
                <CardDescription className="text-base">
                  Join group orders, save costs, and access reliable suppliers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="vendor" className="w-full" size="lg">
                  Get Started as Vendor
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer border-2 hover:border-supplier/50" 
                  onClick={() => navigate('/supplier/login')}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-supplier rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">I'm a Supplier</CardTitle>
                <CardDescription className="text-base">
                  Fulfill bulk orders, manage inventory, and grow your network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="supplier" className="w-full" size="lg">
                  Get Started as Supplier
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Group Ordering</h3>
              <p className="text-muted-foreground">Join forces with other vendors to get better prices on bulk orders</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliable Supply Chain</h3>
              <p className="text-muted-foreground">Connect with verified suppliers for consistent product availability</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cost Savings</h3>
              <p className="text-muted-foreground">Reduce costs through bulk purchasing and efficient logistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
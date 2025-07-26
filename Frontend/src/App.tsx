import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import VendorAuth from "./pages/auth/VendorAuth";
import SupplierAuth from "./pages/auth/SupplierAuth";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import SupplierDetails from "./pages/vendor/SupplierDetails";
import OrderSummary from "./pages/vendor/OrderSummary";
import CreateOrder from "./pages/vendor/CreateOrder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/vendor/login" element={<VendorAuth />} />
          <Route path="/supplier/login" element={<SupplierAuth />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/supplier/:supplierId" element={<SupplierDetails />} />
          <Route path="/vendor/order-summary" element={<OrderSummary />} />
          <Route path="/vendor/create-order" element={<CreateOrder />} />
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

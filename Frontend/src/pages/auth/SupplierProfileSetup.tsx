import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../contexts/AuthContext";

const SupplierProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setProfileCompleted } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    languagePreference: "",
    businessName: "",
    businessAddress: "",
    city: "",
    pincode: "",
    state: "",
    businessType: "",
    supplyCapabilities: [] as string[],
    preferredDeliveryTime: "",
    latitude: "",
    longitude: ""
  });

  // Get user's phone number from Firebase Auth if available
  useEffect(() => {
    const user = auth.currentUser;
    if (user?.phoneNumber) {
      setFormData(prev => ({ ...prev, mobileNumber: user.phoneNumber }));
    }
  }, []);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSupplyCapabilityToggle = (capability: string) => {
    setFormData(prev => ({
      ...prev,
      supplyCapabilities: prev.supplyCapabilities.includes(capability)
        ? prev.supplyCapabilities.filter(item => item !== capability)
        : [...prev.supplyCapabilities, capability]
    }));
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast({
            title: "Location Detected",
            description: "Your location has been automatically detected.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not detect location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.mobileNumber || !formData.languagePreference || 
        !formData.businessAddress || !formData.city || !formData.pincode || !formData.state || 
        !formData.businessType || formData.supplyCapabilities.length === 0 || !formData.preferredDeliveryTime) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Save the profile data to your database
      const response = await fetch('http://localhost:5000/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          languagePreference: formData.languagePreference,
          businessName: formData.businessName,
          businessAddress: formData.businessAddress,
          city: formData.city,
          pincode: formData.pincode,
          state: formData.state,
          businessType: formData.businessType,
          supplyCapabilities: formData.supplyCapabilities,
          preferredDeliveryTime: formData.preferredDeliveryTime,
          latitude: formData.latitude,
          longitude: formData.longitude
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }

      const result = await response.json();
      console.log('Supplier profile created:', result);

      // Set profile as completed
      setProfileCompleted(true);

      toast({
        title: "Profile Setup Complete!",
        description: "Your supplier profile has been created successfully.",
      });

      // Redirect to supplier dashboard
      navigate("/supplier/dashboard");
    } catch (error) {
      console.error('Error saving supplier profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const languages = ["Hindi", "Marathi", "English", "Gujarati", "Punjabi", "Bengali"];
  const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Punjab", "West Bengal", "Uttar Pradesh"];
  const businessTypes = ["Wholesale", "Retail", "Manufacturing", "Distribution", "Import/Export", "Local Supplier", "Other"];
  const supplyCapabilities = ["Spices", "Oil", "Vegetables", "Grains", "Dairy", "Meat", "Fruits", "Flour", "Sugar", "Salt", "Herbs", "Packaging", "Equipment"];
  const deliveryTimes = ["Morning (6 AM - 12 PM)", "Afternoon (12 PM - 6 PM)", "Evening (6 PM - 12 AM)"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-xl border-2 border-supplier/30">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-supplier rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Complete Your Supplier Profile</CardTitle>
            <CardDescription>
              Help us understand your business better to connect you with the right vendors
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-supplier">Personal Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languagePreference">Language Preference *</Label>
                  <Select value={formData.languagePreference} onValueChange={(value) => handleInputChange("languagePreference", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>{language}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-supplier">Business Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name (Optional)</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="Enter your business name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Input
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                    placeholder="Street, Landmark, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      placeholder="Enter pincode"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type / Category *</Label>
                  <Select value={formData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Supply Capabilities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-supplier">Supply Capabilities *</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {supplyCapabilities.map((capability) => (
                    <div key={capability} className="flex items-center space-x-2">
                      <Checkbox
                        id={capability}
                        checked={formData.supplyCapabilities.includes(capability)}
                        onCheckedChange={() => handleSupplyCapabilityToggle(capability)}
                      />
                      <Label htmlFor={capability} className="text-sm">{capability}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-supplier">Delivery Preferences</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="preferredDeliveryTime">Preferred Delivery Time Slot *</Label>
                  <Select value={formData.preferredDeliveryTime} onValueChange={(value) => handleInputChange("preferredDeliveryTime", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred delivery time" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryTimes.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-supplier">Location (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange("latitude", e.target.value)}
                      placeholder="Auto-detect or enter manually"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange("longitude", e.target.value)}
                      placeholder="Auto-detect or enter manually"
                    />
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLocationDetect}
                  className="w-full"
                >
                  Auto-Detect Location
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="supplier"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Setting up profile..." : "Complete Profile Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierProfileSetup;
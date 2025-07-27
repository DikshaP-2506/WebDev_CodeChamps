import React, { useState } from "react";
import { auth } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SupplierAuth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { profileCompleted } = useAuth();

  // Google Sign-In
  const handleGoogle = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a first-time user by checking creation time
      const user = result.user;
      const creationTime = user.metadata.creationTime;
      const lastSignInTime = user.metadata.lastSignInTime;
      
      // If creation time equals last sign in time, it's a new user
      if (creationTime === lastSignInTime) {
        navigate("/supplier/profile-setup");
      } else {
        // Check if user has completed profile setup (you would check your database here)
        // For now, we'll redirect to profile setup for all users
        const completed = localStorage.getItem(`profileCompleted_${user.uid}`) === 'true';
        if (completed) {
          navigate("/supplier/dashboard");
        } else {
          navigate("/supplier/profile-setup");
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Email/Password Auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/supplier/dashboard");
      } else {
        // This is a new user signup
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/supplier/profile-setup");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 pt-20">
        {/* Back Button - Below Navbar */}
        <div className="container mx-auto px-4 pt-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 p-2 bg-white/80 hover:bg-white rounded-lg shadow-md transition-all duration-200 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>
        
        <div className="flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-supplier/30">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="w-16 h-16 bg-gradient-supplier rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">{isLogin ? "Supplier Login" : "Supplier Signup"}</CardTitle>
          <CardDescription>
            {isLogin ? "Access your supplier dashboard" : "Create your supplier account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" variant="supplier" className="w-full">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
          <div className="flex items-center gap-2 my-2">
            <div className="flex-grow h-px bg-muted-foreground/30" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-grow h-px bg-muted-foreground/30" />
          </div>
          <Button type="button" onClick={handleGoogle} className="w-full bg-white border text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm">
            <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block"><g><path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.1-5.4 7-9.8 7-5.5 0-10-4.5-10-10s4.5-10 10-10c2.4 0 4.6.9 6.3 2.3l6.1-6.1C34.5 8.5 29.6 6 24 6 13.5 6 5 14.5 5 25s8.5 19 19 19c9.5 0 18-7.5 18-19 0-1.3-.1-2.5-.4-3.5z"/><path fill="#34A853" d="M24 44c5.4 0 10-1.8 13.7-4.9l-6.3-5c-1.8 1.2-4.1 2-7.4 2-5.7 0-10.5-3.8-12.2-9h-7.4v5.6C8.9 39.1 15.9 44 24 44z"/><path fill="#FBBC05" d="M11.8 27c-.4-1.2-.7-2.5-.7-3.9s.3-2.7.7-3.9v-5.6h-7.4C3.5 17.9 3 21.4 3 25s.5 7.1 1.4 10.4l7.4-5.6z"/><path fill="#EA4335" d="M24 14c3.1 0 5.9 1.1 8.1 3.2l6.1-6.1C34.5 8.5 29.6 6 24 6c-8.1 0-15.1 4.9-18.6 12.1l7.4 5.6C13.5 17.8 18.3 14 24 14z"/></g></svg>
            Continue with Google
          </Button>
          <div className="text-center mt-2">
            <button
              type="button"
              className="text-supplier underline text-sm hover:text-supplier/80"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SupplierAuth;

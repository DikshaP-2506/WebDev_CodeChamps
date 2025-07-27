import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div 
            className="text-3xl font-bold text-black font-sans tracking-tight cursor-pointer hover:text-blue-600 transition-colors duration-300" 
            style={{ fontFamily: 'Georgia, serif' }}
            onClick={() => navigate('/')}
          >
            Market Connect
          </div>
          <div className="flex items-center space-x-6">
            <Button 
              variant="outline" 
              className="bg-blue-600 text-white border-none hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-2 font-semibold"
            >
              About
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

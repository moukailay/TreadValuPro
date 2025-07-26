import { Button } from "@/components/ui/button";
import { Calculator, Plus, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-green-600 rounded-lg flex items-center justify-center">
                    <Calculator className="text-white text-sm" size={16} />
                  </div>
                  <span className="text-xl font-bold text-slate-900">TreadValue Pro</span>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex space-x-8 ml-10">
              <Link 
                href="/"
                className={`px-1 pt-1 pb-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Tableau de Bord
              </Link>
              <Link 
                href="/calculator"
                className={`px-1 pt-1 pb-2 text-sm font-medium ${
                  isActive('/calculator') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Calculateur ROI
              </Link>
              <Link 
                href="/proposals"
                className={`px-1 pt-1 pb-2 text-sm font-medium ${
                  isActive('/proposals') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Propositions
              </Link>
              <Link 
                href="/clients"
                className={`px-1 pt-1 pb-2 text-sm font-medium ${
                  isActive('/clients') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Clients
              </Link>
              <Link 
                href="/reports"
                className={`px-1 pt-1 pb-2 text-sm font-medium ${
                  isActive('/reports') 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Rapports
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Plus className="mr-2" size={16} />
              Nouvelle Proposition
            </Button>
            <div className="relative">
              <button className="flex items-center space-x-2 text-slate-700 hover:text-slate-900">
                <img 
                  className="w-8 h-8 rounded-full object-cover" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" 
                  alt="Profile" 
                />
                <span className="text-sm font-medium">Jean Dupont</span>
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

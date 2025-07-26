import Navigation from "@/components/navigation";
import StatsCards from "@/components/stats-cards";
import ROICalculator from "@/components/roi-calculator";
import QuickActions from "@/components/quick-actions";
import RecentProposals from "@/components/recent-proposals";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de Bord</h1>
          <p className="text-slate-600">Aperçu de vos performances et calculateurs ROI</p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* ROI Calculator */}
          <ROICalculator />
          
          {/* Quick Actions & Recent Activity */}
          <QuickActions />
        </div>

        {/* Recent Proposals */}
        <RecentProposals />
      </div>
    </div>
  );
}

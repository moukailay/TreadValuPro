import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, Percent, Leaf } from "lucide-react";
import { formatNumber } from "@/lib/calculations";

interface Stats {
  proposalsThisMonth: number;
  conversionRate: number;
  averageROI: number;
  co2Saved: number;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                  <div className="h-8 bg-slate-200 rounded w-16"></div>
                  <div className="h-3 bg-slate-200 rounded w-24"></div>
                </div>
                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Propositions ce mois</p>
              <p className="text-2xl font-bold text-slate-900">{stats.proposalsThisMonth}</p>
              <p className="text-sm text-green-600">+12% vs mois dernier</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="text-primary" size={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taux de conversion</p>
              <p className="text-2xl font-bold text-slate-900">{stats.conversionRate}%</p>
              <p className="text-sm text-green-600">+8% ce trimestre</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">ROI moyen calculé</p>
              <p className="text-2xl font-bold text-slate-900">{stats.averageROI}%</p>
              <p className="text-sm text-green-600">Sur 5 ans</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Percent className="text-purple-600" size={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">CO₂ économisé</p>
              <p className="text-2xl font-bold text-slate-900">{formatNumber(stats.co2Saved)}</p>
              <p className="text-sm text-green-600">tonnes cette année</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="text-green-600" size={20} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

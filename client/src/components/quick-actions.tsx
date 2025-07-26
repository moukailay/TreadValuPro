import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calculator, FileText, ChevronRight, Check, Users, BarChart3 } from "lucide-react";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  companyName?: string;
}

export default function QuickActions() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activity"],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "proposal_accepted":
        return <Check className="text-green-600" size={12} />;
      case "proposal_sent":
        return <FileText className="text-blue-600" size={12} />;
      case "calculation_created":
        return <Calculator className="text-purple-600" size={12} />;
      default:
        return <BarChart3 className="text-slate-600" size={12} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "proposal_accepted":
        return "bg-green-100";
      case "proposal_sent":
        return "bg-blue-100";
      case "calculation_created":
        return "bg-purple-100";
      default:
        return "bg-slate-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between text-left h-auto p-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="text-primary" size={14} />
              </div>
              <span className="text-sm font-medium text-slate-900">Nouveau Client</span>
            </div>
            <ChevronRight className="text-slate-400" size={14} />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-between text-left h-auto p-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calculator className="text-green-600" size={14} />
              </div>
              <span className="text-sm font-medium text-slate-900">Calcul Rapide</span>
            </div>
            <ChevronRight className="text-slate-400" size={14} />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-between text-left h-auto p-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="text-purple-600" size={14} />
              </div>
              <span className="text-sm font-medium text-slate-900">Template Personnalisé</span>
            </div>
            <ChevronRight className="text-slate-400" size={14} />
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3 animate-pulse">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDistance(new Date(activity.timestamp), new Date(), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Aucune activité récente</p>
          )}

          <Button variant="ghost" className="w-full mt-4 text-sm text-primary hover:text-primary/80">
            Voir toute l'activité
          </Button>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Impact Environnemental</h3>
              <p className="text-sm text-green-700">Vos contributions cette année</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-800">CO₂ économisé</span>
              <span className="font-semibold text-green-900">1,247 tonnes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-800">Pneus rechapés</span>
              <span className="font-semibold text-green-900">3,892 unités</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-800">Économie de pétrole</span>
              <span className="font-semibold text-green-900">456,000 L</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

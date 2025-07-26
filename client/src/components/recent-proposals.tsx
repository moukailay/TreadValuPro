import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/calculations";

interface ProposalWithCompany {
  id: string;
  companyId: string;
  fleetSize: number;
  calculatedROI: string;
  annualSavings: string;
  status: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
  };
}

export default function RecentProposals() {
  const { data: proposals, isLoading } = useQuery<ProposalWithCompany[]>({
    queryKey: ["/api/proposals"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-slate-900">
              Propositions Récentes
            </CardTitle>
            <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm">
              Voir toutes
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="bg-slate-50 border-b border-slate-200 p-4">
              <div className="grid grid-cols-7 gap-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-slate-200 p-4">
                <div className="grid grid-cols-7 gap-4">
                  {[...Array(7)].map((_, j) => (
                    <div key={j} className="h-4 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-slate-900">
            Propositions Récentes
          </CardTitle>
          <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm">
            Voir toutes
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Client</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Flotte</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">ROI Calculé</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Économies/an</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Statut</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Date</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {proposals && proposals.length > 0 ? (
                proposals.slice(0, 5).map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {getCompanyInitials(proposal.company.name)}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900">{proposal.company.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {proposal.fleetSize} véhicules
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-green-600 font-semibold">
                        {parseFloat(proposal.calculatedROI).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-900 font-medium">
                      {formatCurrency(parseFloat(proposal.annualSavings))}
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={getStatusColor(proposal.status)}>
                        {getStatusLabel(proposal.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {new Date(proposal.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 px-6 text-center text-slate-500">
                    Aucune proposition trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

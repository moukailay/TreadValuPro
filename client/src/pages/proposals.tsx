import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Search, Filter, Plus, FileText, Eye, Edit, Trash2 } from "lucide-react";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/calculations";
import { apiRequest } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProposalWithCompany {
  id: string;
  companyId: string;
  fleetSize: number;
  calculatedROI: string;
  annualSavings: string;
  fiveYearSavings: string;
  status: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
  };
}

export default function Proposals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: proposals, isLoading } = useQuery<ProposalWithCompany[]>({
    queryKey: ["/api/proposals"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/proposals/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
    },
  });

  const filteredProposals = proposals?.filter(proposal => {
    const matchesSearch = proposal.company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Propositions</h1>
            <p className="text-slate-600">Gérez toutes vos propositions commerciales</p>
          </div>
          <Button className="bg-primary text-white hover:bg-primary/90">
            <Plus className="mr-2" size={16} />
            Nouvelle Proposition
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher par nom de client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillons</SelectItem>
                  <SelectItem value="sent">Envoyées</SelectItem>
                  <SelectItem value="under_review">En révision</SelectItem>
                  <SelectItem value="accepted">Acceptées</SelectItem>
                  <SelectItem value="rejected">Rejetées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Proposals Table */}
        <Card>
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-xl font-semibold text-slate-900">
              {filteredProposals.length} Proposition{filteredProposals.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/6"></div>
                      </div>
                      <div className="w-20 h-6 bg-slate-200 rounded"></div>
                      <div className="w-24 h-6 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredProposals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Client</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Flotte</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">ROI</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Économies/an</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Économies 5 ans</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Statut</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Date</th>
                      <th className="text-right py-3 px-6 text-sm font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredProposals.map((proposal) => (
                      <tr key={proposal.id} className="hover:bg-slate-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {getCompanyInitials(proposal.company.name)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{proposal.company.name}</div>
                              <div className="text-sm text-slate-500">ID: {proposal.id.slice(0, 8)}</div>
                            </div>
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
                        <td className="py-4 px-6 text-slate-900 font-medium">
                          {formatCurrency(parseFloat(proposal.fiveYearSavings))}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Télécharger PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              {proposal.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() => updateStatusMutation.mutate({ 
                                    id: proposal.id, 
                                    status: "sent" 
                                  })}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Envoyer
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Aucune proposition trouvée
                </h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Aucune proposition ne correspond à vos critères de recherche."
                    : "Commencez par créer votre première proposition."}
                </p>
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Plus className="mr-2" size={16} />
                  Nouvelle Proposition
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Search, 
  Plus, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  MoreHorizontal,
  Users,
  FileText,
  Calendar
} from "lucide-react";
import { insertCompanySchema, type Company, type InsertCompany } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: companies, isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const { data: proposals } = useQuery({
    queryKey: ["/api/proposals"],
  });

  const form = useForm<InsertCompany>({
    resolver: zodResolver(insertCompanySchema),
    defaultValues: {
      name: "",
      email: "",
      contactPerson: "",
      phone: "",
      address: "",
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (data: InsertCompany) => {
      const response = await apiRequest("POST", "/api/companies", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      setIsDialogOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: InsertCompany) => {
    createCompanyMutation.mutate(data);
  };

  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompanyProposalsCount = (companyId: string) => {
    if (!proposals) return 0;
    return (proposals as any[]).filter(p => p.companyId === companyId).length;
  };

  const getLastProposalDate = (companyId: string) => {
    if (!proposals) return null;
    const companyProposals = (proposals as any[]).filter(p => p.companyId === companyId);
    if (companyProposals.length === 0) return null;
    
    const lastProposal = companyProposals.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    
    return new Date(lastProposal.createdAt);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Clients</h1>
            <p className="text-slate-600">Gérez votre portefeuille client</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90">
                <Plus className="mr-2" size={16} />
                Nouveau Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau client</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'entreprise *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Transport Bourassa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personne de contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Jean-Pierre Bourassa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="info@transport-bourassa.ca" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="(514) 234-5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="1250 Rue Sainte-Catherine Est, Montréal, QC H2L 2H5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createCompanyMutation.isPending}
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      {createCompanyMutation.isPending ? "Création..." : "Créer"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Clients</p>
                  <p className="text-2xl font-bold text-slate-900">{companies?.length || 0}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Clients Actifs</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {companies?.filter(c => getCompanyProposalsCount(c.id) > 0).length || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Nouveaux ce mois</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {companies?.filter(c => {
                      const created = new Date(c.createdAt!);
                      const now = new Date();
                      return created.getMonth() === now.getMonth() && 
                             created.getFullYear() === now.getFullYear();
                    }).length || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, contact ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => {
              const proposalsCount = getCompanyProposalsCount(company.id);
              const lastProposalDate = getLastProposalDate(company.id);
              
              return (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {getCompanyInitials(company.name)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{company.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {proposalsCount} proposition{proposalsCount !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm">
                      {company.contactPerson && (
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Users size={14} />
                          <span>{company.contactPerson}</span>
                        </div>
                      )}
                      {company.email && (
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Mail size={14} />
                          <span className="truncate">{company.email}</span>
                        </div>
                      )}
                      {company.phone && (
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Phone size={14} />
                          <span>{company.phone}</span>
                        </div>
                      )}
                      {company.address && (
                        <div className="flex items-center space-x-2 text-slate-600">
                          <MapPin size={14} />
                          <span className="truncate">{company.address}</span>
                        </div>
                      )}
                    </div>

                    {lastProposalDate && (
                      <div className="mt-4 pt-3 border-t border-slate-200">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Dernière proposition</span>
                          <span>{lastProposalDate.toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="mr-1" size={12} />
                        Propositions
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary text-white hover:bg-primary/90">
                        <Plus className="mr-1" size={12} />
                        Nouveau ROI
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {searchTerm ? "Aucun client trouvé" : "Aucun client"}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm 
                  ? "Aucun client ne correspond à votre recherche."
                  : "Commencez par ajouter votre premier client."}
              </p>
              <Button 
                className="bg-primary text-white hover:bg-primary/90"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="mr-2" size={16} />
                Nouveau Client
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
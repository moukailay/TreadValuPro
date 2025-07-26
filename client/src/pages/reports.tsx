import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  Download, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  FileText,
  Calendar,
  Target,
  Award
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/calculations";

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Reports() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: proposals } = useQuery({
    queryKey: ["/api/proposals"],
  });

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', propositions: 8, conversions: 3, roi: 285 },
    { month: 'Fév', propositions: 12, conversions: 5, roi: 312 },
    { month: 'Mar', propositions: 15, conversions: 7, roi: 298 },
    { month: 'Avr', propositions: 18, conversions: 8, roi: 325 },
    { month: 'Mai', propositions: 22, conversions: 12, roi: 341 },
    { month: 'Juin', propositions: 19, conversions: 9, roi: 318 },
  ];

  const statusData = [
    { name: 'Acceptées', value: 35, color: '#10B981' },
    { name: 'En révision', value: 25, color: '#F59E0B' },
    { name: 'Envoyées', value: 20, color: '#3B82F6' },
    { name: 'Brouillons', value: 15, color: '#6B7280' },
    { name: 'Rejetées', value: 5, color: '#EF4444' },
  ];

  const savingsData = [
    { year: '2019', savings: 450000 },
    { year: '2020', savings: 680000 },
    { year: '2021', savings: 920000 },
    { year: '2022', savings: 1250000 },
    { year: '2023', savings: 1680000 },
    { year: '2024', savings: 2100000 },
  ];

  const vehicleTypeData = [
    { type: 'Poids lourds', count: 45, percentage: 55 },
    { type: 'Camions moyens', count: 25, percentage: 30 },
    { type: 'Utilitaires', count: 10, percentage: 12 },
    { type: 'Autobus', count: 3, percentage: 3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Rapports</h1>
            <p className="text-slate-600">Analysez vos performances et impact environnemental</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Calendar className="mr-2" size={16} />
              Période
            </Button>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Download className="mr-2" size={16} />
              Exporter PDF
            </Button>
          </div>
        </div>

        {/* KPIs Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Économies Totales</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(2100000)}
                  </p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp size={12} className="mr-1" />
                    +25% cette année
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">CO₂ Économisé</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatNumber(stats?.co2Saved || 2847)} tonnes
                  </p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <Leaf size={12} className="mr-1" />
                    Impact positif
                  </p>
                </div>
                <Leaf className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Taux de Conversion</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {stats?.conversionRate || 67}%
                  </p>
                  <p className="text-sm text-purple-600 flex items-center mt-1">
                    <Target size={12} className="mr-1" />
                    Objectif: 70%
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">ROI Moyen</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {stats?.averageROI || 295}%
                  </p>
                  <p className="text-sm text-orange-600 flex items-center mt-1">
                    <TrendingUp size={12} className="mr-1" />
                    Sur 5 ans
                  </p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Performance Mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="propositions" fill="#3B82F6" name="Propositions" />
                    <Bar dataKey="conversions" fill="#10B981" name="Acceptées" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Répartition des Statuts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Evolution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Évolution des Économies Générées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={savingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), "Économies"]} />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Répartition par Type de Véhicule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicleTypeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      ></div>
                      <span className="text-sm font-medium text-slate-900">
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-slate-600">{item.count} flottes</span>
                      <Badge variant="outline" className="text-xs">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-900">
                Impact Environnemental 2024
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">CO₂ économisé</span>
                  <span className="text-lg font-bold text-green-900">2,847 tonnes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Pneus rechapés</span>
                  <span className="text-lg font-bold text-green-900">12,450 unités</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Pétrole économisé</span>
                  <span className="text-lg font-bold text-green-900">1,456,000 L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Déchets évités</span>
                  <span className="text-lg font-bold text-green-900">892 tonnes</span>
                </div>
                
                <div className="pt-4 border-t border-green-200">
                  <div className="text-center">
                    <p className="text-xs text-green-700 mb-2">Équivalent en arbres plantés</p>
                    <p className="text-2xl font-bold text-green-900">47,450 arbres</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Exports et Certificats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                <div className="text-center">
                  <Download className="mx-auto mb-2 h-6 w-6 text-slate-600" />
                  <p className="text-sm font-medium">Rapport Mensuel</p>
                  <p className="text-xs text-slate-500">PDF complet</p>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                <div className="text-center">
                  <Leaf className="mx-auto mb-2 h-6 w-6 text-green-600" />
                  <p className="text-sm font-medium">Certificat Environnemental</p>
                  <p className="text-xs text-slate-500">Impact CO₂</p>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                <div className="text-center">
                  <FileText className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                  <p className="text-sm font-medium">Données Excel</p>
                  <p className="text-xs text-slate-500">Export brut</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
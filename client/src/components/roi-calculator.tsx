import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calculator, FileText, Share, HelpCircle, Euro, Leaf, Route, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { roiCalculationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { 
  vehicleTypeOptions, 
  formatCurrency, 
  formatNumber,
  type ROIResult, 
  type ROIInput 
} from "@/lib/calculations";

export default function ROICalculator() {
  const [result, setResult] = useState<ROIResult | null>(null);

  const form = useForm<ROIInput>({
    resolver: zodResolver(roiCalculationSchema),
    defaultValues: {
      fleetSize: 50,
      annualKilometers: 120000,
      vehicleType: "heavy_truck",
      fuelPrice: 1.55,
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: ROIInput) => {
      const response = await apiRequest("POST", "/api/calculate-roi", data);
      return response.json();
    },
    onSuccess: (data: ROIResult) => {
      setResult(data);
    },
  });

  const onSubmit = (data: ROIInput) => {
    calculateMutation.mutate(data);
  };

  const chartData = result ? [
    { year: "Année 1", savings: result.savingsBreakdown.year1 },
    { year: "Année 2", savings: result.savingsBreakdown.year2 },
    { year: "Année 3", savings: result.savingsBreakdown.year3 },
    { year: "Année 4", savings: result.savingsBreakdown.year4 },
    { year: "Année 5", savings: result.savingsBreakdown.year5 },
  ] : [];

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Calculateur ROI Intelligent
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Calculez instantanément le retour sur investissement
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <HelpCircle size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fleetSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taille de la flotte</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className="pr-20"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <span className="text-slate-500 text-sm">véhicules</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annualKilometers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilométrage annuel</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className="pr-16"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <span className="text-slate-500 text-sm">km/an</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de véhicules</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix carburant local</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className="pr-12"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <span className="text-slate-500 text-sm">€/L</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary/90"
              disabled={calculateMutation.isPending}
            >
              {calculateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calcul en cours...
                </>
              ) : (
                <>
                  <Calculator className="mr-2" size={16} />
                  Calculer le ROI
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Results Section */}
        {result && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Résultats du Calcul</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Économies sur 5 ans</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(result.fiveYearSavings)}
                    </p>
                  </div>
                  <Euro className="text-green-600" size={20} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Réduction CO₂</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatNumber(result.co2Reduction)} tonnes
                    </p>
                  </div>
                  <Leaf className="text-blue-600" size={20} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Coût par kilomètre</p>
                    <p className="text-2xl font-bold text-purple-900">
                      €{result.costPerKm.toFixed(3)}
                    </p>
                  </div>
                  <Route className="text-purple-600" size={20} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-800">Retour sur investissement</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {result.paybackPeriod} mois
                    </p>
                  </div>
                  <Clock className="text-orange-600" size={20} />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-4">Évolution des Économies</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), "Économies cumulées"]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 bg-green-600 text-white hover:bg-green-700">
                <FileText className="mr-2" size={16} />
                Générer Proposition PDF
              </Button>
              <Button variant="outline" className="flex-1">
                <Share className="mr-2" size={16} />
                Partager par Email
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import Navigation from "@/components/navigation";
import ROICalculator from "@/components/roi-calculator";

export default function Calculator() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Calculateur ROI</h1>
          <p className="text-slate-600">Calculez le retour sur investissement pour vos clients</p>
        </div>

        {/* ROI Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ROICalculator />
          
          {/* Tips and Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Conseils de Calcul</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Taille de flotte précise</p>
                    <p className="text-xs text-slate-600">Incluez tous les véhicules éligibles au rechapage</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Kilomètres annuels</p>
                    <p className="text-xs text-slate-600">Utilisez la moyenne réelle de votre flotte</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Prix carburant</p>
                    <p className="text-xs text-slate-600">Prix moyen au Québec: 1,55 $/L</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Avantages du Rechapage</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-green-800">Économies jusqu'à 50% vs pneus neufs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-green-800">Réduction significative de CO₂</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-green-800">Même performance qu'un pneu neuf</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-green-800">Durée de vie prolongée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
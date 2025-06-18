import React from "react";

interface ValuationToolData {
  current_metrics?: {
    ebitda: number;
  };
  valuation_estimates?: {
    ebitda_valuation: number;
  };
  valuation_factors?: {
    positive_factors: Array<{
      factor: string;
      impact_level: string;
    }>;
  };
}

interface ValuationToolProps {
  mockFinancialData?: {
    ebitda: number;
  };
  apiData?: ValuationToolData;
  ebitdaMultiplier: number;
  setEbitdaMultiplier: (value: number) => void;
  formatCurrency: (amount: number) => string;
}

const ValuationTool: React.FC<ValuationToolProps> = ({ mockFinancialData, apiData, ebitdaMultiplier, setEbitdaMultiplier, formatCurrency }) => {
  // Use API data if available, otherwise use mock data or default
  const currentEbitda = apiData?.current_metrics?.ebitda || mockFinancialData?.ebitda || 0;
  const valuation = apiData?.valuation_estimates?.ebitda_valuation || currentEbitda * ebitdaMultiplier;

  // Get valuation factors from API data or use defaults
  const valuationFactors = apiData?.valuation_factors || {
    positive_factors: [
      { factor: "Strong financial performance increases multiplier", impact_level: "high" },
      { factor: "Prime location and brand recognition add value", impact_level: "medium" },
      { factor: "Growth potential and market position matter", impact_level: "medium" },
      { factor: "Quality of management and operations", impact_level: "high" },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Valuation Calculator</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Valuation Inputs</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">EBITDA</label>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(currentEbitda)}</div>
                <p className="text-xs text-gray-500">Based on your financial data</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">EBITDA Multiplier</label>
                <div className="flex items-center space-x-4">
                  <input type="range" min="4" max="15" step="0.5" value={ebitdaMultiplier} onChange={(e) => setEbitdaMultiplier(parseFloat(e.target.value))} className="flex-1" />
                  <div className="text-xl font-bold text-blue-600 min-w-[60px]">{ebitdaMultiplier}x</div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Restaurant industry range: 4x - 12x</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Valuation Result</h4>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{formatCurrency(valuation)}</div>
                <p className="text-sm text-blue-700">Estimated Company Value</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">EBITDA:</span>
                <span className="font-medium">{formatCurrency(currentEbitda)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Multiplier:</span>
                <span className="font-medium">{ebitdaMultiplier}x</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                <span>Valuation:</span>
                <span>{formatCurrency(valuation)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Multiplier Guidelines</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span className="text-sm text-red-800">Struggling (4x - 6x)</span>
              <span className="text-xs text-red-600">Low profitability, high risk</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span className="text-sm text-yellow-800">Average (6x - 8x)</span>
              <span className="text-xs text-yellow-600">Stable operations</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm text-green-800">Strong (8x - 10x)</span>
              <span className="text-xs text-green-600">Good growth, profitable</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-sm text-blue-800">Premium (10x - 12x)</span>
              <span className="text-xs text-blue-600">Excellent brand, prime location</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Valuation Factors</h4>
          <div className="space-y-3">
            {valuationFactors.positive_factors?.slice(0, 4).map((factor: { factor: string; impact_level: string }, index: number) => {
              const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"];
              return (
                <div key={index} className="flex items-start">
                  <div className={`w-2 h-2 ${colors[index % colors.length]} rounded-full mt-2 mr-3`}></div>
                  <p className="text-sm text-gray-700">{factor.factor}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuationTool;

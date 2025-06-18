import { SENTIMENT_COLORS } from "@/config/constants";
import type { KeywordData } from "@/types/reviews";
import { ChefHat, Users, Heart, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface KeywordListProps {
  keywords: KeywordData[];
  categoryColor?: string;
  categoryName: string;
}

export function KeywordList({ keywords, categoryColor, categoryName }: KeywordListProps): JSX.Element {
  const maxCount = Math.max(...keywords.map((k) => k.count));

  // Get category-specific trends
  const getCategoryTrends = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food':
        return {
          positive: "Food quality ratings improved by 0.4 points, with \"fresh\" and \"delicious\" mentions up 23%",
          improvement: "Temperature complaints for certain dishes mentioned in 8% of recent reviews"
        };
      case 'service':
        return {
          positive: "Weekend dinner service showing improvement with faster table turnover",
          improvement: "Service speed during peak hours (7-9 PM) receiving more \"slow\" mentions, up 15%"
        };
      case 'ambience':
        return {
          positive: "Ambience scores consistently high across all platforms, \"cozy\" mentions increased 18%",
          improvement: "Noise level complaints during peak dining hours increased by 12%"
        };
      case 'value for money':
        return {
          positive: "Positive value mentions increased 8% with customers praising portion sizes",
          improvement: "Value perception declining with \"expensive\" mentions increasing 12%"
        };
      default:
        return {
          positive: "Overall positive sentiment trending upward",
          improvement: "Areas for improvement identified in recent feedback"
        };
    }
  };

  const trends = getCategoryTrends(categoryName);

  return (
    <div className="space-y-3">
      {/* Positive Trend */}
      <div className="flex items-start p-3 bg-emerald-50 rounded-lg border border-emerald-200">
        <TrendingUp className="w-4 h-4 text-emerald-700 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-emerald-700">{trends.positive}</p>
      </div>
      
      {/* Area for Improvement */}
      <div className="flex items-start p-3 bg-orange-50 rounded-lg border border-orange-200">
        <TrendingDown className="w-4 h-4 text-orange-700 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-orange-700">{trends.improvement}</p>
      </div>

      {/* Keywords List */}
      <div className="space-y-1">
        {keywords.map((keyword, index) => (
          <div key={index} className="py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-3 ${SENTIMENT_COLORS[keyword.sentiment].bg} ${SENTIMENT_COLORS[keyword.sentiment].text}`}>
                  {keyword.sentiment === "positive" ? "Positive" : "Negative"}
                </span>
                <span className="text-gray-900 font-semibold">{keyword.word}</span>
              </div>
              <span className="text-gray-600 text-sm font-medium">{keyword.count} mentions</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
              <div
                className={`h-2 rounded-full ${categoryColor || SENTIMENT_COLORS[keyword.sentiment].bar} bg-opacity-50`}
                style={{ width: `${(keyword.count / maxCount) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
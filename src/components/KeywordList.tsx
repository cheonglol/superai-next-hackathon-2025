import { SENTIMENT_COLORS } from "@/config/constants";
import type { KeywordData } from "@/types/reviews";

interface KeywordListProps {
  keywords: KeywordData[];
  categoryColor?: string;
}

export function KeywordList({ keywords, categoryColor }: KeywordListProps): JSX.Element {
  const maxCount = Math.max(...keywords.map((k) => k.count));

  return (
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
          </div>{" "}
          <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
            <div
              className={`h-2 rounded-full ${categoryColor || SENTIMENT_COLORS[keyword.sentiment].bar} bg-opacity-50`}
              style={{ width: `${(keyword.count / maxCount) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

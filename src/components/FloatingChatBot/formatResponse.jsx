// src/components/FloatingChatBot/formatResponse.js
import React from 'react';

/**
 * Transforms the chatbot's text response into JSX,
 * supporting bullet points, numbered lists, etc.
 */
export default function formatResponse(content) {
  // Remove double asterisks if present
  const cleanContent = content.replace(/\*\*/g, '');

  // Helper: bullet point
  const formatBulletPoint = (text, symbol = '•') => (
    <div className="flex gap-2 text-xs md:text-sm w-full pl-2">
      <span className="flex-shrink-0">{symbol}</span>
      <span className="flex-1">{text.trim()}</span>
    </div>
  );

  // Case 1: Dash-based bullet points
  if (cleanContent.includes('\n-')) {
    const [intro, ...bulletPoints] = cleanContent.split('\n-');
    return (
      <div className="flex flex-col gap-2 md:gap-3 w-full">
        {intro && (
          <div className="text-xs md:text-sm w-full text-left mb-2">
            {intro.trim()}
          </div>
        )}
        <div className="flex flex-col gap-2 md:gap-3 w-full">
          {bulletPoints.map((point, index) => formatBulletPoint(point))}
        </div>
      </div>
    );
  }

  // Case 2: Numbered list with "1)" format
  if (cleanContent.match(/\d+\)/)) {
    const parts = cleanContent.split(/(?=\d+\))/);
    const intro = parts[0].trim();
    const items = parts.slice(1);

    return (
      <div className="flex flex-col gap-2 md:gap-3 w-full">
        {intro && (
          <div className="text-xs md:text-sm w-full text-left mb-2">
            {intro}
          </div>
        )}
        <div className="flex flex-col gap-2 md:gap-3 w-full pl-2">
          {items.map((item, index) => {
            const itemContent = item.replace(/^\d+\)\s*/, '').trim();
            return (
              <div key={index} className="flex gap-2 text-xs md:text-sm w-full">
                <span className="flex-shrink-0 font-medium">
                  {index + 1})
                </span>
                <span className="flex-1">
                  {itemContent}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Case 3: Numbered list with "1." format & possible sub-points
  if (cleanContent.match(/\d+\./)) {
    const parts = cleanContent.split(/(?=\d+\.)/);
    const intro = parts[0].trim();
    const items = parts.slice(1);

    return (
      <div className="flex flex-col gap-2 md:gap-3 w-full">
        {intro && (
          <div className="text-xs md:text-sm w-full text-left mb-2">
            {intro}
          </div>
        )}
        <div className="flex flex-col gap-3 md:gap-4 w-full pl-2">
          {items.map((item, index) => {
            const [mainPoint, ...subPoints] = item.split(/(?=\s*-\s)/);
            const [number, ...contentParts] = mainPoint.trim().split(/\s(.+)/);
            const content = contentParts.join(' ').trim();

            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-2 text-xs md:text-sm w-full">
                  <span className="flex-shrink-0 font-medium">
                    {number}
                  </span>
                  <span className="flex-1 font-medium">
                    {content}
                  </span>
                </div>
                {subPoints.length > 0 && (
                  <div className="flex flex-col gap-1 pl-6">
                    {subPoints.map((subPoint, subIndex) =>
                      formatBulletPoint(subPoint.replace(/^-/, ''), '•')
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Case 4: Just plain text
  return (
    <div className="text-xs md:text-sm w-full text-left whitespace-pre-wrap">
      {cleanContent}
    </div>
  );
}
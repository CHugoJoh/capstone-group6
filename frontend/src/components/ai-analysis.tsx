import React from "react";
import ReactMarkdown from "react-markdown";

export default function AIAnalysis({ aiResult }: { aiResult?: string | null }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-3xl mt-10">
      <h3 className="font-semibold mb-5 text-lg">AI Analysis Results:</h3>

      {aiResult ? (
        <div
          className="
            prose dark:prose-invert max-w-none 
            prose-headings:mt-6 prose-headings:mb-3 
            prose-p:my-3 
            prose-ul:my-3 prose-ol:my-3 
            prose-li:my-1
            prose-hr:my-6
            leading-relaxed
          "
        >
          <ReactMarkdown>{aiResult}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-gray-500">No analysis yet.</p>
      )}
    </div>
  );
}
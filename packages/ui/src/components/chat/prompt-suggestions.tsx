interface PromptSuggestionsProps {
  label: string;
  append: (message: { role: "user"; content: string }) => void;
  suggestions: string[];
}

export function PromptSuggestions({
  label,
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="mx-auto mt-auto max-w-4xl space-y-6">
      <h2 className="text-center font-bold text-2xl">{label}</h2>
      <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-3">
        {suggestions.map((suggestion) => (
          <button
            type="button"
            key={suggestion}
            onClick={() => append({ role: "user", content: suggestion })}
            className="min-h-40 flex-1 rounded-xl border bg-background p-4 leading-relaxed transition-colors hover:bg-muted"
          >
            <p>{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

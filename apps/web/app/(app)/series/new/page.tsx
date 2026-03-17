import SeriesForm from "./series-form";

export default function NewSeriesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Create series</h1>
        <p className="mt-1 text-sm text-slate-300">
          Define your content series defaults.
        </p>
      </header>
      <SeriesForm />
    </div>
  );
}

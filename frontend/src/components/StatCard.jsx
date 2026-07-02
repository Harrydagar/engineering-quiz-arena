function StatCard({ title, value }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm font-medium tracking-wide text-gray-500">
        {title}
      </p>

      <h3 className="mt-3 text-3xl font-bold text-gray-900">
        {value}
      </h3>
    </div>
  );
}

export default StatCard;
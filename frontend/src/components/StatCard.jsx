function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-sm font-medium text-gray-500">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}

export default StatCard;
import React from 'react';

const RankBadge = ({ n }) => (
  <div className="h-7 w-7 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">{n}</div>
);

const TopItem = ({ item }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-100">
    <RankBadge n={item.rank} />
    <div className="h-9 w-9 rounded-md bg-green-50 border border-green-100 overflow-hidden flex items-center justify-center">
      {/* Thumbnail placeholder */}
      <span className="text-green-600 text-xs">IMG</span>
    </div>
    <div className="flex-1">
      <div className="text-sm font-semibold text-gray-800">{item.name}</div>
      <div className="text-xs text-gray-500">{item.quantity} {item.unit} vendidos</div>
    </div>
    <div className="text-right">
      <div className="text-emerald-700 font-bold">{item.revenue}</div>
      <div className="text-xs text-emerald-600">{item.percentage}</div>
    </div>
  </div>
);

const TopProductos = ({ items = [], title = 'Top 5 Productos', loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-14 bg-gray-100 rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          items.map((it, idx) => <TopItem key={idx} item={it} />)
        )}
      </div>
    </div>
  );
};

export default React.memo(TopProductos);
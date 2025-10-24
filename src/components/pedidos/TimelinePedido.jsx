import React from 'react';
import { FaCheckCircle, FaDotCircle } from 'react-icons/fa';

// events: [{ key, label, dateLabel, status: 'done' | 'current' | 'pending' }]
const TimelinePedido = ({ events = [] }) => {
  return (
    <div className="bg-green-50 rounded-md p-4">
      <ul className="space-y-2">
        {events.map((ev, idx) => {
          const isDone = ev.status === 'done';
          const isCurrent = ev.status === 'current';
          return (
            <li key={ev.key || idx} className="flex items-start">
              <div className="mr-3 mt-0.5">
                {isDone ? (
                  <FaCheckCircle className="text-green-600" />
                ) : isCurrent ? (
                  <FaDotCircle className="text-green-600" />
                ) : (
                  <span className="inline-block w-4 h-4 rounded-full bg-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <div className={`text-sm ${isDone || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>{ev.label}</div>
                {ev.dateLabel && (
                  <div className="text-xs text-gray-500">{ev.dateLabel}</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TimelinePedido;
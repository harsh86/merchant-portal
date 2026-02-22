import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfWeek, addDays, isSameDay } from 'date-fns';
import { chartColors } from '../../utils/chartConfig';

/**
 * Calendar heatmap showing transaction density
 * Features: color intensity by volume, last 90 days, click to filter
 */
const HeatmapChart = ({ data = [], title, subtitle, onDateClick }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  // Generate last 90 days
  const today = new Date();
  const days = Array.from({ length: 90 }, (_, i) => subDays(today, 89 - i));

  // Get data for a specific date
  const getDateData = (date) => {
    return data.find(d => isSameDay(new Date(d.date), date)) || { volume: 0, count: 0 };
  };

  // Calculate color intensity based on volume
  const getColorIntensity = (volume) => {
    if (!data.length) return 'rgba(59, 130, 246, 0.1)';

    const maxVolume = Math.max(...data.map(d => d.volume));
    const intensity = maxVolume > 0 ? volume / maxVolume : 0;

    if (intensity === 0) return 'rgba(71, 85, 105, 0.3)';
    if (intensity < 0.2) return 'rgba(59, 130, 246, 0.3)';
    if (intensity < 0.4) return 'rgba(59, 130, 246, 0.5)';
    if (intensity < 0.6) return 'rgba(59, 130, 246, 0.7)';
    if (intensity < 0.8) return 'rgba(59, 130, 246, 0.9)';
    return 'rgba(59, 130, 246, 1)';
  };

  // Group days by week
  const weeks = [];
  let currentWeek = [];

  days.forEach((day, index) => {
    if (index === 0) {
      const weekStart = startOfWeek(day);
      const dayOfWeek = day.getDay();
      // Fill empty cells at the start
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(null);
      }
    }

    currentWeek.push(day);

    if (currentWeek.length === 7 || index === days.length - 1) {
      // Fill remaining cells if needed
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    onDateClick?.(date);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-block min-w-full">
          {/* Week day labels */}
          <div className="flex mb-2">
            <div className="w-12"></div>
            {weekDays.map((day) => (
              <div
                key={day}
                className="flex-1 min-w-[14px] text-center text-xs text-gray-400 font-medium"
              >
                {day.slice(0, 1)}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex">
                {/* Week number */}
                <div className="w-12 pr-2 flex items-center justify-end">
                  <span className="text-xs text-gray-400">
                    {week[0] ? `W${Math.ceil((weekIndex + 1) / 4)}` : ''}
                  </span>
                </div>

                {/* Days */}
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={dayIndex} className="flex-1 min-w-[14px] aspect-square m-0.5" />;
                  }

                  const dateData = getDateData(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isHovered = hoveredDate && isSameDay(day, hoveredDate);

                  return (
                    <motion.div
                      key={dayIndex}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: (weekIndex * 7 + dayIndex) * 0.002 }}
                      className="flex-1 min-w-[14px] aspect-square m-0.5"
                    >
                      <div
                        onClick={() => handleDateClick(day)}
                        onMouseEnter={() => setHoveredDate(day)}
                        onMouseLeave={() => setHoveredDate(null)}
                        className={`w-full h-full rounded cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-white scale-110' : ''
                        } ${isHovered ? 'scale-110' : ''}`}
                        style={{
                          backgroundColor: getColorIntensity(dateData.volume),
                          boxShadow: isHovered ? `0 0 10px ${getColorIntensity(dateData.volume)}` : 'none',
                        }}
                        title={`${format(day, 'MMM dd, yyyy')}: ${dateData.count} transactions`}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Less</span>
          <div className="flex gap-1">
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor:
                    intensity === 0
                      ? 'rgba(71, 85, 105, 0.3)'
                      : `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">More</span>
        </div>

        {/* Hovered/Selected date info */}
        {(hoveredDate || selectedDate) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-gray-300"
          >
            {format(hoveredDate || selectedDate, 'MMM dd, yyyy')}:{' '}
            <span className="font-bold text-white">
              {getDateData(hoveredDate || selectedDate).count} transactions
            </span>
          </motion.div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Busiest Day</p>
          <p className="text-sm font-bold text-white">
            {data.length > 0
              ? format(new Date(data.reduce((max, d) => d.volume > max.volume ? d : max, data[0]).date), 'MMM dd')
              : 'N/A'
            }
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Avg per Day</p>
          <p className="text-sm font-bold text-white">
            {data.length > 0
              ? Math.round(data.reduce((sum, d) => sum + d.count, 0) / data.length)
              : 0
            }
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Total Days</p>
          <p className="text-sm font-bold text-white">90</p>
        </div>
      </div>
    </motion.div>
  );
};

export default HeatmapChart;

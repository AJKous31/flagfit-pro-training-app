import React, { useState, useEffect } from 'react';

const TrainingCalendar = ({ onScheduleWorkout, scheduledWorkouts = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [calendarView, setCalendarView] = useState('month'); // 'month' or 'week'

  // Get calendar data
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Check if date has scheduled workout
  const getWorkoutsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toDateString();
    return scheduledWorkouts.filter(workout => 
      new Date(workout.date).toDateString() === dateStr
    );
  };

  // Get week view data
  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = (date) => {
    return date && date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    return date && date < today && !isToday(date);
  };

  const navigateCalendar = (direction) => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    if (!date || isPastDate(date)) return;
    setSelectedDate(date);
    setShowScheduleModal(true);
  };

  const workoutTypes = [
    { id: 'routes', name: 'Route Running', icon: '🏃', color: 'bg-blue-500' },
    { id: 'speed', name: 'Speed Training', icon: '⚡', color: 'bg-yellow-500' },
    { id: 'plyometrics', name: 'Plyometrics', icon: '🏋️', color: 'bg-purple-500' },
    { id: 'catching', name: 'Catching', icon: '🎯', color: 'bg-green-500' },
    { id: 'strength', name: 'Strength', icon: '💪', color: 'bg-red-500' },
    { id: 'recovery', name: 'Recovery', icon: '🧘', color: 'bg-teal-500' },
    { id: 'rest', name: 'Rest Day', icon: '😴', color: 'bg-gray-500' }
  ];

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-400">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((date, index) => {
          const workouts = getWorkoutsForDate(date);
          const isClickable = date && !isPastDate(date);
          
          return (
            <div
              key={index}
              onClick={() => isClickable && handleDateClick(date)}
              className={`min-h-[80px] p-2 border border-white/20 transition-all ${
                !date 
                  ? 'bg-transparent' 
                  : isPastDate(date)
                  ? 'bg-gray-800/50 text-gray-500'
                  : isToday(date)
                  ? 'bg-blue-600/30 border-blue-400'
                  : isClickable
                  ? 'bg-white/10 hover:bg-white/20 cursor-pointer'
                  : 'bg-white/5'
              }`}
            >
              {date && (
                <>
                  <div className={`text-sm font-semibold ${
                    isToday(date) ? 'text-blue-300' : 'text-white'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  {/* Workout indicators */}
                  <div className="space-y-1 mt-1">
                    {workouts.slice(0, 2).map((workout, idx) => {
                      const type = workoutTypes.find(t => t.id === workout.type);
                      return (
                        <div
                          key={idx}
                          className={`text-xs px-1 py-0.5 rounded text-white truncate ${type?.color || 'bg-gray-500'}`}
                        >
                          {type?.icon} {workout.name || type?.name}
                        </div>
                      );
                    })}
                    {workouts.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{workouts.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((date, index) => {
          const workouts = getWorkoutsForDate(date);
          const isClickable = !isPastDate(date);
          
          return (
            <div
              key={index}
              onClick={() => isClickable && handleDateClick(date)}
              className={`p-4 rounded-lg min-h-[200px] transition-all ${
                isPastDate(date)
                  ? 'bg-gray-800/50 text-gray-500'
                  : isToday(date)
                  ? 'bg-blue-600/30 border border-blue-400'
                  : isClickable
                  ? 'bg-white/10 hover:bg-white/20 cursor-pointer'
                  : 'bg-white/5'
              }`}
            >
              <div className="text-center mb-3">
                <div className="text-sm text-gray-400">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-xl font-bold ${
                  isToday(date) ? 'text-blue-300' : 'text-white'
                }`}>
                  {date.getDate()}
                </div>
              </div>
              
              {/* Workouts */}
              <div className="space-y-2">
                {workouts.map((workout, idx) => {
                  const type = workoutTypes.find(t => t.id === workout.type);
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded text-xs text-white ${type?.color || 'bg-gray-500'}`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{type?.icon}</span>
                        <span className="font-semibold">{workout.name || type?.name}</span>
                      </div>
                      {workout.time && (
                        <div className="text-white/80 mt-1">{workout.time}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Training Calendar</h2>
          <p className="text-blue-200">Plan your training schedule</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-white/20 rounded-lg p-1">
          <button
            onClick={() => setCalendarView('month')}
            className={`px-4 py-2 rounded-md transition-colors ${
              calendarView === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setCalendarView('week')}
            className={`px-4 py-2 rounded-md transition-colors ${
              calendarView === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateCalendar(-1)}
          className="p-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-xl font-semibold text-white">
          {currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h3>
        
        <button
          onClick={() => navigateCalendar(1)}
          className="p-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar */}
      {calendarView === 'month' ? renderMonthView() : renderWeekView()}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex flex-wrap gap-3">
          {workoutTypes.map(type => (
            <div key={type.id} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded ${type.color}`}></div>
              <span className="text-sm text-gray-300">{type.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Schedule Workout</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-blue-200 mb-6">{formatDate(selectedDate)}</p>
            
            <div className="grid grid-cols-2 gap-3">
              {workoutTypes.slice(0, -1).map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    onScheduleWorkout && onScheduleWorkout({
                      date: selectedDate,
                      type: type.id,
                      name: type.name
                    });
                    setShowScheduleModal(false);
                  }}
                  className={`p-4 rounded-lg text-white font-semibold transition-all hover:scale-105 ${type.color}`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm">{type.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingCalendar;
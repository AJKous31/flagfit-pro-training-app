import React, { useCallback, useMemo } from 'react';
import { usePocket } from '../contexts/PocketContext';
import { useTraining } from '../contexts/TrainingContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardView = React.memo(function DashboardView() {
  const { user, logout } = usePocket();
  const { stats, sessions, isLoading: trainingLoading } = useTraining();
  const { isLoading: analyticsLoading } = useAnalytics();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  // Memoize stats cards to prevent unnecessary re-renders
  const statsCards = useMemo(() => [
    {
      label: 'Total Sessions',
      value: stats.totalSessions,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
      label: 'Total Duration',
      value: `${Math.round(stats.totalDuration / 60)}h`,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      label: 'Average Score',
      value: stats.averageScore.toFixed(1),
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    {
      label: 'Streak Days',
      value: stats.streakDays,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
    }
  ], [stats]);

  // Memoize recent sessions to prevent unnecessary re-renders
  const recentSessions = useMemo(() => 
    sessions.slice(0, 5)
  , [sessions]);

  if (trainingLoading || analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                FlagFit Pro Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700" aria-label={`Welcome ${user?.firstName} ${user?.lastName}`}>
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                aria-label="Logout from application"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" role="main">
        {/* Stats Grid */}
        <section aria-labelledby="stats-heading" className="mb-8">
          <h2 id="stats-heading" className="sr-only">Training Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card) => (
              <div key={card.label} className="card" role="group" aria-labelledby={`stat-${card.label.replace(/\s+/g, '-').toLowerCase()}`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${card.bgColor} rounded-md flex items-center justify-center`} aria-hidden="true">
                      <svg className={`w-5 h-5 ${card.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.iconPath} />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p id={`stat-${card.label.replace(/\s+/g, '-').toLowerCase()}`} className="text-sm font-medium text-gray-500">{card.label}</p>
                    <p className="text-2xl font-semibold text-gray-900" aria-describedby={`stat-${card.label.replace(/\s+/g, '-').toLowerCase()}`}>{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Sessions */}
        <section aria-labelledby="recent-sessions-heading" className="card">
          <h2 id="recent-sessions-heading" className="text-lg font-medium text-gray-900 mb-4">Recent Training Sessions</h2>
          {sessions.length > 0 ? (
            <div className="space-y-4" role="list" aria-label="Recent training sessions">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" role="listitem">
                  <div>
                    <h3 className="font-medium text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-500">
                      <time dateTime={session.date}>{new Date(session.date).toLocaleDateString()}</time> • {session.duration} minutes
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" aria-label={`Session score: ${session.score}`}>
                      Score: {session.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8" role="status">No training sessions yet. Start your first session!</p>
          )}
        </section>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="card hover:shadow-lg transition-shadow cursor-pointer text-left">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Start Training</h3>
                <p className="text-sm text-gray-500">Begin a new session</p>
              </div>
            </div>
          </button>

          <button className="card hover:shadow-lg transition-shadow cursor-pointer text-left">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">View Progress</h3>
                <p className="text-sm text-gray-500">Check your stats</p>
              </div>
            </div>
          </button>

          <button className="card hover:shadow-lg transition-shadow cursor-pointer text-left">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Profile</h3>
                <p className="text-sm text-gray-500">Update your settings</p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
});

export default DashboardView; 
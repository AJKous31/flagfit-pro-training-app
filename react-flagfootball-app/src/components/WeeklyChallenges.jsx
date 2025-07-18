import React, { useState, useEffect } from 'react';

const WeeklyChallenges = ({ onBack }) => {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Sample weekly challenges data
  const weeklyChallenges = [
    {
      id: 'speed-week',
      title: 'Speed Demon Week',
      description: 'Focus on explosive speed and acceleration drills',
      duration: '7 days',
      difficulty: 'Intermediate',
      participants: 234,
      xpReward: 500,
      badge: '⚡ Speed Demon Master',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-07-22'),
      status: 'active',
      requirements: [
        'Complete 5 sprint drills with perfect form',
        'Achieve sub-5 second 40-yard dash',
        'Complete 3 acceleration ladder sessions',
        'Maintain 90%+ attendance rate'
      ],
      dailyTasks: [
        { day: 1, task: 'Sprint Mechanics Analysis', completed: true, xp: 50 },
        { day: 2, task: '40-yard dash baseline', completed: true, xp: 75 },
        { day: 3, task: 'Acceleration ladder drills', completed: false, xp: 60 },
        { day: 4, task: 'Rest day - form review', completed: false, xp: 30 },
        { day: 5, task: 'Speed endurance training', completed: false, xp: 80 },
        { day: 6, task: 'Competition simulation', completed: false, xp: 90 },
        { day: 7, task: 'Final assessment', completed: false, xp: 100 }
      ]
    },
    {
      id: 'route-mastery',
      title: 'Route Running Mastery',
      description: 'Perfect your route running technique and precision',
      duration: '7 days',
      difficulty: 'Advanced',
      participants: 187,
      xpReward: 600,
      badge: '🎯 Route Master Elite',
      startDate: new Date('2024-07-22'),
      endDate: new Date('2024-07-29'),
      status: 'upcoming',
      requirements: [
        'Master 8 different route types',
        'Achieve 95%+ route precision',
        'Complete video form analysis',
        'Participate in peer feedback session'
      ],
      dailyTasks: [
        { day: 1, task: 'Slant and comeback routes', completed: false, xp: 60 },
        { day: 2, task: 'Out and curl patterns', completed: false, xp: 65 },
        { day: 3, task: 'Double move combinations', completed: false, xp: 80 },
        { day: 4, task: 'Video analysis session', completed: false, xp: 40 },
        { day: 5, task: 'Post and fade routes', completed: false, xp: 70 },
        { day: 6, task: 'Precision timing drills', completed: false, xp: 85 },
        { day: 7, task: 'Route mastery assessment', completed: false, xp: 100 }
      ]
    },
    {
      id: 'strength-foundation',
      title: 'Strength Foundation Builder',
      description: 'Build functional strength for explosive flag football performance',
      duration: '7 days',
      difficulty: 'Beginner',
      participants: 312,
      xpReward: 400,
      badge: '💪 Foundation Master',
      startDate: new Date('2024-07-29'),
      endDate: new Date('2024-08-05'),
      status: 'upcoming',
      requirements: [
        'Complete all bodyweight progressions',
        'Maintain proper form throughout',
        'Log daily recovery metrics',
        'Complete mobility assessments'
      ],
      dailyTasks: [
        { day: 1, task: 'Bodyweight assessment', completed: false, xp: 40 },
        { day: 2, task: 'Push-up progressions', completed: false, xp: 55 },
        { day: 3, task: 'Squat variations', completed: false, xp: 60 },
        { day: 4, task: 'Core stability training', completed: false, xp: 50 },
        { day: 5, task: 'Plyometric introduction', completed: false, xp: 70 },
        { day: 6, task: 'Full-body integration', completed: false, xp: 75 },
        { day: 7, task: 'Progress assessment', completed: false, xp: 90 }
      ]
    }
  ];

  const completedChallenges = [
    {
      id: 'agility-master',
      title: 'Agility Master Challenge',
      completed: true,
      completedDate: new Date('2024-07-08'),
      finalScore: 487,
      maxScore: 500,
      rank: 12,
      badge: '🏃 Agility Master'
    },
    {
      id: 'catching-clinic',
      title: 'Catching Clinic Week',
      completed: true,
      completedDate: new Date('2024-07-01'),
      finalScore: 520,
      maxScore: 550,
      rank: 8,
      badge: '🙌 Catch King'
    }
  ];

  useEffect(() => {
    // Set active challenge (most recent active)
    const active = weeklyChallenges.find(c => c.status === 'active');
    setActiveChallenge(active);

    // Initialize user progress
    const initialProgress = {};
    weeklyChallenges.forEach(challenge => {
      initialProgress[challenge.id] = {
        enrolled: challenge.status === 'active',
        completedTasks: challenge.dailyTasks.filter(t => t.completed).length,
        totalXP: challenge.dailyTasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp, 0)
      };
    });
    setUserProgress(initialProgress);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (challenge) => {
    const progress = userProgress[challenge.id];
    if (!progress) return 0;
    return (progress.completedTasks / challenge.dailyTasks.length) * 100;
  };

  const handleJoinChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setShowJoinModal(true);
  };

  const confirmJoinChallenge = () => {
    if (selectedChallenge) {
      setUserProgress(prev => ({
        ...prev,
        [selectedChallenge.id]: {
          enrolled: true,
          completedTasks: 0,
          totalXP: 0
        }
      }));
      setShowJoinModal(false);
      setSelectedChallenge(null);
    }
  };

  const completeTask = (challengeId, taskIndex) => {
    setUserProgress(prev => {
      const challenge = weeklyChallenges.find(c => c.id === challengeId);
      const task = challenge.dailyTasks[taskIndex];
      const currentProgress = prev[challengeId] || { enrolled: true, completedTasks: 0, totalXP: 0 };
      
      return {
        ...prev,
        [challengeId]: {
          ...currentProgress,
          completedTasks: currentProgress.completedTasks + 1,
          totalXP: currentProgress.totalXP + task.xp
        }
      };
    });

    // Mark task as completed in the challenge data
    const challenge = weeklyChallenges.find(c => c.id === challengeId);
    challenge.dailyTasks[taskIndex].completed = true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Training</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-2">Weekly Challenges</h1>
        <p className="text-blue-200 mb-8">Join structured challenges to accelerate your progress and compete with the community</p>

        {/* Active Challenge Spotlight */}
        {activeChallenge && userProgress[activeChallenge.id]?.enrolled && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <h2 className="text-2xl font-bold">Active Challenge</h2>
                    <p className="text-green-100">You're currently participating</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{userProgress[activeChallenge.id].totalXP}</div>
                  <div className="text-green-100">XP Earned</div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{activeChallenge.title}</h3>
              <p className="text-green-100 mb-4">{activeChallenge.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-green-200 text-sm">Progress</span>
                    <div className="text-lg font-bold">
                      {userProgress[activeChallenge.id].completedTasks}/{activeChallenge.dailyTasks.length} tasks
                    </div>
                  </div>
                  <div>
                    <span className="text-green-200 text-sm">Ends</span>
                    <div className="text-lg font-bold">{formatDate(activeChallenge.endDate)}</div>
                  </div>
                </div>
                <div className="w-32">
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${getProgressPercentage(activeChallenge)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-green-200 mt-1">
                    {Math.round(getProgressPercentage(activeChallenge))}% complete
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Challenges */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Available Challenges</h2>
            <div className="space-y-6">
              {weeklyChallenges.map(challenge => {
                const progress = userProgress[challenge.id];
                const isEnrolled = progress?.enrolled;
                
                return (
                  <div
                    key={challenge.id}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transition-all hover:bg-white/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold">{challenge.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(challenge.status)}`}>
                            {challenge.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{challenge.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Duration:</span>
                            <div className="font-semibold">{challenge.duration}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Participants:</span>
                            <div className="font-semibold">{challenge.participants}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">XP Reward:</span>
                            <div className="font-semibold text-yellow-400">{challenge.xpReward}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar for enrolled challenges */}
                    {isEnrolled && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{progress.completedTasks}/{challenge.dailyTasks.length} tasks</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${getProgressPercentage(challenge)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {challenge.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center space-x-2">
                            <span className="text-blue-400">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-3">
                      {!isEnrolled && challenge.status !== 'completed' && (
                        <button
                          onClick={() => handleJoinChallenge(challenge)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Join Challenge
                        </button>
                      )}
                      {isEnrolled && (
                        <button
                          onClick={() => setActiveChallenge(challenge)}
                          className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition-colors"
                        >
                          View Daily Tasks
                        </button>
                      )}
                      <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Challenge Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Your Challenge Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Challenges Completed</span>
                  <span className="font-bold text-green-400">{completedChallenges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Challenges</span>
                  <span className="font-bold text-blue-400">
                    {Object.values(userProgress).filter(p => p.enrolled).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Challenge XP</span>
                  <span className="font-bold text-yellow-400">
                    {Object.values(userProgress).reduce((sum, p) => sum + (p.totalXP || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Best Rank</span>
                  <span className="font-bold text-purple-400">
                    #{Math.min(...completedChallenges.map(c => c.rank))}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {completedChallenges.map(challenge => (
                  <div key={challenge.id} className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{challenge.badge.split(' ')[0]}</span>
                      <span className="font-semibold text-sm">{challenge.badge.split(' ').slice(1).join(' ')}</span>
                    </div>
                    <div className="text-xs text-gray-300">
                      Rank #{challenge.rank} • {challenge.finalScore}/{challenge.maxScore} XP
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(challenge.completedDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Leaderboard Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">This Week's Leaders</h3>
              <div className="space-y-2">
                {[
                  { rank: 1, name: 'Alex Chen', xp: 890, badge: '👑' },
                  { rank: 2, name: 'Sarah M.', xp: 845, badge: '🥈' },
                  { rank: 3, name: 'Mike Johnson', xp: 820, badge: '🥉' },
                  { rank: 4, name: 'You', xp: 487, badge: '🔥' },
                  { rank: 5, name: 'Emma Wilson', xp: 445, badge: '⭐' }
                ].map(player => (
                  <div key={player.rank} className={`flex items-center space-x-3 p-2 rounded-lg ${
                    player.name === 'You' ? 'bg-blue-600/20 border border-blue-400' : ''
                  }`}>
                    <span className="text-lg">{player.badge}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{player.name}</div>
                      <div className="text-xs text-gray-400">{player.xp} XP</div>
                    </div>
                    <div className="text-xs text-gray-400">#{player.rank}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Join Challenge Modal */}
        {showJoinModal && selectedChallenge && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold mb-4">Join Challenge</h3>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🏆</div>
                <h4 className="text-xl font-bold mb-2">{selectedChallenge.title}</h4>
                <p className="text-gray-300 mb-4">{selectedChallenge.description}</p>
                
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <div className="text-yellow-400 font-bold text-lg">{selectedChallenge.xpReward} XP</div>
                  <div className="text-sm text-gray-300">Completion Reward</div>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 mb-6 text-center">
                Are you ready to commit to this {selectedChallenge.duration} challenge?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmJoinChallenge}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  Join Challenge!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Daily Tasks Modal (when active challenge is expanded) */}
        {activeChallenge && userProgress[activeChallenge.id]?.enrolled && (
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Daily Tasks - {activeChallenge.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChallenge.dailyTasks.map((task, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    task.completed
                      ? 'bg-green-600/20 border-green-400'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Day {task.day}</span>
                    <span className="text-yellow-400 text-sm font-bold">{task.xp} XP</span>
                  </div>
                  <p className="text-sm mb-3">{task.task}</p>
                  {!task.completed ? (
                    <button
                      onClick={() => completeTask(activeChallenge.id, index)}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Complete Task
                    </button>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-green-300">
                      <span>✓</span>
                      <span className="text-sm font-semibold">Completed</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyChallenges;
import React, { useState, useEffect } from 'react';

const CommunityHub = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [liveUsers, setLiveUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [groupSessions, setGroupSessions] = useState([]);

  // Sample data
  const sampleFeed = [
    {
      id: 1,
      user: 'Alex Rodriguez',
      avatar: '🏃‍♂️',
      action: 'just crushed a 40-yard dash',
      time: '2 minutes ago',
      media: 'video',
      stats: { time: '4.35s', improvement: '+0.12s' },
      likes: 23,
      comments: 5,
      location: 'Training Field A'
    },
    {
      id: 2,
      user: 'Maya Chen',
      avatar: '⚡',
      action: 'completed Elite Route Package',
      time: '15 minutes ago',
      media: 'image',
      stats: { accuracy: '94%', routes: 12 },
      likes: 18,
      comments: 8,
      achievement: 'Route Master Badge Earned!'
    },
    {
      id: 3,
      user: 'Coach Martinez',
      avatar: '🎯',
      action: 'shared a pro tip',
      time: '1 hour ago',
      media: 'text',
      content: 'The key to a perfect slant route is the timing of your head turn. Turn too early and you telegraph the route. Turn at the exact moment of your cut for maximum effectiveness.',
      likes: 47,
      comments: 15,
      isPro: true
    },
    {
      id: 4,
      user: 'Team Lightning',
      avatar: '⚡',
      action: 'started a group training session',
      time: '2 hours ago',
      media: 'live',
      participants: 8,
      maxParticipants: 12,
      likes: 12,
      comments: 3,
      isLive: true
    }
  ];

  const sampleLiveUsers = [
    { id: 1, name: 'Alex R.', avatar: '🏃‍♂️', activity: 'Route Running', level: 'Pro' },
    { id: 2, name: 'Maya C.', avatar: '⚡', activity: 'Speed Training', level: 'Expert' },
    { id: 3, name: 'Jordan K.', avatar: '🎯', activity: 'Catching Drills', level: 'Beginner' },
    { id: 4, name: 'Coach M.', avatar: '🏆', activity: 'Coaching Session', level: 'Master' },
    { id: 5, name: 'Sarah L.', avatar: '💪', activity: 'Strength Training', level: 'Intermediate' }
  ];

  const sampleChallenges = [
    {
      id: 1,
      title: 'Speed Demon Week',
      description: 'Improve your 40-yard dash time by 0.1s',
      participants: 234,
      timeLeft: '3 days',
      reward: '500 XP + Speed Badge',
      difficulty: 'Medium',
      category: 'Speed',
      joined: false
    },
    {
      id: 2,
      title: 'Route Precision Challenge',
      description: 'Complete 50 routes with 90%+ accuracy',
      participants: 156,
      timeLeft: '1 week',
      reward: '750 XP + Precision Master Badge',
      difficulty: 'Hard',
      category: 'Routes',
      joined: true
    },
    {
      id: 3,
      title: 'Team Builder',
      description: 'Train with 10 different teammates',
      participants: 89,
      timeLeft: '2 weeks',
      reward: '300 XP + Social Badge',
      difficulty: 'Easy',
      category: 'Social',
      joined: false
    }
  ];

  const sampleLeaderboard = [
    { rank: 1, name: 'Alex Rodriguez', avatar: '🏃‍♂️', score: 2847, streak: 15, badge: '👑' },
    { rank: 2, name: 'Maya Chen', avatar: '⚡', score: 2653, streak: 12, badge: '🥈' },
    { rank: 3, name: 'Jordan Kim', avatar: '🎯', score: 2534, streak: 8, badge: '🥉' },
    { rank: 4, name: 'Sarah Lopez', avatar: '💪', score: 2389, streak: 6, badge: '🏅' },
    { rank: 5, name: 'You', avatar: '🔥', score: 2156, streak: 7, badge: '⭐', isUser: true }
  ];

  const sampleGroupSessions = [
    {
      id: 1,
      title: 'Elite Route Running Masterclass',
      host: 'Coach Martinez',
      participants: 8,
      maxParticipants: 12,
      startTime: '6:00 PM',
      duration: '90 min',
      level: 'Advanced',
      category: 'Routes',
      isLive: true
    },
    {
      id: 2,
      title: 'Beginner Speed Training',
      host: 'Maya Chen',
      participants: 6,
      maxParticipants: 10,
      startTime: '7:30 PM',
      duration: '60 min',
      level: 'Beginner',
      category: 'Speed',
      isLive: false
    },
    {
      id: 3,
      title: 'Team Lightning Practice',
      host: 'Team Lightning',
      participants: 11,
      maxParticipants: 15,
      startTime: '8:00 PM',
      duration: '120 min',
      level: 'All Levels',
      category: 'Team',
      isLive: false
    }
  ];

  useEffect(() => {
    setLiveUsers(sampleLiveUsers);
    setChallenges(sampleChallenges);
    setLeaderboard(sampleLeaderboard);
    setGroupSessions(sampleGroupSessions);
  }, []);

  const handleLike = (postId) => {
    // In a real app, this would update the backend
    console.log('Liked post:', postId);
  };

  const handleJoinChallenge = (challengeId) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, joined: !challenge.joined, participants: challenge.joined ? challenge.participants - 1 : challenge.participants + 1 }
          : challenge
      )
    );
  };

  const handleJoinSession = (sessionId) => {
    console.log('Joining session:', sessionId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const renderFeed = () => (
    <div className="space-y-6">
      {sampleFeed.map((post) => (
        <div key={post.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
              {post.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">{post.user}</span>
                {post.isPro && <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold">PRO</span>}
                <span className="text-gray-400 text-sm">{post.time}</span>
              </div>
              
              <p className="text-blue-200 mb-3">
                {post.action}
                {post.location && <span className="text-gray-400"> at {post.location}</span>}
              </p>

              {post.content && (
                <p className="text-white bg-blue-600/20 p-3 rounded-lg mb-3 italic">
                  &ldquo;{post.content}&rdquo;
                </p>
              )}

              {post.achievement && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                  🏆 {post.achievement}
                </div>
              )}

              {post.stats && (
                <div className="flex space-x-4 mb-3">
                  {Object.entries(post.stats).map(([key, value]) => (
                    <div key={key} className="bg-white/10 px-3 py-1 rounded-lg">
                      <span className="text-gray-400 text-sm capitalize">{key}: </span>
                      <span className="text-white font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {post.isLive && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block animate-pulse">
                  🔴 LIVE
                </div>
              )}

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                >
                  <span>❤️</span>
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                  <span>💬</span>
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                  <span>🔄</span>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <div key={challenge.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
              <p className="text-blue-200 mb-4">{challenge.description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{challenge.participants}</div>
              <div className="text-xs text-gray-400">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{challenge.timeLeft}</div>
              <div className="text-xs text-gray-400">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{challenge.category}</div>
              <div className="text-xs text-gray-400">Category</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{challenge.reward.split(' ')[0]}</div>
              <div className="text-xs text-gray-400">Reward</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{challenge.reward}</span>
            <button
              onClick={() => handleJoinChallenge(challenge.id)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                challenge.joined 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {challenge.joined ? 'Joined ✓' : 'Join Challenge'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-4">
      {leaderboard.map((user) => (
        <div key={user.rank} className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 ${user.isUser ? 'ring-2 ring-blue-400' : ''}`}>
          <div className="flex items-center space-x-4">
            <div className="text-2xl">{user.badge}</div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              {user.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{user.name}</span>
                {user.isUser && <span className="text-blue-400 text-sm">(You)</span>}
              </div>
              <div className="text-sm text-gray-400">
                {user.score} points • {user.streak} day streak
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">#{user.rank}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGroupSessions = () => (
    <div className="space-y-4">
      {groupSessions.map((session) => (
        <div key={session.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{session.title}</h3>
              <p className="text-blue-200 mb-2">Hosted by {session.host}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>🕒 {session.startTime}</span>
                <span>⏱️ {session.duration}</span>
                <span>📊 {session.level}</span>
              </div>
            </div>
            {session.isLive && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                🔴 LIVE
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {session.participants}/{session.maxParticipants} participants
            </div>
            <button
              onClick={() => handleJoinSession(session.id)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                session.isLive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {session.isLive ? 'Join Live' : 'Join Session'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Community Hub</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex space-x-4 mt-4">
            {[
              { id: 'feed', label: 'Feed', icon: '📱' },
              { id: 'challenges', label: 'Challenges', icon: '🎯' },
              { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
              { id: 'sessions', label: 'Live Sessions', icon: '🔴' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'feed' && renderFeed()}
          {activeTab === 'challenges' && renderChallenges()}
          {activeTab === 'leaderboard' && renderLeaderboard()}
          {activeTab === 'sessions' && renderGroupSessions()}
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
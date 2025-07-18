import React, { useState, useEffect } from 'react';

const BiometricIntegration = ({ onRecommendation }) => {
  const [heartRate, setHeartRate] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [sleepScore, setSleepScore] = useState(0);
  const [recoveryScore, setRecoveryScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  // Simulate biometric data
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate heart rate (60-180 BPM)
      setHeartRate(Math.floor(Math.random() * 120) + 60);
      
      // Simulate sleep score (0-100)
      setSleepScore(Math.floor(Math.random() * 30) + 70);
      
      // Simulate recovery score (0-100)
      setRecoveryScore(Math.floor(Math.random() * 40) + 60);
      
      setIsConnected(true);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Generate AI recommendations based on biometric data
  useEffect(() => {
    if (heartRate > 0 && sleepScore > 0 && recoveryScore > 0) {
      const newRecommendations = generateRecommendations(heartRate, sleepScore, recoveryScore);
      setRecommendations(newRecommendations);
      onRecommendation(newRecommendations);
    }
  }, [heartRate, sleepScore, recoveryScore]);

  const generateRecommendations = (hr, sleep, recovery) => {
    const recs = [];

    // Heart rate based recommendations
    if (hr > 100) {
      recs.push({
        type: 'warning',
        title: 'Elevated Heart Rate',
        message: 'Your resting heart rate is elevated. Consider light recovery work today.',
        action: 'Switch to yoga or stretching',
        priority: 'high'
      });
    } else if (hr < 70) {
      recs.push({
        type: 'positive',
        title: 'Great Recovery',
        message: 'Your heart rate indicates excellent recovery. Perfect for high-intensity training!',
        action: 'Try advanced sprint drills',
        priority: 'medium'
      });
    }

    // Sleep based recommendations
    if (sleep < 70) {
      recs.push({
        type: 'warning',
        title: 'Poor Sleep Quality',
        message: 'Your sleep score is low. Focus on technique over intensity today.',
        action: 'Reduce training intensity by 30%',
        priority: 'high'
      });
    } else if (sleep > 85) {
      recs.push({
        type: 'positive',
        title: 'Excellent Sleep',
        message: 'Great sleep quality! Your body is ready for challenging workouts.',
        action: 'Perfect day for skill development',
        priority: 'low'
      });
    }

    // Recovery based recommendations
    if (recovery < 60) {
      recs.push({
        type: 'warning',
        title: 'Low Recovery Score',
        message: 'Your body needs more recovery time. Consider active rest.',
        action: 'Focus on mobility and light cardio',
        priority: 'high'
      });
    } else if (recovery > 80) {
      recs.push({
        type: 'positive',
        title: 'Fully Recovered',
        message: 'Your recovery metrics are excellent. Time to push your limits!',
        action: 'Increase training intensity',
        priority: 'medium'
      });
    }

    return recs;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRecommendationStyle = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-red-500/20 border-red-500 text-red-100';
      case 'positive':
        return 'bg-green-500/20 border-green-500 text-green-100';
      default:
        return 'bg-blue-500/20 border-blue-500 text-blue-100';
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'Biometric sensors connected' : 'Connecting to sensors...'}
          </span>
        </div>
        <button className="text-blue-400 hover:text-blue-300 text-sm">
          Configure
        </button>
      </div>

      {/* Biometric Data */}
      {isConnected && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{heartRate}</div>
            <div className="text-sm text-gray-400">Heart Rate</div>
            <div className="text-xs text-gray-500">BPM</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${getScoreColor(sleepScore)}`}>{sleepScore}</div>
            <div className="text-sm text-gray-400">Sleep Score</div>
            <div className="text-xs text-gray-500">Last night</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${getScoreColor(recoveryScore)}`}>{recoveryScore}</div>
            <div className="text-sm text-gray-400">Recovery</div>
            <div className="text-xs text-gray-500">Current</div>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">🤖 AI Recommendations</h3>
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${getRecommendationStyle(rec.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{rec.title}</h4>
                  <p className="text-sm opacity-90 mb-2">{rec.message}</p>
                  <div className="text-xs opacity-75">
                    Recommended action: {rec.action}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-500 text-white' :
                  rec.priority === 'medium' ? 'bg-yellow-500 text-black' :
                  'bg-blue-500 text-white'
                }`}>
                  {rec.priority}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium transition-colors">
          📊 View Detailed Analytics
        </button>
        <button className="p-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-medium transition-colors">
          ⚙️ Adjust Training Plan
        </button>
      </div>
    </div>
  );
};

export default BiometricIntegration;
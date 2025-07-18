import React, { useState, useEffect } from 'react';

const DrillDetail = ({ drill, onBack, onStartDrill }) => {
  const [activeTab, setActiveTab] = useState('instructions');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'routes': return '🏃';
      case 'speed': return '⚡';
      case 'plyometrics': return '🏋️';
      case 'catching': return '🎯';
      case 'strength': return '💪';
      case 'recovery': return '🧘';
      default: return '🏈';
    }
  };

  const handleStartTimer = () => {
    setTimerRunning(true);
    onStartDrill && onStartDrill(drill);
  };

  const handleCompleteStep = () => {
    if (currentStep < drill.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      setTimerRunning(false);
    }
  };

  const resetDrill = () => {
    setTimerRunning(false);
    setTimeElapsed(0);
    setCurrentStep(0);
    setCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Library</span>
          </button>
          
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-sm text-blue-200">Training Time</div>
          </div>
        </div>

        {/* Drill Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getCategoryIcon(drill.category)}</div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{drill.name}</h1>
                <p className="text-blue-200 text-lg">{drill.description}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-white font-semibold ${getDifficultyColor(drill.difficulty)}`}>
              {drill.difficulty}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-400">{drill.duration}</div>
              <div className="text-sm text-gray-300">Duration</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-400">{drill.equipment}</div>
              <div className="text-sm text-gray-300">Equipment</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-400">{drill.space}</div>
              <div className="text-sm text-gray-300">Space</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-400">{drill.instructions.length}</div>
              <div className="text-sm text-gray-300">Steps</div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-white/20">
            {[
              { id: 'instructions', label: 'Instructions', icon: '📋' },
              { id: 'keypoints', label: 'Key Points', icon: '🎯' },
              { id: 'variations', label: 'Variations', icon: '🔄' },
              { id: 'mistakes', label: 'Common Mistakes', icon: '⚠️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'instructions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Step-by-Step Instructions</h3>
                  {!completed && (
                    <div className="text-sm text-blue-200">
                      Step {currentStep + 1} of {drill.instructions.length}
                    </div>
                  )}
                </div>

                {drill.instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 transition-all ${
                      index === currentStep && timerRunning
                        ? 'bg-blue-600/20 border-blue-400 scale-105'
                        : index < currentStep || completed
                        ? 'bg-green-600/20 border-green-400'
                        : 'bg-white/10 border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index < currentStep || completed
                          ? 'bg-green-500 text-white'
                          : index === currentStep && timerRunning
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {index < currentStep || completed ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{instruction}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Control Buttons */}
                <div className="flex space-x-4 mt-6">
                  {!timerRunning && !completed && (
                    <button
                      onClick={handleStartTimer}
                      className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Start Drill
                    </button>
                  )}
                  
                  {timerRunning && !completed && (
                    <button
                      onClick={handleCompleteStep}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Complete Step {currentStep + 1}
                    </button>
                  )}
                  
                  {completed && (
                    <div className="flex space-x-4 w-full">
                      <button
                        onClick={resetDrill}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Repeat Drill
                      </button>
                      <button
                        onClick={onBack}
                        className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Complete ✓
                      </button>
                    </div>
                  )}
                </div>

                {completed && (
                  <div className="bg-green-600/20 border border-green-400 rounded-lg p-4 mt-4">
                    <div className="flex items-center space-x-2 text-green-300">
                      <span className="text-xl">🎉</span>
                      <span className="font-semibold">Drill Completed!</span>
                    </div>
                    <p className="text-green-200 mt-2">
                      Total time: {formatTime(timeElapsed)} • Great work on mastering {drill.name}!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'keypoints' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Key Focus Points</h3>
                {drill.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white/10 rounded-lg">
                    <span className="text-yellow-400 text-xl">•</span>
                    <p className="text-white">{point}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'variations' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Drill Variations</h3>
                {drill.variations.map((variation, index) => (
                  <div key={index} className="p-4 bg-white/10 rounded-lg">
                    <p className="text-white">{variation}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'mistakes' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Common Mistakes to Avoid</h3>
                {drill.commonMistakes.map((mistake, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-600/20 border border-red-400 rounded-lg">
                    <span className="text-red-400 text-xl">⚠️</span>
                    <p className="text-red-200">{mistake}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrillDetail;
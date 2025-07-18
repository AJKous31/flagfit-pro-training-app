import React, { useState, useEffect, useRef } from 'react';

const TrainingSession = ({ category, onBack, onComplete }) => {
  const [currentDrill, setCurrentDrill] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [reps, setReps] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [formScore, setFormScore] = useState(0);
  const [showAROverlay, setShowAROverlay] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // Training drills data based on category
  const drillSets = {
    routes: [
      {
        name: 'Quick Slant',
        description: 'Sharp 5-yard cut at precise timing',
        duration: 30,
        reps: 8,
        difficulty: 'Beginner',
        keyPoints: ['Sharp plant foot', 'Quick hip turn', 'Hands ready'],
        video: '/videos/quick-slant.mp4',
        arMarkers: [
          { x: 50, y: 60, label: 'Plant foot here' },
          { x: 70, y: 40, label: 'Cut direction' }
        ]
      },
      {
        name: 'Double Move',
        description: 'Fake inside, break outside at 8 yards',
        duration: 45,
        reps: 6,
        difficulty: 'Advanced',
        keyPoints: ['Sell the first move', 'Explosive second cut', 'Maintain speed'],
        video: '/videos/double-move.mp4',
        arMarkers: [
          { x: 50, y: 70, label: 'First fake' },
          { x: 80, y: 30, label: 'Real break' }
        ]
      },
      {
        name: 'Comeback Route',
        description: 'Drive 12 yards, turn and settle',
        duration: 40,
        reps: 5,
        difficulty: 'Intermediate',
        keyPoints: ['Full speed drive', 'Quick turn', 'Present target'],
        video: '/videos/comeback.mp4',
        arMarkers: [
          { x: 50, y: 20, label: 'Turn point' },
          { x: 50, y: 60, label: 'Settle here' }
        ]
      }
    ],
    plyometrics: [
      {
        name: 'Depth Jumps',
        description: 'Step off box, land and explode up',
        duration: 45,
        reps: 10,
        difficulty: 'Intermediate',
        keyPoints: ['Soft landing', 'Immediate explosion', 'Full extension'],
        video: '/videos/depth-jumps.mp4',
        arMarkers: [
          { x: 50, y: 80, label: 'Landing zone' },
          { x: 50, y: 20, label: 'Max height' }
        ]
      },
      {
        name: 'Lateral Bounds',
        description: 'Single-leg lateral jumps with hold',
        duration: 35,
        reps: 12,
        difficulty: 'Beginner',
        keyPoints: ['Single leg power', 'Stable landing', 'Opposite arm drive'],
        video: '/videos/lateral-bounds.mp4',
        arMarkers: [
          { x: 30, y: 50, label: 'Left target' },
          { x: 70, y: 50, label: 'Right target' }
        ]
      }
    ],
    sprints: [
      {
        name: 'Acceleration Sprints',
        description: '20-yard builds from 0 to max speed',
        duration: 60,
        reps: 6,
        difficulty: 'Intermediate',
        keyPoints: ['Low start position', 'Gradual rise', 'Pump arms'],
        video: '/videos/acceleration.mp4',
        arMarkers: [
          { x: 10, y: 50, label: 'Start' },
          { x: 90, y: 50, label: 'Finish' }
        ]
      }
    ]
  };

  const currentDrillSet = drillSets[category] || drillSets.routes;
  const drill = currentDrillSet[currentDrill];

  // AI Form Analysis simulation
  const analyzeForm = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60; // 60-100 score
      setFormScore(score);
      
      const feedbackMessages = [
        "Excellent form! Your timing is perfect.",
        "Good execution. Try to keep your head up more.",
        "Strong effort! Focus on explosive first step.",
        "Nice work! Your balance has improved significantly.",
        "Great technique! Try to pump your arms more actively."
      ];
      
      setFeedback(feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)]);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Timer functionality
  useEffect(() => {
    if (isActive && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      analyzeForm();
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isActive, timer]);

  // Camera setup for AR overlay
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraPermission(true);
      } catch (error) {
        console.error('Camera access denied:', error);
      }
    };

    if (showAROverlay) {
      setupCamera();
    }
  }, [showAROverlay]);

  const startDrill = () => {
    setTimer(drill.duration);
    setIsActive(true);
    setReps(0);
    setFeedback('');
    setFormScore(0);
  };

  const nextDrill = () => {
    if (currentDrill < currentDrillSet.length - 1) {
      setCurrentDrill(currentDrill + 1);
    } else {
      onComplete({
        category,
        drillsCompleted: currentDrillSet.length,
        avgFormScore: formScore,
        totalTime: currentDrillSet.reduce((sum, drill) => sum + drill.duration, 0)
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
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
            <span>Back to Training</span>
          </button>
          <div className="text-sm text-blue-200">
            Drill {currentDrill + 1} of {currentDrillSet.length}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video/AR Section */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Training Video</h2>
                <button
                  onClick={() => setShowAROverlay(!showAROverlay)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    showAROverlay 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {showAROverlay ? 'Hide AR' : 'Show AR'}
                </button>
              </div>
              
              {/* Video Container */}
              <div className="relative bg-gray-800 rounded-xl aspect-video overflow-hidden">
                {showAROverlay && cameraPermission ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                    />
                    {/* AR Markers */}
                    {drill.arMarkers.map((marker, index) => (
                      <div
                        key={index}
                        className="absolute bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-semibold animate-pulse"
                        style={{
                          left: `${marker.x}%`,
                          top: `${marker.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {marker.label}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.267 14.68c-.184 0-.308-.018-.372-.036A1.533 1.533 0 0 1 6.5 13.133V6.867a1.533 1.533 0 0 1 1.395-1.511c.064-.018.188-.036.372-.036.964 0 1.733.794 1.733 1.774v5.804c0 .98-.769 1.774-1.733 1.774z"/>
                        </svg>
                      </div>
                      <p className="text-gray-300">Video: {drill.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Analysis */}
            {(formScore > 0 || isAnalyzing) && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">🤖 AI Form Analysis</h3>
                {isAnalyzing ? (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-blue-200">Analyzing your form...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Form Score</span>
                      <span className={`text-2xl font-bold ${
                        formScore >= 90 ? 'text-green-400' : 
                        formScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {formScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          formScore >= 90 ? 'bg-green-400' : 
                          formScore >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${formScore}%` }}
                      ></div>
                    </div>
                    <p className="text-blue-200 text-sm">{feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drill Details */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{drill.name}</h2>
                <span className={`text-sm font-semibold ${getDifficultyColor(drill.difficulty)}`}>
                  {drill.difficulty}
                </span>
              </div>
              
              <p className="text-blue-200 mb-6">{drill.description}</p>
              
              {/* Key Points */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Key Points:</h3>
                <ul className="space-y-2">
                  {drill.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-yellow-400">•</span>
                      <span className="text-blue-200">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timer and Controls */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-400 mb-2">
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-blue-200">
                    {isActive ? 'Time Remaining' : 'Duration'}: {drill.duration}s
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{reps}</div>
                    <div className="text-sm text-blue-200">Reps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{drill.reps}</div>
                    <div className="text-sm text-blue-200">Target</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  {!isActive && timer === 0 ? (
                    <button
                      onClick={startDrill}
                      className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Start Drill
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsActive(!isActive)}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                        isActive 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isActive ? 'Pause' : 'Resume'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => setReps(reps + 1)}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold transition-colors"
                  >
                    +1 Rep
                  </button>
                </div>

                {formScore > 0 && (
                  <button
                    onClick={nextDrill}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {currentDrill < currentDrillSet.length - 1 ? 'Next Drill' : 'Complete Session'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingSession;
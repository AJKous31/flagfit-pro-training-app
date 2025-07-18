import React, { useState, useEffect } from 'react';

const OfflineWorkouts = ({ onBack }) => {
  const [downloadedWorkouts, setDownloadedWorkouts] = useState([]);
  const [availableWorkouts, setAvailableWorkouts] = useState([]);
  const [downloading, setDownloading] = useState({});
  const [storageUsed, setStorageUsed] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState(null);

  // Sample available workouts for download
  const sampleWorkouts = [
    {
      id: 'speed-fundamentals',
      title: 'Speed Training Fundamentals',
      description: 'Complete 30-minute speed training program',
      category: 'speed',
      duration: '30 mins',
      difficulty: 'Intermediate',
      exercises: 8,
      size: '2.3 MB',
      estimatedTime: 30,
      equipment: 'Cones, Timer',
      exercises_detail: [
        { name: 'Dynamic Warm-up', duration: 300, type: 'warmup' },
        { name: 'Acceleration Sprints', duration: 600, type: 'speed' },
        { name: 'Flying 20s', duration: 480, type: 'speed' },
        { name: 'Deceleration Control', duration: 420, type: 'technique' },
        { name: 'Change of Direction', duration: 540, type: 'agility' },
        { name: 'Sprint Endurance', duration: 360, type: 'endurance' },
        { name: 'Recovery Jog', duration: 240, type: 'recovery' },
        { name: 'Cool Down Stretch', duration: 270, type: 'cooldown' }
      ]
    },
    {
      id: 'route-mastery',
      title: 'Route Running Mastery',
      description: 'Master essential flag football routes',
      category: 'routes',
      duration: '25 mins',
      difficulty: 'Advanced',
      exercises: 6,
      size: '1.8 MB',
      estimatedTime: 25,
      equipment: 'Cones, Flags',
      exercises_detail: [
        { name: 'Route Warm-up', duration: 300, type: 'warmup' },
        { name: 'Slant Progression', duration: 420, type: 'technique' },
        { name: 'Out Routes', duration: 480, type: 'technique' },
        { name: 'Comeback Routes', duration: 360, type: 'technique' },
        { name: 'Double Moves', duration: 540, type: 'advanced' },
        { name: 'Route Combinations', duration: 400, type: 'game-sim' }
      ]
    },
    {
      id: 'strength-circuit',
      title: 'Bodyweight Strength Circuit',
      description: 'No-equipment strength training',
      category: 'strength',
      duration: '20 mins',
      difficulty: 'Beginner',
      exercises: 5,
      size: '1.2 MB',
      estimatedTime: 20,
      equipment: 'None',
      exercises_detail: [
        { name: 'Dynamic Warm-up', duration: 240, type: 'warmup' },
        { name: 'Upper Body Circuit', duration: 480, type: 'strength' },
        { name: 'Core Blast', duration: 360, type: 'core' },
        { name: 'Lower Body Power', duration: 420, type: 'strength' },
        { name: 'Cool Down', duration: 300, type: 'cooldown' }
      ]
    },
    {
      id: 'agility-ladder',
      title: 'Agility & Footwork Drills',
      description: 'Improve footwork and coordination',
      category: 'agility',
      duration: '15 mins',
      difficulty: 'Intermediate',
      exercises: 4,
      size: '0.9 MB',
      estimatedTime: 15,
      equipment: 'Agility Ladder',
      exercises_detail: [
        { name: 'Ladder Warm-up', duration: 180, type: 'warmup' },
        { name: 'Basic Patterns', duration: 300, type: 'footwork' },
        { name: 'Advanced Sequences', duration: 360, type: 'coordination' },
        { name: 'Speed Ladder', duration: 240, type: 'speed' }
      ]
    }
  ];

  useEffect(() => {
    // Load downloaded workouts from localStorage
    const stored = localStorage.getItem('downloadedWorkouts');
    if (stored) {
      try {
        const workouts = JSON.parse(stored);
        setDownloadedWorkouts(workouts);
        calculateStorageUsed(workouts);
      } catch (error) {
        console.error('Failed to load downloaded workouts:', error);
      }
    }
    
    setAvailableWorkouts(sampleWorkouts);
  }, []);

  const calculateStorageUsed = (workouts) => {
    const totalSize = workouts.reduce((sum, workout) => {
      const size = parseFloat(workout.size.replace(' MB', ''));
      return sum + size;
    }, 0);
    setStorageUsed(totalSize);
  };

  const downloadWorkout = async (workout) => {
    setDownloading(prev => ({ ...prev, [workout.id]: true }));
    
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const downloadedWorkout = {
        ...workout,
        downloadedAt: new Date().toISOString(),
        offline: true
      };
      
      const updated = [...downloadedWorkouts, downloadedWorkout];
      setDownloadedWorkouts(updated);
      localStorage.setItem('downloadedWorkouts', JSON.stringify(updated));
      calculateStorageUsed(updated);
      
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(prev => ({ ...prev, [workout.id]: false }));
    }
  };

  const deleteWorkout = (workoutId) => {
    const updated = downloadedWorkouts.filter(w => w.id !== workoutId);
    setDownloadedWorkouts(updated);
    localStorage.setItem('downloadedWorkouts', JSON.stringify(updated));
    calculateStorageUsed(updated);
  };

  const isDownloaded = (workoutId) => {
    return downloadedWorkouts.some(w => w.id === workoutId);
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
      case 'speed': return '⚡';
      case 'routes': return '🏃';
      case 'strength': return '💪';
      case 'agility': return '🔥';
      default: return '🏈';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (activeWorkout) {
    return (
      <WorkoutPlayer 
        workout={activeWorkout}
        onBack={() => setActiveWorkout(null)}
      />
    );
  }

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
          
          {/* Storage Usage */}
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">{storageUsed.toFixed(1)} MB</div>
            <div className="text-sm text-blue-200">Storage Used</div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Offline Workouts</h1>
        <p className="text-blue-200 mb-8">Download workouts for training anywhere, anytime - no internet required</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Downloaded Workouts */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Your Downloaded Workouts</h2>
            
            {downloadedWorkouts.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-2">No Offline Workouts Yet</h3>
                <p className="text-blue-200 mb-4">Download workouts below to train without internet connection</p>
              </div>
            ) : (
              <div className="space-y-4">
                {downloadedWorkouts.map(workout => (
                  <div
                    key={workout.id}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transition-all hover:bg-white/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getCategoryIcon(workout.category)}</span>
                          <h3 className="text-xl font-bold">{workout.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(workout.difficulty)}`}>
                            {workout.difficulty}
                          </span>
                          <span className="bg-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                            ✓ Offline
                          </span>
                        </div>
                        
                        <p className="text-gray-300 mb-3">{workout.description}</p>
                        
                        <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-400">Duration:</span>
                            <div className="font-semibold">{workout.duration}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Exercises:</span>
                            <div className="font-semibold">{workout.exercises}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Equipment:</span>
                            <div className="font-semibold">{workout.equipment}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Downloaded:</span>
                            <div className="font-semibold">{formatDate(workout.downloadedAt)}</div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setActiveWorkout(workout)}
                            className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Start Workout
                          </button>
                          <button
                            onClick={() => deleteWorkout(workout.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Downloads */}
          <div>
            <h2 className="text-xl font-bold mb-6">Available Downloads</h2>
            <div className="space-y-4">
              {availableWorkouts.map(workout => (
                <div
                  key={workout.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">{getCategoryIcon(workout.category)}</span>
                    <h3 className="font-bold text-sm">{workout.title}</h3>
                  </div>
                  
                  <div className="text-xs text-gray-300 mb-3">
                    {workout.duration} • {workout.exercises} exercises • {workout.size}
                  </div>
                  
                  {isDownloaded(workout.id) ? (
                    <div className="flex items-center space-x-2 text-green-300 text-sm">
                      <span>✓</span>
                      <span>Downloaded</span>
                    </div>
                  ) : downloading[workout.id] ? (
                    <div className="flex items-center space-x-2 text-blue-300 text-sm">
                      <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                      <span>Downloading...</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => downloadWorkout(workout)}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Storage Info */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold mb-2">Storage Info</h3>
              <div className="text-sm text-gray-300">
                <div className="flex justify-between mb-1">
                  <span>Used:</span>
                  <span>{storageUsed.toFixed(1)} MB</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Available:</span>
                  <span>{(100 - storageUsed).toFixed(1)} MB</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((storageUsed / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Workout Player Component with Integrated Timer
const WorkoutPlayer = ({ workout, onBack }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(workout.exercises_detail[0]?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next exercise
            if (currentExercise < workout.exercises_detail.length - 1) {
              setCurrentExercise(prev => prev + 1);
              return workout.exercises_detail[currentExercise + 1].duration;
            } else {
              // Workout completed
              setCompleted(true);
              setIsRunning(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeRemaining, currentExercise, workout.exercises_detail]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalProgress = () => {
    const totalDuration = workout.exercises_detail.reduce((sum, ex) => sum + ex.duration, 0);
    const completedDuration = workout.exercises_detail
      .slice(0, currentExercise)
      .reduce((sum, ex) => sum + ex.duration, 0);
    const currentProgress = workout.exercises_detail[currentExercise].duration - timeRemaining;
    return ((completedDuration + currentProgress) / totalDuration) * 100;
  };

  const startWorkout = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const skipExercise = () => {
    if (currentExercise < workout.exercises_detail.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setTimeRemaining(workout.exercises_detail[currentExercise + 1].duration);
    }
  };

  const resetWorkout = () => {
    setCurrentExercise(0);
    setTimeRemaining(workout.exercises_detail[0].duration);
    setIsRunning(false);
    setIsPaused(false);
    setCompleted(false);
  };

  const currentEx = workout.exercises_detail[currentExercise];

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
            <span>Back to Workouts</span>
          </button>
          
          <div className="text-center">
            <div className="text-sm text-blue-200">Offline Workout</div>
            <div className="text-lg font-bold">{workout.title}</div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-300">Overall Progress</span>
            <span className="text-sm text-gray-300">
              {currentExercise + 1} of {workout.exercises_detail.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getTotalProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Current Exercise */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 text-center">
          <h2 className="text-3xl font-bold mb-2">{currentEx.name}</h2>
          <div className="text-6xl font-bold text-blue-400 mb-4">
            {formatTime(timeRemaining)}
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            {!isRunning && !completed && (
              <button
                onClick={startWorkout}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Workout
              </button>
            )}
            
            {isRunning && (
              <button
                onClick={pauseWorkout}
                className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            )}
            
            {isRunning && (
              <button
                onClick={skipExercise}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Skip
              </button>
            )}
            
            <button
              onClick={resetWorkout}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Reset
            </button>
          </div>

          {completed && (
            <div className="bg-green-600/20 border border-green-400 rounded-lg p-6">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-green-300 mb-2">Workout Completed!</h3>
              <p className="text-green-200">Great job completing {workout.title}!</p>
            </div>
          )}
        </div>

        {/* Exercise List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Exercise Schedule</h3>
          <div className="space-y-2">
            {workout.exercises_detail.map((exercise, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  index === currentExercise
                    ? 'bg-blue-600/30 border border-blue-400'
                    : index < currentExercise
                    ? 'bg-green-600/20 border border-green-400'
                    : 'bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < currentExercise
                      ? 'bg-green-500 text-white'
                      : index === currentExercise
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {index < currentExercise ? '✓' : index + 1}
                  </div>
                  <span className="font-semibold">{exercise.name}</span>
                </div>
                <span className="text-sm text-gray-300">
                  {formatTime(exercise.duration)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineWorkouts;
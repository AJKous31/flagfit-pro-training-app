import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePocket } from '../contexts/PocketContext';
import { useTraining } from '../contexts/TrainingContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/Tooltip';

const DashboardView = React.memo(function DashboardView() {
  const { user, logout, pb } = usePocket();
  const { stats, sessions, isLoading: trainingLoading } = useTraining();
  const { isLoading: analyticsLoading } = useAnalytics();
  const location = useLocation();
  
  // Smart Goal Wizard State
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [goalData, setGoalData] = useState({
    objective: '',
    timeframe: '',
    targetValue: '',
    gameDate: ''
  });
  const [hasActiveGoal, setHasActiveGoal] = useState(false);
  const [goalProgress, setGoalProgress] = useState(0);
  
  // Training Detail Modal State
  const [showTrainingDetail, setShowTrainingDetail] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  
  // Enhanced Training Features State
  const [trainingProgress, setTrainingProgress] = useState({});
  const [exerciseNotes, setExerciseNotes] = useState({});
  const [difficultyRating, setDifficultyRating] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeSpent, setTimeSpent] = useState({});
  const [timerStart, setTimerStart] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [weeklyScheduleState, setWeeklyScheduleState] = useState([]);
  const [todayProgress, setTodayProgress] = useState({
    routesCompleted: 8,
    totalRoutes: 10,
    averageTime: 2.4,
    accuracy: 87,
    formScore: 92
  });
  
  // Refs for cleanup
  const timerRef = useRef(null);
  const notificationRef = useRef(null);

  // Training calendar data with detailed breakdowns
  const weeklySchedule = useMemo(() => [
    { day: 'SUN', date: 13, activities: [] },
    { 
      day: 'MON', 
      date: 14, 
      activities: [{ 
        id: 'mon-practice',
        time: '19:00', 
        title: 'Team Practice', 
        type: 'Training', 
        category: 'training', 
        completed: true,
        duration: '90 min',
        location: 'Training Field',
        exercises: [
          { name: 'Warm-up Jog', duration: '10 min', completed: true },
          { name: 'Route Running', duration: '30 min', completed: true },
          { name: 'Flag Pulling Drills', duration: '20 min', completed: true },
          { name: 'Scrimmage', duration: '25 min', completed: true },
          { name: 'Cool-down Stretch', duration: '5 min', completed: true }
        ]
      }] 
    },
    { 
      day: 'TUE', 
      date: 15, 
      activities: [{ 
        id: 'tue-conditioning',
        time: '19:00', 
        title: 'Conditioning', 
        type: 'Sprints/Agility', 
        category: 'conditioning', 
        completed: true,
        duration: '60 min',
        location: 'Training Field',
        exercises: [
          { name: 'Dynamic Warm-up', duration: '10 min', completed: true },
          { name: '40-Yard Sprints', duration: '15 min', completed: true },
          { name: 'Ladder Drills', duration: '15 min', completed: true },
          { name: 'Cone Drills', duration: '15 min', completed: true },
          { name: 'Cool-down', duration: '5 min', completed: true }
        ]
      }] 
    },
    { 
      day: 'WED', 
      date: 16, 
      activities: [{ 
        id: 'wed-recovery',
        time: '08:00', 
        title: 'Recovery Day', 
        type: 'Foam Rolling', 
        category: 'recovery', 
        completed: false,
        duration: '45 min',
        location: 'Home/Gym',
        exercises: [
          { name: 'Light Stretching', duration: '10 min', completed: false },
          { name: 'Foam Rolling - Legs', duration: '15 min', completed: false },
          { name: 'Foam Rolling - Back', duration: '10 min', completed: false },
          { name: 'Mobility Exercises', duration: '10 min', completed: false }
        ]
      }] 
    },
    { 
      day: 'THU', 
      date: 17, 
      activities: [{ 
        id: 'thu-game',
        time: '18:30', 
        title: 'Game vs Lightning', 
        type: 'Game Day', 
        category: 'game', 
        completed: false,
        duration: '120 min',
        location: 'Lightning Field',
        exercises: [
          { name: 'Pre-game Warm-up', duration: '20 min', completed: false },
          { name: 'Team Meeting', duration: '10 min', completed: false },
          { name: 'Game Play', duration: '60 min', completed: false },
          { name: 'Post-game Cool-down', duration: '10 min', completed: false },
          { name: 'Team Debrief', duration: '20 min', completed: false }
        ]
      }] 
    },
    { 
      day: 'FRI', 
      date: 18, 
      activities: [{ 
        id: 'fri-yoga',
        time: '10:00', 
        title: 'Yoga/Stretching', 
        type: 'Flexibility', 
        category: 'recovery', 
        completed: false,
        duration: '60 min',
        location: 'Training Field',
        exercises: [
          { name: 'Breathing Exercises', duration: '5 min', completed: false },
          { name: 'Sun Salutations', duration: '15 min', completed: false },
          { name: 'Hip Flexibility', duration: '15 min', completed: false },
          { name: 'Hamstring Stretches', duration: '10 min', completed: false },
          { name: 'Cool-down & Meditation', duration: '15 min', completed: false }
        ]
      }] 
    },
    { 
      day: 'SAT', 
      date: 19, 
      activities: [{ 
        id: 'sat-rest',
        time: '', 
        title: 'Rest Day', 
        type: 'Complete Rest', 
        category: 'rest', 
        completed: false,
        duration: 'All day',
        location: 'Home',
        exercises: [
          { name: 'Light Walking', duration: '30 min', completed: false },
          { name: 'Hydration Focus', duration: 'All day', completed: false },
          { name: 'Nutrition Planning', duration: '30 min', completed: false },
          { name: 'Mental Recovery', duration: 'All day', completed: false }
        ]
      }] 
    }
  ], []);

  // Initialize weekly schedule state
  useEffect(() => {
    try {
      setWeeklyScheduleState(weeklySchedule);
    } catch (error) {
      console.error('Error initializing weekly schedule:', error);
      setWeeklyScheduleState([]);
    }
  }, [weeklySchedule]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!showTrainingDetail) return;
      
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          handleCloseTrainingDetail();
          break;
        case ' ':
          event.preventDefault();
          if (selectedTraining && selectedTraining.exercises && selectedTraining.exercises.length > 0) {
            // Toggle first incomplete exercise
            const firstIncomplete = selectedTraining.exercises.findIndex(ex => ex && !ex.completed);
            if (firstIncomplete !== -1) {
              handleToggleExercise(firstIncomplete);
            }
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          // Navigate to previous exercise
          break;
        case 'ArrowDown':
          event.preventDefault();
          // Navigate to next exercise
          break;
        case 't':
          event.preventDefault();
          // Start/stop timer for current exercise
          if (activeTimer !== null) {
            startExerciseTimer(activeTimer);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showTrainingDetail, selectedTraining, activeTimer]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (notificationRef.current) {
        clearTimeout(notificationRef.current);
      }
    };
  }, []);

  // Request notification permission on load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Smart notifications
  useEffect(() => {
    const checkUpcomingTrainings = () => {
      try {
        const now = new Date();
        const in30Minutes = new Date(now.getTime() + 30 * 60 * 1000);
        
        (weeklyScheduleState || []).forEach(day => {
          (day.activities || []).forEach(activity => {
            if (activity.time) {
              const [hours, minutes] = activity.time.split(':').map(Number);
              const activityTime = new Date();
              activityTime.setHours(hours, minutes, 0, 0);
              
              if (activityTime > now && activityTime <= in30Minutes && !activity.completed) {
                // Show notification
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification(`Upcoming Training: ${activity.title}`, {
                    body: `Starting in 30 minutes at ${activity.time}`,
                    icon: '/favicon.ico'
                  });
                }
              }
            }
          });
        });
      } catch (error) {
        console.error('Error checking upcoming trainings:', error);
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkUpcomingTrainings, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [weeklyScheduleState]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  // Mock player data (this would come from user profile in real app)
  const playerMetrics = useMemo(() => ({
    height: '1.78 m',
    weight: '75 kg',
    bmi: '23.7',
    bmiStatus: 'Acceptable',
    muscleMass: '77%',
    muscleMassStatus: 'Optimal',
    fortyYardDash: '4.85 sec',
    dashStatus: 'Good',
    lastUpdated: '2024-07-13'
  }), []);

  // Smart Goal Wizard Functions
  const objectives = [
    { id: 'speed', name: 'Speed', description: 'Improve 40-yard dash time', icon: '⚡', color: 'blue' },
    { id: 'accuracy', name: 'Accuracy', description: 'Increase route precision', icon: '🎯', color: 'green' },
    { id: 'conditioning', name: 'Conditioning', description: 'Build endurance', icon: '💪', color: 'purple' },
    { id: 'agility', name: 'Agility', description: 'Enhance quickness', icon: '🔄', color: 'orange' }
  ];

  const timeframes = [
    { id: '1week', name: '1 Week', description: 'Quick improvement' },
    { id: '2weeks', name: '2 Weeks', description: 'Moderate progress' },
    { id: '1month', name: '1 Month', description: 'Significant change' },
    { id: 'season', name: 'Season Goal', description: 'Long-term target' }
  ];

  const handleWizardNext = () => {
    if (wizardStep < 4) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handleWizardBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleCreateGoal = () => {
    setHasActiveGoal(true);
    setGoalProgress(15); // Initial progress
    setShowWizard(false);
    setWizardStep(1);
  };

  const handleDismissGoal = () => {
    setHasActiveGoal(false);
    setGoalProgress(0);
    setGoalData({
      objective: '',
      timeframe: '',
      targetValue: '',
      gameDate: ''
    });
  };

  // Data Persistence Functions
  const saveProgressToPocketBase = async (trainingId, exercises, notes, ratings) => {
    try {
      if (!pb || !user) return;
      
      const progressData = {
        userId: user.id,
        trainingId,
        exercises,
        notes,
        ratings,
        completedAt: new Date().toISOString(),
        totalTimeSpent: Object.values(timeSpent).reduce((a, b) => a + b, 0)
      };
      
      // Save to localStorage as backup
      const key = `training_progress_${trainingId}`;
      localStorage.setItem(key, JSON.stringify(progressData));
      
      // Update training progress state
      setTrainingProgress(prev => ({
        ...prev,
        [trainingId]: progressData
      }));
      
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const loadProgressFromStorage = (trainingId) => {
    try {
      const key = `training_progress_${trainingId}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  };

  // Real-time Progress Sync
  const updateTodayProgressMetrics = () => {
    try {
      const today = new Date().toDateString();
      const todayActivities = (weeklyScheduleState || []).flatMap(day => day.activities || [])
        .filter(activity => new Date().toDateString() === today);
      
      const completedCount = todayActivities.filter(activity => activity.completed).length;
      const totalCount = todayActivities.length;
      
      setTodayProgress(prev => ({
        ...prev,
        routesCompleted: completedCount,
        totalRoutes: Math.max(totalCount, 10) // Fallback to 10 if no activities
      }));
    } catch (error) {
      console.error('Error updating progress metrics:', error);
    }
  };

  const checkTrainingCompletion = (trainingId, exercises) => {
    try {
      if (!exercises || !Array.isArray(exercises)) return;
      
      const allComplete = exercises.every(ex => ex.completed);
      
      if (allComplete) {
        // Update calendar status
        setWeeklyScheduleState(prev => 
          (prev || []).map(day => ({
            ...day,
            activities: (day.activities || []).map(activity => 
              activity.id === trainingId 
                ? { ...activity, completed: true }
                : activity
            )
          }))
        );
        
        // Update today's progress
        updateTodayProgressMetrics();
        
        // Trigger celebration
        triggerCompletionCelebration(trainingId);
        
        // Update achievement progress
        updateAchievementProgress();
      }
    } catch (error) {
      console.error('Error checking training completion:', error);
    }
  };

  // Completion Celebration
  const triggerCompletionCelebration = (trainingId) => {
    const messages = [
      "🎉 Awesome work! Training completed!",
      "💪 You're crushing it! Great job!",
      "🔥 Training session complete! You're unstoppable!",
      "⚡ Excellent effort! Keep it up!",
      "🏆 Training completed! You're a champion!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCompletionMessage(randomMessage);
    setShowCelebration(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const updateAchievementProgress = () => {
    // Update goal progress if active
    if (hasActiveGoal) {
      setGoalProgress(prev => Math.min(prev + 10, 100));
    }
  };

  // Timer Functions
  const startExerciseTimer = (exerciseIndex) => {
    try {
      if (!selectedTraining || !selectedTraining.id) return;
      
      if (activeTimer === exerciseIndex) {
        // Stop timer
        const elapsed = Date.now() - timerStart;
        setTimeSpent(prev => ({
          ...prev,
          [`${selectedTraining.id}_${exerciseIndex}`]: (prev[`${selectedTraining.id}_${exerciseIndex}`] || 0) + elapsed
        }));
        setActiveTimer(null);
        setTimerStart(null);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        // Start timer
        setActiveTimer(exerciseIndex);
        setTimerStart(Date.now());
        
        timerRef.current = setInterval(() => {
          // Force re-render to update timer display
          setTimerStart(prev => prev);
        }, 1000);
      }
    } catch (error) {
      console.error('Error with exercise timer:', error);
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentExerciseTime = (exerciseIndex) => {
    try {
      if (!selectedTraining || exerciseIndex === undefined) return 0;
      
      const baseTime = timeSpent[`${selectedTraining.id}_${exerciseIndex}`] || 0;
      const currentTime = activeTimer === exerciseIndex && timerStart 
        ? Date.now() - timerStart 
        : 0;
      return baseTime + currentTime;
    } catch (error) {
      console.error('Error getting exercise time:', error);
      return 0;
    }
  };

  // Enhanced Training Detail Modal Functions
  const handleTrainingClick = (activity) => {
    try {
      if (!activity) return;
      
      const savedProgress = loadProgressFromStorage(activity.id);
      
      if (savedProgress && savedProgress.exercises) {
        // Restore saved progress
        activity.exercises = savedProgress.exercises;
        setExerciseNotes(savedProgress.notes || {});
        setDifficultyRating(savedProgress.ratings || {});
        setTimeSpent(prev => ({ ...prev, ...(savedProgress.timeSpent || {}) }));
      }
      
      setSelectedTraining(activity);
      setShowTrainingDetail(true);
    } catch (error) {
      console.error('Error opening training detail:', error);
    }
  };

  const handleCloseTrainingDetail = () => {
    // Stop any active timer
    if (activeTimer !== null) {
      startExerciseTimer(activeTimer);
    }
    
    // Save progress before closing
    if (selectedTraining) {
      saveProgressToPocketBase(
        selectedTraining.id,
        selectedTraining.exercises,
        exerciseNotes,
        difficultyRating
      );
    }
    
    setShowTrainingDetail(false);
    setSelectedTraining(null);
    setActiveTimer(null);
    setTimerStart(null);
  };

  const handleToggleExercise = (exerciseIndex) => {
    try {
      if (!selectedTraining || !selectedTraining.exercises) return;
      
      const updatedExercises = selectedTraining.exercises.map((exercise, index) => 
        index === exerciseIndex ? { ...exercise, completed: !exercise.completed } : exercise
      );
      
      const updatedTraining = { ...selectedTraining, exercises: updatedExercises };
      setSelectedTraining(updatedTraining);
      
      // Check for completion
      checkTrainingCompletion(selectedTraining.id, updatedExercises);
      
      // Save progress
      saveProgressToPocketBase(
        selectedTraining.id,
        updatedExercises,
        exerciseNotes,
        difficultyRating
      );
    } catch (error) {
      console.error('Error toggling exercise:', error);
    }
  };

  // Notes and Rating Functions
  const handleExerciseNote = (exerciseIndex, note) => {
    try {
      if (!selectedTraining) return;
      
      const key = `${selectedTraining.id}_${exerciseIndex}`;
      setExerciseNotes(prev => ({
        ...prev,
        [key]: note
      }));
    } catch (error) {
      console.error('Error saving exercise note:', error);
    }
  };

  const handleDifficultyRating = (exerciseIndex, rating) => {
    try {
      if (!selectedTraining) return;
      
      const key = `${selectedTraining.id}_${exerciseIndex}`;
      setDifficultyRating(prev => ({
        ...prev,
        [key]: rating
      }));
    } catch (error) {
      console.error('Error saving difficulty rating:', error);
    }
  };

  // Contextual Actions
  const handleRescheduleTraining = (trainingId, newDate) => {
    // Implementation for rescheduling
    console.log('Reschedule training:', trainingId, 'to', newDate);
  };

  const handleSkipExercise = (exerciseIndex) => {
    if (selectedTraining) {
      const updatedExercises = selectedTraining.exercises.map((exercise, index) => 
        index === exerciseIndex ? { ...exercise, skipped: true } : exercise
      );
      setSelectedTraining({ ...selectedTraining, exercises: updatedExercises });
    }
  };

  const handleAddCustomExercise = (exerciseName, duration) => {
    if (selectedTraining) {
      const newExercise = {
        name: exerciseName,
        duration,
        completed: false,
        custom: true
      };
      const updatedExercises = [...selectedTraining.exercises, newExercise];
      setSelectedTraining({ ...selectedTraining, exercises: updatedExercises });
    }
  };

  if (trainingLoading || analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo and Navigation */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🏈</span>
                  </div>
                  <h1 className="text-xl font-bold text-blue-600">MERLINS PLAYBOOK</h1>
                </div>
                
                <nav className="hidden md:flex space-x-1">
                  <Link 
                    to="/dashboard" 
                    className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === '/dashboard' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    <span>Dashboard</span>
                    {location.pathname === '/dashboard' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                  <Link 
                    to="/training" 
                    className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      location.pathname === '/training' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Training</span>
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full transition-transform duration-200 origin-left ${
                      location.pathname === '/training' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></div>
                  </Link>
                  <Link 
                    to="/tournaments" 
                    className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      location.pathname === '/tournaments' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span>Tournaments</span>
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full transition-transform duration-200 origin-left ${
                      location.pathname === '/tournaments' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></div>
                  </Link>
                  <Link 
                    to="/community" 
                    className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      location.pathname === '/community' 
                        ? 'text-blue-600 font-medium bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Community</span>
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full transition-transform duration-200 origin-left ${
                      location.pathname === '/community' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></div>
                  </Link>
                </nav>
              </div>

              {/* User Actions */}
              <div className="flex items-center space-x-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19.5A2.5 2.5 0 016.5 22H20a2 2 0 002-2V4a2 2 0 00-2-2H6.5A2.5 2.5 0 004 4.5v15z" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export Data</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer hover:scale-110 transition-transform duration-200">
                      <AvatarImage src={user?.avatar} alt={user?.name || user?.email} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user?.name || user?.email || 'User Profile'}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>

                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Player Body Metrics */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Player Body Metrics</h2>
              <span className="text-sm text-gray-500">Last updated: {playerMetrics.lastUpdated}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Height</h3>
                <p className="text-2xl font-bold text-blue-600">{playerMetrics.height}</p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Weight</h3>
                <p className="text-2xl font-bold text-blue-600">{playerMetrics.weight}</p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">BMI</h3>
                <p className="text-2xl font-bold text-blue-600">{playerMetrics.bmi} <span className="text-sm">kg/m²</span></p>
                <p className="text-xs text-green-600 font-medium">{playerMetrics.bmiStatus}</p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Muscle Mass</h3>
                <p className="text-2xl font-bold text-blue-600">{playerMetrics.muscleMass}</p>
                <p className="text-xs text-green-600 font-medium">{playerMetrics.muscleMassStatus}</p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">40 Yard Dash</h3>
                <p className="text-2xl font-bold text-blue-600">{playerMetrics.fortyYardDash}</p>
                <p className="text-xs text-green-600 font-medium">{playerMetrics.dashStatus}</p>
              </div>
            </div>
            
            {/* Benchmarks Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                Elite Flag Football Benchmarks
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">40-Yard Dash</div>
                  <div className="text-sm font-semibold text-blue-600">4.6s</div>
                  <div className="text-xs text-gray-500">Elite</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Muscle Mass</div>
                  <div className="text-sm font-semibold text-blue-600">75%+</div>
                  <div className="text-xs text-gray-500">Optimal</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">BMI Range</div>
                  <div className="text-sm font-semibold text-blue-600">22-25</div>
                  <div className="text-xs text-gray-500">Athletic</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Vertical Jump</div>
                  <div className="text-sm font-semibold text-blue-600">1.1m</div>
                  <div className="text-xs text-gray-500">Pro Level</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Agility 5-10-5</div>
                  <div className="text-sm font-semibold text-blue-600">4.2s</div>
                  <div className="text-xs text-gray-500">Elite</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Based on scientific research for flag football athletes
              </p>
            </div>
          </div>
        </section>

        {/* Training Calendar */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Training Calendar
              </h2>
              <div className="flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Previous Month</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-sm font-medium text-gray-700">Month</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Next Month</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-center font-medium text-gray-900">Jul 13 - Jul 19, 2025</h3>
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {weeklyScheduleState.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2">
                    <div className="text-xs font-medium text-gray-600 mb-1">{day.day}</div>
                    <div className="text-lg font-semibold text-gray-900">{day.date}</div>
                  </div>
                  <div className="space-y-1">
                    {day.activities.map((activity, actIndex) => (
                      <Tooltip key={actIndex}>
                        <TooltipTrigger asChild>
                          <div 
                            className={`
                              relative p-2 rounded-lg text-xs cursor-pointer
                              transition-all duration-200 ease-out
                              hover:scale-105 hover:shadow-lg hover:-translate-y-1
                              ${activity.completed ? 'opacity-75' : ''}
                              ${activity.category === 'training' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                activity.category === 'conditioning' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                activity.category === 'recovery' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                                activity.category === 'game' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                              ${activity.category === 'training' && 'before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-blue-500 before:rounded-t-lg' ||
                                activity.category === 'conditioning' && 'before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-green-500 before:rounded-t-lg' ||
                                activity.category === 'recovery' && 'before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-orange-500 before:rounded-t-lg' ||
                                activity.category === 'game' && 'before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-red-500 before:rounded-t-lg' ||
                                'before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gray-500 before:rounded-t-lg'}
                            `}
                            style={{
                              zIndex: 'auto',
                              transformOrigin: 'center',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.zIndex = '10';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.zIndex = 'auto';
                            }}
                            onClick={() => handleTrainingClick(activity)}
                          >
                            {activity.completed && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            {activity.time && <div className="font-medium">{activity.time}</div>}
                            <div className={`font-medium ${activity.completed ? 'line-through' : ''}`}>{activity.title}</div>
                            <div className={activity.completed ? 'line-through' : ''}>{activity.type}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-xs opacity-75">{activity.type}</div>
                            {activity.time && <div className="text-xs mt-1">⏰ {activity.time}</div>}
                            <div className="text-xs mt-1">📍 Training Field</div>
                            {activity.completed && (
                              <div className="text-xs mt-1 text-green-600 font-medium">✅ Completed</div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    {day.activities.length === 0 && (
                      <div className="p-2 rounded-lg bg-gray-50 text-gray-400 text-xs min-h-[2.5rem] flex items-center justify-center">
                        Free Day
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Game Day</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Training</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Conditioning</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span>Recovery</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <span>Rest Day</span>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Tracking */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Performance Tracking
              </h2>
              <div className="flex items-center space-x-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      View History
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View performance history</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="px-3 py-1.5 text-sm bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors">
                      Achievements
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View all achievements</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      Share
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share performance stats</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Progress */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Today's Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Routes Completed:</span>
                    <span className="font-semibold text-gray-900">{todayProgress.routesCompleted}/{todayProgress.totalRoutes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Time:</span>
                    <span className="font-semibold text-gray-900">{todayProgress.averageTime}s <span className="text-xs text-gray-500">(Target: 2.2s)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Accuracy:</span>
                    <span className="font-semibold text-gray-900">{todayProgress.accuracy}% <span className="text-xs text-gray-500">(Target: 90%)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Form Score:</span>
                    <span className="font-semibold text-gray-900">{todayProgress.formScore}% <span className="text-xs text-gray-500">(Target: 85%)</span></span>
                  </div>
                </div>
              </div>

              {/* Weekly Goals */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Weekly Goals</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Speed</span>
                      </div>
                      <span className="text-xs text-gray-500">75% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Accuracy</span>
                      </div>
                      <span className="text-xs text-gray-500">80% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Consistency</span>
                      </div>
                      <span className="text-xs text-gray-500">85% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">Speed Demon</h4>
                      <p className="text-xs text-gray-600">Completed 5 routes under 2.0s</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🎯</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">Accuracy Master</h4>
                      <p className="text-xs text-gray-600">95% accuracy on 10 routes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">👑</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">Consistency King</h4>
                      <p className="text-xs text-gray-600">7 days in a row training</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Goal Wizard */}
        <section>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Set Your Next Goal
              </h2>
              {hasActiveGoal && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={handleDismissGoal}
                      className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                      ✕ Dismiss
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove current goal</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {!hasActiveGoal ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to level up?</h3>
                <p className="text-gray-600 mb-6">Set a personalized goal to track your progress and stay motivated.</p>
                <button 
                  onClick={() => setShowWizard(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Goal
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Improve 40-Yard Dash</h3>
                      <p className="text-sm text-gray-600">Target: 4.5s in 2 weeks</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{goalProgress}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${goalProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next training: Tomorrow 7:00 PM</span>
                  <button 
                    onClick={() => setShowWizard(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit Goal
                  </button>
                </div>
              </div>
            )}

            {/* Wizard Modal */}
            {showWizard && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Goal Wizard ({wizardStep}/4)
                      </h3>
                      <button 
                        onClick={() => setShowWizard(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mb-6">
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4].map((step) => (
                          <div 
                            key={step}
                            className={`flex-1 h-2 rounded-full ${
                              step <= wizardStep ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {wizardStep === 1 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">What would you like to improve?</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {objectives.map((objective) => (
                            <button
                              key={objective.id}
                              onClick={() => setGoalData({...goalData, objective: objective.id})}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                goalData.objective === objective.id
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-2xl mb-2">{objective.icon}</div>
                                <div className="font-medium text-gray-900">{objective.name}</div>
                                <div className="text-xs text-gray-600">{objective.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {wizardStep === 2 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Choose your timeframe</h4>
                        <div className="space-y-3">
                          {timeframes.map((timeframe) => (
                            <button
                              key={timeframe.id}
                              onClick={() => setGoalData({...goalData, timeframe: timeframe.id})}
                              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                goalData.timeframe === timeframe.id
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="font-medium text-gray-900">{timeframe.name}</div>
                              <div className="text-sm text-gray-600">{timeframe.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {wizardStep === 3 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Set your target</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Target Value
                            </label>
                            <input
                              type="text"
                              value={goalData.targetValue}
                              onChange={(e) => setGoalData({...goalData, targetValue: e.target.value})}
                              placeholder="e.g., 4.5 seconds"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Target Date (Optional)
                            </label>
                            <input
                              type="date"
                              value={goalData.gameDate}
                              onChange={(e) => setGoalData({...goalData, gameDate: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {wizardStep === 4 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Review & Confirm</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Objective:</span>
                            <span className="font-medium">{objectives.find(o => o.id === goalData.objective)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Timeframe:</span>
                            <span className="font-medium">{timeframes.find(t => t.id === goalData.timeframe)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Target:</span>
                            <span className="font-medium">{goalData.targetValue}</span>
                          </div>
                          {goalData.gameDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Target Date:</span>
                              <span className="font-medium">{goalData.gameDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={handleWizardBack}
                        disabled={wizardStep === 1}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          wizardStep === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Back
                      </button>
                      <button
                        onClick={wizardStep === 4 ? handleCreateGoal : handleWizardNext}
                        disabled={
                          (wizardStep === 1 && !goalData.objective) ||
                          (wizardStep === 2 && !goalData.timeframe) ||
                          (wizardStep === 3 && !goalData.targetValue)
                        }
                        className={`px-6 py-2 rounded-lg font-medium ${
                          (wizardStep === 1 && !goalData.objective) ||
                          (wizardStep === 2 && !goalData.timeframe) ||
                          (wizardStep === 3 && !goalData.targetValue)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {wizardStep === 4 ? 'Add to Calendar' : 'Next'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Completion Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 animate-bounce">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Congratulations!</h3>
              <p className="text-gray-600 mb-4">{completionMessage}</p>
              <div className="flex justify-center space-x-2">
                <span className="text-2xl animate-pulse">⭐</span>
                <span className="text-2xl animate-pulse delay-100">⭐</span>
                <span className="text-2xl animate-pulse delay-200">⭐</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Detail Modal */}
      {showTrainingDetail && selectedTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedTraining.category === 'training' ? 'bg-blue-100' :
                    selectedTraining.category === 'conditioning' ? 'bg-green-100' :
                    selectedTraining.category === 'recovery' ? 'bg-orange-100' :
                    selectedTraining.category === 'game' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      selectedTraining.category === 'training' ? 'text-blue-600' :
                      selectedTraining.category === 'conditioning' ? 'text-green-600' :
                      selectedTraining.category === 'recovery' ? 'text-orange-600' :
                      selectedTraining.category === 'game' ? 'text-red-600' :
                      'text-gray-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedTraining.title}</h3>
                    <p className="text-gray-600">{selectedTraining.type}</p>
                  </div>
                </div>
                <button 
                  onClick={handleCloseTrainingDetail}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedTraining.time || 'All Day'}</div>
                  <div className="text-sm text-gray-600">Start Time</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedTraining.duration}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedTraining.location}</div>
                  <div className="text-sm text-gray-600">Location</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Training Breakdown</h4>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Keyboard shortcuts:</span> Space (toggle), ESC (close), T (timer)
                  </div>
                </div>
                <div className="space-y-3">
                  {(selectedTraining?.exercises || []).map((exercise, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        exercise.completed 
                          ? 'bg-green-50 border-green-200' 
                          : exercise.skipped
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleToggleExercise(index)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              exercise.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {exercise.completed && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <div>
                            <div className={`font-medium ${exercise.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {exercise.name}
                            </div>
                            <div className="text-sm text-gray-600">{exercise.duration}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Timer Display */}
                          <div className="text-sm font-mono text-gray-600">
                            {formatTime(getCurrentExerciseTime(index))}
                          </div>
                          {/* Timer Button */}
                          <button
                            onClick={() => startExerciseTimer(index)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              activeTimer === index
                                ? 'bg-red-500 text-white'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            {activeTimer === index ? 'Stop' : 'Start'}
                          </button>
                          {/* Skip Button */}
                          <button
                            onClick={() => handleSkipExercise(index)}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white hover:bg-yellow-600"
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                      
                      {/* Difficulty Rating */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">Difficulty:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleDifficultyRating(index, star)}
                              className={`w-4 h-4 ${
                                star <= (difficultyRating[`${selectedTraining.id}_${index}`] || 0)
                                  ? 'text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Exercise Notes */}
                      <div>
                        <textarea
                          placeholder="Add notes about this exercise..."
                          value={exerciseNotes[`${selectedTraining.id}_${index}`] || ''}
                          onChange={(e) => handleExerciseNote(index, e.target.value)}
                          className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows="2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-gray-600">
                      Progress: {(selectedTraining?.exercises || []).filter(e => e.completed).length} / {(selectedTraining?.exercises || []).length} exercises
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Time: {formatTime(Object.values(timeSpent || {}).reduce((a, b) => a + b, 0))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">
                      {(selectedTraining?.exercises || []).filter(e => e.completed).length === (selectedTraining?.exercises || []).length && (selectedTraining?.exercises || []).length > 0
                        ? '🎉 Training Complete!'
                        : `${(selectedTraining?.exercises || []).length - (selectedTraining?.exercises || []).filter(e => e.completed).length} exercises remaining`
                      }
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={handleCloseTrainingDetail}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedTraining?.exercises) return;
                      // Mark all exercises as completed
                      const allCompleted = selectedTraining.exercises.map(e => ({ ...e, completed: true }));
                      const updatedTraining = { ...selectedTraining, exercises: allCompleted };
                      setSelectedTraining(updatedTraining);
                      checkTrainingCompletion(selectedTraining.id, allCompleted);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Complete All
                  </button>
                  <button
                    onClick={() => {
                      // Add custom exercise
                      const exerciseName = prompt('Exercise name:');
                      const duration = prompt('Duration (e.g., 10 min):');
                      if (exerciseName && duration) {
                        handleAddCustomExercise(exerciseName, duration);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Exercise
                  </button>
                  <button
                    onClick={() => {
                      // Share progress
                      const completedCount = selectedTraining.exercises.filter(e => e.completed).length;
                      const totalCount = selectedTraining.exercises.length;
                      const progress = Math.round((completedCount / totalCount) * 100);
                      const totalTime = formatTime(Object.values(timeSpent).reduce((a, b) => a + b, 0));
                      
                      const shareText = `🏈 Training Progress: ${selectedTraining.title}\n📊 ${completedCount}/${totalCount} exercises (${progress}%)\n⏱️ Time: ${totalTime}\n#MerlinsPlaybook #FlagFootball`;
                      
                      if (navigator.share) {
                        navigator.share({
                          title: 'Training Progress',
                          text: shareText
                        });
                      } else {
                        navigator.clipboard.writeText(shareText);
                        alert('Progress copied to clipboard!');
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
});

export default DashboardView;
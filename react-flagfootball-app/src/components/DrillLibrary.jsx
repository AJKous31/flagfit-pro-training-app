import React, { useState, useEffect } from 'react';

const DrillLibrary = ({ onSelectDrill, selectedCategory = 'all' }) => {
  const [filteredDrills, setFilteredDrills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');

  // Comprehensive drill database
  const drillDatabase = [
    // Route Running Drills
    {
      id: 'rr-001',
      name: 'Quick Slant',
      category: 'routes',
      difficulty: 'Beginner',
      duration: '15 mins',
      equipment: 'None',
      space: 'Small (10x10 yards)',
      description: 'Master the fundamental slant route with precise timing and sharp cuts.',
      instructions: [
        'Start in a ready position 5 yards from target',
        'Take 3 quick steps forward at 75% speed',
        'Plant your outside foot firmly',
        'Cut sharply at 45-degree angle',
        'Accelerate through the cut',
        'Present hands as target immediately after cut'
      ],
      keyPoints: [
        'Sharp plant foot - no rounding',
        'Head up throughout the route',
        'Quick hand presentation',
        'Accelerate after the cut'
      ],
      variations: [
        'Speed Slant: Increase initial speed to 90%',
        'Double Slant: Add second cut after 3 more steps',
        'Comeback Slant: Run 8 yards, then slant back'
      ],
      commonMistakes: [
        'Rounding the cut instead of sharp angle',
        'Looking back too early',
        'Slowing down during the cut',
        'Poor hand positioning'
      ],
      videoUrl: '/videos/quick-slant.mp4',
      thumbnailUrl: '/images/drills/quick-slant.jpg'
    },
    {
      id: 'rr-002',
      name: 'Double Move Out',
      category: 'routes',
      difficulty: 'Advanced',
      duration: '20 mins',
      equipment: 'Cones (optional)',
      space: 'Medium (15x15 yards)',
      description: 'Deceive defenders with a convincing fake before breaking outside.',
      instructions: [
        'Run 6 yards straight at 80% speed',
        'Fake hard inside with head and shoulders',
        'Plant inside foot and sell the fake',
        'Immediately break outside at full speed',
        'Maintain speed through the break',
        'Look for ball over outside shoulder'
      ],
      keyPoints: [
        'Sell the first move completely',
        'Explosive second cut',
        'Maintain eye contact with QB',
        'Full speed after break'
      ],
      variations: [
        'In-and-Out: Fake outside, break inside',
        'Triple Move: Add third directional change',
        'Speed Double: Increase tempo throughout'
      ],
      commonMistakes: [
        'Not selling the first fake',
        'Telegraphing the real direction',
        'Losing speed during transition',
        'Poor timing with quarterback'
      ],
      videoUrl: '/videos/double-move.mp4',
      thumbnailUrl: '/images/drills/double-move.jpg'
    },

    // Speed Training Drills
    {
      id: 'st-001',
      name: '40-Yard Dash Technique',
      category: 'speed',
      difficulty: 'Intermediate',
      duration: '25 mins',
      equipment: 'None',
      space: 'Large (40+ yards)',
      description: 'Perfect your 40-yard dash form for maximum speed and efficiency.',
      instructions: [
        'Start in 3-point stance, weight forward',
        'Drive with first 3 steps at 45-degree angle',
        'Gradually raise body angle over next 7 steps',
        'Reach full upright position by step 10',
        'Pump arms in rhythm with legs',
        'Maintain form through finish line'
      ],
      keyPoints: [
        'Low start position',
        'Gradual body angle progression',
        'High knee drive',
        'Relaxed shoulders'
      ],
      variations: [
        'Flying 40: 10-yard buildup, then 40-yard sprint',
        'Resistance 40: Use resistance band for first 20 yards',
        'Interval 40s: Multiple 40s with specific rest periods'
      ],
      commonMistakes: [
        'Standing up too quickly',
        'Tight shoulders and arms',
        'Overstriding',
        'Looking down instead of ahead'
      ],
      videoUrl: '/videos/40-yard-dash.mp4',
      thumbnailUrl: '/images/drills/40-yard-dash.jpg'
    },
    {
      id: 'st-002',
      name: 'Acceleration Ladders',
      category: 'speed',
      difficulty: 'Beginner',
      duration: '15 mins',
      equipment: 'Agility ladder or markers',
      space: 'Medium (20 yards)',
      description: 'Develop quick feet and acceleration through progressive speed zones.',
      instructions: [
        'Set up 4 zones of 5 yards each',
        'Zone 1: 50% speed, focus on form',
        'Zone 2: 70% speed, increase tempo',
        'Zone 3: 85% speed, near max effort',
        'Zone 4: 95% speed, full acceleration',
        'Walk back recovery between reps'
      ],
      keyPoints: [
        'Progressive speed increase',
        'Maintain form at all speeds',
        'High knee drive',
        'Pump arms actively'
      ],
      variations: [
        'Lateral Ladders: Side-to-side movement patterns',
        'Backward Ladders: Reverse direction for each zone',
        'Single Leg: Alternate legs every other rep'
      ],
      commonMistakes: [
        'Starting too fast',
        'Poor form at higher speeds',
        'Insufficient recovery between reps',
        'Not reaching true max speed'
      ],
      videoUrl: '/videos/acceleration-ladders.mp4',
      thumbnailUrl: '/images/drills/acceleration-ladders.jpg'
    },

    // Plyometric Drills
    {
      id: 'pl-001',
      name: 'Single Leg Bounds',
      category: 'plyometrics',
      difficulty: 'Intermediate',
      duration: '10 mins',
      equipment: 'None',
      space: 'Medium (15 yards)',
      description: 'Build single-leg power and stability for explosive movements.',
      instructions: [
        'Start on right leg in athletic position',
        'Bound forward landing on same leg',
        'Hold landing for 2 seconds',
        'Focus on soft, controlled landing',
        'Repeat for 5 bounds, then switch legs',
        'Rest 30 seconds between sets'
      ],
      keyPoints: [
        'Land softly on forefoot',
        'Maintain balance during hold',
        'Drive with opposite arm',
        'Keep chest up and core tight'
      ],
      variations: [
        'Lateral Bounds: Side-to-side movement',
        'Triple Bounds: Three consecutive bounds',
        'Bound and Sprint: Add 10-yard sprint after bounds'
      ],
      commonMistakes: [
        'Landing too hard',
        'Poor balance on landing',
        'Not using arm drive',
        'Rushing between reps'
      ],
      videoUrl: '/videos/single-leg-bounds.mp4',
      thumbnailUrl: '/images/drills/single-leg-bounds.jpg'
    },

    // Catching Drills
    {
      id: 'ca-001',
      name: 'Tennis Ball Reactions',
      category: 'catching',
      difficulty: 'Beginner',
      duration: '10 mins',
      equipment: 'Tennis balls',
      space: 'Small (5x5 yards)',
      description: 'Improve hand-eye coordination and reaction time with tennis ball drills.',
      instructions: [
        'Partner throws tennis ball at chest level',
        'React and catch with both hands',
        'Start with slow, easy throws',
        'Gradually increase speed and vary angles',
        'Focus on watching ball into hands',
        '10 catches, then switch thrower'
      ],
      keyPoints: [
        'Keep eyes on ball',
        'Soft hands on catch',
        'Quick reaction time',
        'Proper hand position'
      ],
      variations: [
        'One-Hand Catches: Alternate left and right hand',
        'Distraction Catches: Add noise or movement',
        'Wall Bounces: Throw against wall and catch rebound'
      ],
      commonMistakes: [
        'Looking away from ball',
        'Hard hands on contact',
        'Poor hand positioning',
        'Anticipating throw direction'
      ],
      videoUrl: '/videos/tennis-ball-reactions.mp4',
      thumbnailUrl: '/images/drills/tennis-ball-reactions.jpg'
    },

    // Strength Training Drills
    {
      id: 'str-001',
      name: 'Bodyweight Squats',
      category: 'strength',
      difficulty: 'Beginner',
      duration: '8 mins',
      equipment: 'None',
      space: 'Small (3x3 feet)',
      description: 'Build fundamental leg strength for explosive movements and injury prevention.',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower body by pushing hips back',
        'Keep chest up and knees behind toes',
        'Descend until thighs parallel to ground',
        'Drive through heels to return to start',
        'Perform 3 sets of 12-15 reps'
      ],
      keyPoints: [
        'Proper hip hinge movement',
        'Knee tracking over toes',
        'Full range of motion',
        'Controlled tempo'
      ],
      variations: [
        'Jump Squats: Add explosive jump at top',
        'Single Leg Squats: Pistol squat progression',
        'Pulse Squats: Add pulse at bottom position'
      ],
      commonMistakes: [
        'Knees caving inward',
        'Forward torso lean',
        'Partial range of motion',
        'Too fast tempo'
      ],
      videoUrl: '/videos/bodyweight-squats.mp4',
      thumbnailUrl: '/images/drills/bodyweight-squats.jpg'
    },

    // Recovery Drills
    {
      id: 'rec-001',
      name: 'Dynamic Hip Circles',
      category: 'recovery',
      difficulty: 'Beginner',
      duration: '5 mins',
      equipment: 'None',
      space: 'Small (3x3 feet)',
      description: 'Improve hip mobility and reduce stiffness after training sessions.',
      instructions: [
        'Stand on left leg, lift right knee to 90 degrees',
        'Rotate right leg in large circles',
        'Perform 10 circles forward, 10 backward',
        'Keep standing leg stable and core engaged',
        'Switch to left leg and repeat',
        'Focus on smooth, controlled movement'
      ],
      keyPoints: [
        'Full range of motion',
        'Stable standing leg',
        'Smooth circular motion',
        'Core engagement'
      ],
      variations: [
        'Small Circles: Reduce circle size for tight hips',
        'Figure 8s: Create figure-8 pattern',
        'Supported Circles: Hold wall for balance'
      ],
      commonMistakes: [
        'Rushed movement',
        'Poor standing leg stability',
        'Limited range of motion',
        'Arching lower back'
      ],
      videoUrl: '/videos/hip-circles.mp4',
      thumbnailUrl: '/images/drills/hip-circles.jpg'
    }
  ];

  // Filter drills based on category, search, difficulty, and equipment
  useEffect(() => {
    let filtered = drillDatabase;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(drill => drill.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(drill => 
        drill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drill.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(drill => drill.difficulty === difficultyFilter);
    }

    // Equipment filter
    if (equipmentFilter !== 'all') {
      if (equipmentFilter === 'none') {
        filtered = filtered.filter(drill => drill.equipment === 'None');
      } else {
        filtered = filtered.filter(drill => drill.equipment !== 'None');
      }
    }

    setFilteredDrills(filtered);
  }, [selectedCategory, searchTerm, difficultyFilter, equipmentFilter]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Drill Library</h2>
        
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search drills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-blue-400 focus:outline-none"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className="p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
          >
            <option value="all">All Equipment</option>
            <option value="none">No Equipment Needed</option>
            <option value="equipment">Equipment Required</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-blue-200">
          Found {filteredDrills.length} drill{filteredDrills.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Drill Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrills.map((drill) => (
          <div
            key={drill.id}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            onClick={() => onSelectDrill && onSelectDrill(drill)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(drill.category)}</span>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    {drill.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(drill.difficulty)}`}>
                    {drill.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-blue-200 text-sm mb-4 line-clamp-2">
              {drill.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-gray-400">Duration</div>
                <div className="text-white font-semibold">{drill.duration}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-gray-400">Equipment</div>
                <div className="text-white font-semibold">{drill.equipment}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 col-span-2">
                <div className="text-gray-400">Space Required</div>
                <div className="text-white font-semibold">{drill.space}</div>
              </div>
            </div>

            {/* Key Points Preview */}
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">Key Points:</div>
              <div className="text-sm text-blue-200">
                • {drill.keyPoints[0]}
                {drill.keyPoints.length > 1 && (
                  <span className="text-gray-400"> +{drill.keyPoints.length - 1} more</span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors group-hover:bg-blue-500">
              View Full Drill
            </button>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredDrills.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No drills found</h3>
          <p className="text-blue-200">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default DrillLibrary;
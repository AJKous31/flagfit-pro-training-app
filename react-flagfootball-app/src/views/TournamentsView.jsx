import React from 'react';
import { Link } from 'react-router-dom';

const TournamentsView = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
          <p className="text-gray-600 mt-2">Compete against other teams and players</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tournaments Coming Soon!</h2>
          <p className="text-gray-600 mb-6">
            We're building an exciting tournament system where you can compete against other teams, 
            join leagues, and showcase your skills in flag football competitions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-blue-900">Skill-Based Matchmaking</h3>
              <p className="text-sm text-blue-700">Compete against players of similar skill levels</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl mb-2">🏅</div>
              <h3 className="font-semibold text-green-900">Seasonal Leagues</h3>
              <p className="text-sm text-green-700">Join ongoing leagues with regular matches</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl mb-2">🎖️</div>
              <h3 className="font-semibold text-purple-900">Championships</h3>
              <p className="text-sm text-purple-700">Compete for ultimate bragging rights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentsView;
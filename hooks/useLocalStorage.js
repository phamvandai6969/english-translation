"use client";
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);
  
  return [storedValue, setValue];
}

// Hook cho progress
export function useProgress() {
  const [progress, setProgress] = useLocalStorage('translationProgress', {});
  
  const updateProgress = (exerciseId, data) => {
    setProgress(prev => {
      const userId = 'anonymous_' + (localStorage.getItem('userId') || 'default');
      const userProgress = prev[userId] || {};
      
      return {
        ...prev,
        [userId]: {
          ...userProgress,
          [exerciseId]: {
            ...userProgress[exerciseId],
            ...data,
            lastUpdated: new Date().toISOString()
          }
        }
      };
    });
  };
  
  const getProgress = (exerciseId) => {
    const userId = 'anonymous_' + (localStorage.getItem('userId') || 'default');
    return progress[userId]?.[exerciseId] || null;
  };
  
  const getUserStats = () => {
    const userId = 'anonymous_' + (localStorage.getItem('userId') || 'default');
    const userProgress = progress[userId] || {};
    
    const completed = Object.values(userProgress).filter(ex => ex.completed).length;
    const totalScore = Object.values(userProgress).reduce((sum, ex) => sum + (ex.score || 0), 0);
    const avgScore = completed > 0 ? totalScore / completed : 0;
    
    return {
      completed,
      avgScore: Math.round(avgScore * 10) / 10,
      totalExercises: Object.keys(userProgress).length
    };
  };
  
  return {
    progress,
    updateProgress,
    getProgress,
    getUserStats
  };
}

// Hook cho exercises
export function useExercises() {
  const [exercises, setExercises] = useLocalStorage('exercisesData', []);
  const [loading, setLoading] = useState(false);
  
  const loadExercises = () => {
    try {
      const db = JSON.parse(localStorage.getItem('translation_app_db') || '{"exercises":[]}');
      setExercises(db.exercises.filter(ex => ex.isActive));
    } catch (error) {
      console.error('Error loading exercises:', error);
      setExercises([]);
    }
  };
  
  useEffect(() => {
    loadExercises();
  }, []);
  
  const getExerciseById = (id) => {
    return exercises.find(ex => ex.id === id);
  };
  
  const getExercisesByLevel = (level) => {
    return exercises.filter(ex => ex.level === level);
  };
  
  const getExercisesByCategory = (category) => {
    return exercises.filter(ex => ex.category === category);
  };
  
  const getNextExercise = (currentId) => {
    const currentIndex = exercises.findIndex(ex => ex.id === currentId);
    if (currentIndex === -1 || currentIndex === exercises.length - 1) {
      return exercises[0];
    }
    return exercises[currentIndex + 1];
  };
  
  const getPreviousExercise = (currentId) => {
    const currentIndex = exercises.findIndex(ex => ex.id === currentId);
    if (currentIndex === -1 || currentIndex === 0) {
      return exercises[exercises.length - 1];
    }
    return exercises[currentIndex - 1];
  };
  
  return {
    exercises,
    loading,
    loadExercises,
    getExerciseById,
    getExercisesByLevel,
    getExercisesByCategory,
    getNextExercise,
    getPreviousExercise
  };
}
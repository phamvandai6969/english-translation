import bcrypt from 'bcryptjs';

const DB_KEY = 'translation_app_db';
const PROGRESS_KEY = 'translationProgress';

const DEFAULT_DB = {
  exercises: [], // From exercise.js, load initial if empty
  categories: [],
  settings: {
    adminPassword: bcrypt.hashSync('admin123', 10), // Hashed default
    maxExercises: 100,
    enableAutoBackup: true,
    backupInterval: 7,
    allowUserSuggestions: false
  }
};

export function getDatabase() {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : DEFAULT_DB;
}

export function updateDatabase(newData) {
  localStorage.setItem(DB_KEY, JSON.stringify(newData));
}

export function getExercises() {
  return getDatabase().exercises.filter(ex => ex.isActive);
}

export function addExercise(data) {
  const db = getDatabase();
  const newId = Math.max(...db.exercises.map(e => e.id || 0), 0) + 1;
  const newExercise = {
    ...data,
    id: newId,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  db.exercises.push(newExercise);
  updateDatabase(db);
  return newExercise;
}

export function updateExercise(id, data) {
  const db = getDatabase();
  const index = db.exercises.findIndex(e => e.id === id);
  if (index !== -1) {
    db.exercises[index] = { ...db.exercises[index], ...data };
    updateDatabase(db);
    return db.exercises[index];
  }
  throw new Error('Exercise not found');
}

export function deleteExercise(id) {
  const db = getDatabase();
  db.exercises = db.exercises.filter(e => e.id !== id);
  updateDatabase(db);
}

export function getCategories() {
  return getDatabase().categories;
}

export function addCategory(name) {
  const db = getDatabase();
  if (!db.categories.includes(name)) {
    db.categories.push(name);
    updateDatabase(db);
  }
  return db.categories;
}

export function verifyAdminPassword(input) {
  const db = getDatabase();
  const storedHash = db.settings.adminPassword;
  return bcrypt.compareSync(input, storedHash);
}

export function updateSettings(newSettings) {
  const db = getDatabase();
  if (newSettings.adminPassword) {
    newSettings.adminPassword = bcrypt.hashSync(newSettings.adminPassword, 10);
  }
  db.settings = { ...db.settings, ...newSettings };
  updateDatabase(db);
}

// Initial load exercises if empty
if (getDatabase().exercises.length === 0) {
  // Add from exercise.js if needed, but assume user adds
}
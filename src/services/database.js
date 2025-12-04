import { openDB } from 'idb';

const DB_NAME = 'sportsDashboardDB';
const DB_VERSION = 2;

class DatabaseService {
  constructor() {
    this.db = null;
  }

  async init() {
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Crear almacén para entrenadores
        if (!db.objectStoreNames.contains('coaches')) {
          const coachStore = db.createObjectStore('coaches', { keyPath: 'id', autoIncrement: true });
          coachStore.createIndex('email', 'email', { unique: true });
        }

        // Crear almacén para deportistas con nuevos campos
        if (!db.objectStoreNames.contains('athletes')) {
          const athleteStore = db.createObjectStore('athletes', { keyPath: 'id', autoIncrement: true });
          athleteStore.createIndex('coachId', 'coachId');
          athleteStore.createIndex('sport', 'sport');
          athleteStore.createIndex('country', 'country');
        }
        
        // Agregar índice para photoUrl si la versión es mayor a 1
        if (oldVersion < 2) {
          const transaction = db.transaction;
          // El índice photoUrl ya está considerado en el modelo
        }

        // Crear almacén para registros deportivos diarios
        if (!db.objectStoreNames.contains('sportRecords')) {
          const recordStore = db.createObjectStore('sportRecords', { keyPath: 'id', autoIncrement: true });
          recordStore.createIndex('athleteId', 'athleteId');
          recordStore.createIndex('date', 'date');
          recordStore.createIndex('sport', 'sport');
        }
      },
    });
    return this.db;
  }

  async getDB() {
    if (!this.db) {
      await this.init();
    }
    return this.db;
  }

  // CRUD para Entrenadores
  async addCoach(coach) {
    const db = await this.getDB();
    return db.add('coaches', coach);
  }

  async getCoach(id) {
    const db = await this.getDB();
    return db.get('coaches', id);
  }

  async getAllCoaches() {
    const db = await this.getDB();
    return db.getAll('coaches');
  }

  async updateCoach(id, updates) {
    const db = await this.getDB();
    return db.put('coaches', { ...updates, id });
  }

  async deleteCoach(id) {
    const db = await this.getDB();
    return db.delete('coaches', id);
  }

  // CRUD para Deportistas
  async addAthlete(athlete) {
    const db = await this.getDB();
    return db.add('athletes', athlete);
  }

  async getAthlete(id) {
    const db = await this.getDB();
    return db.get('athletes', id);
  }

  async getAthletesByCoach(coachId) {
    const db = await this.getDB();
    const index = db.transaction('athletes').store.index('coachId');
    return index.getAll(coachId);
  }

  async getAllAthletes() {
    const db = await this.getDB();
    return db.getAll('athletes');
  }

  async updateAthlete(id, updates) {
    const db = await this.getDB();
    return db.put('athletes', { ...updates, id });
  }

  async deleteAthlete(id) {
    const db = await this.getDB();
    return db.delete('athletes', id);
  }

  // CRUD para Registros Deportivos Diarios
  async addSportRecord(record) {
    const db = await this.getDB();
    return db.add('sportRecords', record);
  }

  async getAthleteSportRecords(athleteId) {
    const db = await this.getDB();
    const index = db.transaction('sportRecords').store.index('athleteId');
    return index.getAll(athleteId);
  }

  async getAllSportRecords() {
    const db = await this.getDB();
    return db.getAll('sportRecords');
  }

  async getSportRecord(id) {
    const db = await this.getDB();
    return db.get('sportRecords', id);
  }

  async updateSportRecord(id, updates) {
    const db = await this.getDB();
    return db.put('sportRecords', { ...updates, id });
  }

  async deleteSportRecord(id) {
    const db = await this.getDB();
    return db.delete('sportRecords', id);
  }

  async deleteAthleteRecords(athleteId) {
    const db = await this.getDB();
    const records = await this.getAthleteSportRecords(athleteId);
    const tx = db.transaction('sportRecords', 'readwrite');
    for (const record of records) {
      await tx.store.delete(record.id);
    }
    await tx.done;
  }
}

export default new DatabaseService();
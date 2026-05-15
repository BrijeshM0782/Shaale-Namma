import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  addDoc,
  deleteDoc,
  serverTimestamp,
  limit,
  where
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Meal, Facility, Student, Feedback, OperationType, FirestoreErrorInfo } from '../types';
import { formatDate } from '../lib/utils';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dbService = {
  // Meals
  async getTodayMeal(): Promise<Meal | null> {
    const today = formatDate(new Date());
    const path = `dailyMeals/${today}`;
    try {
      const docRef = doc(db, 'dailyMeals', today);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Meal;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async uploadMeal(meal: Omit<Meal, 'id'>) {
    const today = meal.date;
    const path = `dailyMeals/${today}`;
    try {
      await setDoc(doc(db, 'dailyMeals', today), meal);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteMeal(date: string) {
    const path = `dailyMeals/${date}`;
    try {
      await deleteDoc(doc(db, 'dailyMeals', date));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Facilities
  async getFacilities(): Promise<Facility[]> {
    const path = 'facilities';
    try {
      const q = query(collection(db, 'facilities'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Facility));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  async addFacility(facility: Omit<Facility, 'id'>) {
    const path = 'facilities';
    try {
      await addDoc(collection(db, 'facilities'), facility);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteFacility(id: string) {
    const path = `facilities/${id}`;
    try {
      await deleteDoc(doc(db, 'facilities', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Students
  async getStudents(): Promise<Student[]> {
    const path = 'students';
    try {
      const q = query(collection(db, 'students'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  async addStudent(student: Omit<Student, 'id'>) {
    const path = 'students';
    try {
      await addDoc(collection(db, 'students'), student);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteStudent(id: string) {
    const path = `students/${id}`;
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Feedback
  async submitFeedback(message: string, isAnonymous: boolean) {
    const path = 'feedback';
    try {
      const feedback = {
        message,
        isAnonymous,
        timestamp: new Date().toISOString(),
        userId: isAnonymous ? null : auth.currentUser?.uid || 'guest'
      };
      await addDoc(collection(db, 'feedback'), feedback);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getFeedback(): Promise<Feedback[]> {
    const path = 'feedback';
    try {
      const q = query(collection(db, 'feedback'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  }
};

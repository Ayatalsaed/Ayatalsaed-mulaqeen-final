
import { RobotConfig, Challenge, SensorType } from '../types';

// --- Database Types ---

export interface Student {
  id: number;
  name: string;
  progress: number;
  status: 'Active' | 'Needs Help' | 'Inactive';
  lastActive: string;
  avatar: string;
}

export interface Assignment {
  id: number;
  title: string;
  due: string;
  completed: number;
  total: number;
  status: 'Active' | 'Closed' | 'Upcoming';
}

// --- Default Data (Seeds) ---

const DEFAULT_ROBOT_CONFIG: RobotConfig = {
  name: 'المستكشف 1',
  type: 'rover',
  sensors: ['ultrasonic'],
  sensorConfig: {
    ultrasonic: { range: 200 },
    infrared: { sensitivity: 50 },
    color: { illumination: true },
    gyro: { axis: '3-axis' },
    camera: { resolution: '720p', illumination: false },
    lidar: { range: 8, sampleRate: 4000 },
    imu: { accelRange: '4g', gyroRange: '500dps' },
    gps: { updateRate: '1Hz' },
    camera_depth: { resolution: '480p', technology: 'Stereo' }
  },
  color: '#10b981',
  branding: {
    primaryColor: '#10b981',
    secondaryColor: '#334155'
  }
};

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: 1, title: 'التحرك في المربع', description: 'برمج الروبوت ليتحرك في مسار مربع الشكل.', difficulty: 'Easy', completed: true },
  { id: 2, title: 'تفادي العقبات', description: 'استخدم حساس المسافة لتجنب الجدار.', difficulty: 'Medium', completed: false },
  { id: 3, title: 'اتباع الخط الأسود', description: 'استخدم حساسات الأشعة تحت الحمراء.', difficulty: 'Hard', completed: false },
];

const DEFAULT_STUDENTS: Student[] = [
  { id: 1, name: 'أحمد محمد', progress: 85, status: 'Active', lastActive: '2 min ago', avatar: 'AM' },
  { id: 2, name: 'سارة خالد', progress: 92, status: 'Active', lastActive: '1 hr ago', avatar: 'SK' },
  { id: 3, name: 'عمر فهد', progress: 45, status: 'Needs Help', lastActive: '2 days ago', avatar: 'OF' },
  { id: 4, name: 'نورة السعيد', progress: 78, status: 'Active', lastActive: '5 min ago', avatar: 'NS' },
  { id: 5, name: 'فيصل الراشد', progress: 60, status: 'Inactive', lastActive: '1 week ago', avatar: 'FR' },
];

const DEFAULT_ASSIGNMENTS: Assignment[] = [
  { id: 1, title: 'تحدي المتاهة الذكية', due: '2025-06-15', completed: 18, total: 25, status: 'Active' },
  { id: 2, title: 'برمجة الحساسات - المستوي 1', due: '2025-06-10', completed: 25, total: 25, status: 'Closed' },
  { id: 3, title: 'مشروع الذراع الآلي', due: '2025-06-20', completed: 5, total: 25, status: 'Upcoming' },
];

// --- Storage Keys ---
const KEYS = {
  ROBOT_CONFIG: 'mulaqqin_robot_config',
  CHALLENGES: 'mulaqqin_challenges',
  STUDENTS: 'mulaqqin_students',
  ASSIGNMENTS: 'mulaqqin_assignments',
};

// --- Database Service ---

export const db = {
  // Robot Config
  getRobotConfig: (): RobotConfig => {
    try {
      const stored = localStorage.getItem(KEYS.ROBOT_CONFIG);
      return stored ? JSON.parse(stored) : DEFAULT_ROBOT_CONFIG;
    } catch (e) {
      return DEFAULT_ROBOT_CONFIG;
    }
  },
  saveRobotConfig: (config: RobotConfig): void => {
    localStorage.setItem(KEYS.ROBOT_CONFIG, JSON.stringify(config));
  },

  // Challenges
  getChallenges: (): Challenge[] => {
    try {
      const stored = localStorage.getItem(KEYS.CHALLENGES);
      return stored ? JSON.parse(stored) : DEFAULT_CHALLENGES;
    } catch (e) {
      return DEFAULT_CHALLENGES;
    }
  },
  updateChallengeStatus: (id: number, completed: boolean): void => {
    const challenges = db.getChallenges();
    const updated = challenges.map(c => c.id === id ? { ...c, completed } : c);
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(updated));
  },

  // Students (Trainer)
  getStudents: (): Student[] => {
    try {
      const stored = localStorage.getItem(KEYS.STUDENTS);
      return stored ? JSON.parse(stored) : DEFAULT_STUDENTS;
    } catch (e) {
      return DEFAULT_STUDENTS;
    }
  },

  // Assignments (Trainer)
  getAssignments: (): Assignment[] => {
    try {
      const stored = localStorage.getItem(KEYS.ASSIGNMENTS);
      return stored ? JSON.parse(stored) : DEFAULT_ASSIGNMENTS;
    } catch (e) {
      return DEFAULT_ASSIGNMENTS;
    }
  },
  addAssignment: (assignment: Assignment): void => {
    const current = db.getAssignments();
    const updated = [assignment, ...current];
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(updated));
  },

  // Reset DB
  resetDatabase: () => {
    localStorage.removeItem(KEYS.ROBOT_CONFIG);
    localStorage.removeItem(KEYS.CHALLENGES);
    localStorage.removeItem(KEYS.STUDENTS);
    localStorage.removeItem(KEYS.ASSIGNMENTS);
    window.location.reload();
  }
};

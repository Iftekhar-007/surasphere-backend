export interface ICreateOrUpdateTeacherProfilePayload {
  name?: string;
  image?: string;
  bio?: string;
  phone?: string;
  gender?: string;
  qualifications?: string;
  experienceYears?: number;
  specialization?: string;
  maxStudents?: number;
}

export interface ICreateHomeTaskPayload {
  title: string;
  description: string;
  surahName?: string;
  startAyah?: number;
  endAyah?: number;
  dueDate?: Date | string;
  studentIds: string[]; // Can assign to specific student or multiple assigned students
}

export interface IGiveDailyFeedbackPayload {
  studentId: string;
  performanceRating: number; // 1 to 5 or 1 to 10
  feedbackComment: string;
  mistakesNotes?: string;
  nextDayLesson: string;
}

export interface IRecordDailyProgressPayload {
  studentId: string;
  sabqSurah?: string;
  sabqAyahRange?: string;
  sabqiSurah?: string;
  manzilJuz?: number;
  memorizationScore?: number;
  tajweedScore?: number;
  notes?: string;
}

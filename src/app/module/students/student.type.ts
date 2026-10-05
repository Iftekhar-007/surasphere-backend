import { VerificationStatus, TaskStatus } from "../../../generated/prisma/client";

export interface ICreateStudentProfilePayload {
  age?: number;
  gender?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  currentJuz?: number;
  currentSurah?: string;
  currentAyah?: number;
  targetSurah?: string;
  learningLevel?: string;
}

export interface IUpdateStudentProfilePayload {
  name?: string;
  image?: string;
  age?: number;
  gender?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  currentJuz?: number;
  currentSurah?: string;
  currentAyah?: number;
  targetSurah?: string;
  learningLevel?: string;
}

export interface ISubmitTaskPayload {
  submissionNote?: string;
  submissionAudioUrl?: string;
}

export interface ICreateTeacherReviewPayload {
  teacherId: string;
  rating: number; // 1 to 5
  comment: string;
}

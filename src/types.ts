/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  CLIENT = 'Client',
  FREELANCER = 'Freelancer',
  EMPLOYEE = 'Employee',
  ADMIN = 'Admin'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  status: 'Active' | 'Suspended' | 'PendingApproval';
  certificationLevel?: 'Beginner' | 'Professional' | 'Legal Specialist' | 'Medical Specialist';
  dialectSpecializations?: string[];
  availabilityStatus?: 'Available' | 'Busy' | 'Offline';
  dailyWordLimit?: number;
  walletBalance?: number;
  themePreference?: 'dark' | 'light';
  languagePreference?: 'ENG' | 'AMH';
}

export enum RequestStatus {
  DRAFT = 'Draft',
  PENDING_ASSIGNMENT = 'Pending Assignment',
  ASSIGNED = 'Assigned',
  IN_PROGRESS = 'In Progress',
  UNDER_REVIEW = 'Under Review',
  REVISION_REQUESTED = 'Revision Requested',
  APPROVED = 'Approved',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived'
}

export enum FileType {
  DOCUMENT = 'Document',
  MEDICAL = 'Medical',
  LEGAL = 'Legal',
  AUDIO = 'Audio',
  VIDEO = 'Video',
  OTHER = 'Other'
}

export interface TranslationSegment {
  id: string;
  source: string;
  target: string;
  comments?: string;
  approved?: boolean;
}

export interface CommentItem {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: string;
  segmentIndex?: number;
}

export interface VersionHistoryItem {
  id: string;
  version: string;
  updatedBy: string;
  updatedAt: string;
  completedFileName: string;
  completedContent: string;
}

export interface TranslationRequest {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  sourceLanguage: string;
  targetLanguage: string;
  fileType: FileType;
  wordCount: number;
  status: RequestStatus;
  urgency: 'Standard' | 'Urgent' | 'Express';
  assignedFreelancerId?: string;
  assignedFreelancerName?: string;
  estimatedDelivery?: string;
  fileName?: string;
  fileSize?: string;
  completedFileName?: string;
  completedContent?: string;
  createdAt: string;
  price?: number;
  dialect?: string;
  isConfidential?: boolean;
  isRecurring?: boolean;
  recurringFrequency?: 'Daily' | 'Weekly' | 'Monthly' | 'None';
  progressPercentage?: number;
  revisionCount?: number;
  
  // Advanced SaaS Translation Management tools
  segments?: TranslationSegment[];
  comments?: CommentItem[];
  versions?: VersionHistoryItem[];
  feedbackRating?: number; // 1 to 5 star
  feedbackText?: string;
}

export interface FreelancerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  sourceLanguages: string[];
  targetLanguages: string[];
  specializations: string[];
  experienceYears: number;
  education: string;
  portfolioLink?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  feedbackRating: string;
  createdAt: string;
}

export interface FeedbackSubmission {
  id: string;
  senderName: string;
  email: string;
  role: string;
  instructionRating: string;
  projectFeedback: string;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface GlossaryTerm {
  id: string;
  termEn: string;
  termAmh: string;
  definition?: string;
  category: string;
}

export interface TranslationMemoryMatch {
  id: string;
  sourceText: string;
  translatedText: string;
  matchScore: number;
}

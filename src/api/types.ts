export type CompetitionStage =
  | 'upcoming'
  | 'registration_open'
  | 'registration_closed'
  | 'submission_open'
  | 'submission_closed'
  | 'results_declared';

export interface Judge {
  name: string;
  title: string;
  experience: string;
  photoUrl: string;
  introVideoUrl?: string;
}

export interface Reward {
  position: number;
  label: string;
  amount: number;
}

export interface PreviousWinner {
  name: string;
  position: string;
  thumbnailUrl: string;
  videoUrl?: string;
}

export interface Competition {
  _id: string;
  title: string;
  tags: string[];
  category: string;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  bookedSpots: number;
  judge: Judge;
  registrationStartAt: string;
  registrationEndAt: string;
  submissionStartAt: string;
  submissionEndAt: string;
  resultDate: string;
  previousWinners: PreviousWinner[];
  aboutText: string;
  judgingParameters: string[];
  rulesAndEligibility: string[];
  rewards: Reward[];
  disclaimer?: string;
  refundPolicyUrl?: string;
  spotsLeft: number;
  currentStage: CompetitionStage;
  isRegistered: boolean;
  serverTime: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegistrationResponse {
  message: string;
  registration: {
    _id: string;
    competitionId: string;
    userId: string;
    status: string;
    registeredAt: string;
  };
}

export interface SubmissionResponse {
  message: string;
  submission: {
    _id: string;
    competitionId: string;
    userId: string;
    registrationId: string;
    submissionUrl: string;
    notes?: string;
    submittedAt: string;
  };
}

export interface ApiErrorResponse {
  message: string;
  currentStage?: CompetitionStage;
}

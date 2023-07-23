import { Timestamp } from "firebase-admin/firestore";

export type RequestMethod = "GET" | "PUT" | "DELETE" | "POST";

export type Metadata = {
  creator: string;
  pollID: string;
  profile_url: string;
  title: string;
};

export type RTDBData = {
  userId: string;
  timestamp: Timestamp;
  timeStarted: Timestamp;
  approvers: number;
  abstained: number;
  disapprovers: number;
  maxApprovers: number;
  maxParticipants: number;
  maxDisapprovers: number;
};

export type UserData = {
  history: {
    maxApproval: number;
    maxDisapproval: number;
    maxParticipants: number;
    timestamp: Timestamp;
  }[];
  timePolled: number;
};

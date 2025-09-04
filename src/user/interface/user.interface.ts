import { Types } from "mongoose";
import { Onboarding } from "src/onboarding/schemas/onboarding.schema";

export interface NewUser {
    id: string;
    email: string;
    onboarding?: Onboarding  | Types.ObjectId | null;
  }

import { COVER_LETTER_LAYOUT } from "../enum";

export interface ICoverLetterPDF {
  fullname: string;
  city: string;
  country: string;
  postalcode: string;
  email: string;
  phone: string;
  companyName: string;
  paragraphs: string[]; // Assuming this is an array of strings
  jobTitle:string
  coverLetterLayout:COVER_LETTER_LAYOUT
}

export interface ICoverLetterPDF {
  fullname: string;
  city: string;
  country: string;
  postalcode: string;
  email: string;
  phone: string;
  companyName: string;
  paragraphs: string[]; // Assuming this is an array of strings
}

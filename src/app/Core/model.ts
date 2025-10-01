export interface Iuser{
    name:string,
    email:string,
    phone:string,
    password:string,
    gender:boolean
}
export interface Ilogin{
    email:string,
    password:string
}
export interface IloginRes{
    token:string
}
// export interface DecodedToken {
//   sub: string;        // The parent's email
//   iat: number;        // Token creation timestamp
//   exp: number;        // Token expiration timestamp
//   familyId?: string; // Optional - only present if parent joined a family
// }
export interface DecodedToken {
  family_id: string;
  sub: string;
  iat: number;
  exp: number;
}
// export interface GrowthRecord {
//   id?: number;
//   additionalInfo?: string;
//   dateOfRecord: string; // "YYYY-MM-DD"
//   height?: number;
//   weight?: number;
//   type: 'EMOTIONAL' | 'PHYSICAL' | 'COGNITION';
//   status: 'ACHIEVED' | 'NOT_ACHIEVED';
//   childId: number;
// }

// export interface Milestone {
//   id?: number;
//   title: string;
//   category: string;
//   date: string;
//   status: 'COMPLETED' | 'UPCOMING';
// }


export interface ImedicalRecord {
  id?: number;
  type: 'VACCINATION' | 'CHECKUP' | 'ILLNESS' | 'INJURY' | 'ALLERGY' | 'MEDICATION' | 'OTHER';
  dateOfRecord: string; // ISO date
  description: string;
  fileType?: 'PDF' | 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'OTHER';
  fileName?: string;
  fileContent?: ArrayBuffer; // or string if it's base64
  fileSize?: number;
  fileContentType?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  childId: number;
}
export interface GrowthRecord {
  id?: number;
  additionalInfo?: string;
  dateOfRecord: string; // ISO format
  height?: number;
  weight?: number;
  type: 'EMOTIONAL' | 'PHYSICAL' | 'COGNITION';
  status: 'ACHIEVED' | 'NOT_ACHIEVED';
  childId: number;
}
export interface Review {
  id: number;
  content: string;
  type: string;
  stars: number;
  createdAt: string;
  parentId: number;
  parentName: string;
}
export interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}


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
export interface DecodedToken {
  family_id: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface ImedicalRecord {
  id?: number;
  type: 'VACCINATION' | 'CHECKUP' | 'ILLNESS' | 'INJURY' | 'ALLERGY' | 'MEDICATION' | 'OTHER';
  dateOfRecord: string; 
  description: string;
  fileType?: 'PDF' | 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'OTHER';
  fileName?: string;
  fileContent?: ArrayBuffer; 
  fileSize?: number;
  fileContentType?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  childId: number;
}
export interface GrowthRecord {
  id?: number;
  additionalInfo?: string;
  dateOfRecord: string; 
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


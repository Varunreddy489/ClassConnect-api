export type SendEmailParams={
  toMail: string;
  subject: string;
  body: string;
}
export type MessageTypes = {
  id?: string;
  body?: string;
  chatId: string;
  conversationId?: string;
  fileType?: string;
  fileUrl?: string;
  teacherId?: string;
  sender: Student;
  senderId?: string;
  createdAt: string;
  shouldShake?: boolean;
};


export type Student = {
  id?: string;
  year?: string;
  name?: string;
  email?: string;
  course?: string;
  semester?: string;
  studentId?: string;
  department?: string;
  phoneNumber?: number;
  profilePic?: string | null;
};
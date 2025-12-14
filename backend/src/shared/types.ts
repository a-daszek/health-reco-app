export type UserType = {
  _id: string;
  email: string;
  password: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  bloodResults?: BloodType[];
};

export type BloodType = {
  _id: string;
  date: string;
  hemoglobin?: number;
  wbc?: number;
  platelets?: number;
  glucose?: number;
  cholesterolTotal?: number;
};

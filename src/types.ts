export interface Loan {
  id: string;
  borrowerName: string;
  address: string;
  phone: string;
  references: string[];
  amount: number;
  interestRate: number;
  dueDate: string;
  status: 'open' | 'current' | 'overdue';
  isPaid: boolean;
}

export interface LoanFormData extends Omit<Loan, 'id' | 'status'> {
  amount: string | number;
  interestRate: string | number;
}
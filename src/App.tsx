import React, { useState, useEffect } from 'react';
import { PlusCircle, X, LogOut } from 'lucide-react';
import LoanForm from './components/LoanForm';
import LoanList from './components/LoanList';
import LoginScreen from './components/LoginScreen';
import type { Loan, LoanFormData } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('loans');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoans((currentLoans) =>
        currentLoans.map((loan) => ({
          ...loan,
          status: loan.isPaid 
            ? loan.status 
            : new Date(loan.dueDate) < new Date() 
              ? 'overdue' 
              : 'current'
        }))
      );
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (data: LoanFormData) => {
    const newLoan: Loan = {
      ...data,
      id: crypto.randomUUID(),
      status: 'open',
      isPaid: false
    };
    setLoans([...loans, newLoan]);
    setShowForm(false);
  };

  const toggleLoanStatus = (id: string) => {
    if (window.confirm('Tem certeza que deseja alterar o status deste empréstimo?')) {
      setLoans(
        loans.map((loan) =>
          loan.id === id ? { ...loan, isPaid: !loan.isPaid } : loan
        )
      );
    }
  };

  const deleteLoan = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este empréstimo?')) {
      setLoans(loans.filter(loan => loan.id !== id));
    }
  };

  const setLoanStatus = (id: string, status: 'open' | 'current') => {
    setLoans(
      loans.map((loan) =>
        loan.id === id ? { ...loan, status } : loan
      )
    );
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-xl mx-auto p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Empréstimos</h1>
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base"
            >
              {showForm ? (
                <>
                  <X className="w-5 h-5" />
                  Cancelar
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Novo Empréstimo
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-base"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <LoanForm onSubmit={handleSubmit} />
          </div>
        )}

        <LoanList 
          loans={loans} 
          onToggleStatus={toggleLoanStatus}
          onDelete={deleteLoan}
          onStatusChange={setLoanStatus}
        />
      </div>
    </div>
  );
}
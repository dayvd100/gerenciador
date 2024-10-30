import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { Loan, LoanStatus } from '../types';

interface LoanCardProps {
  loan: Loan;
  onStatusChange: (id: string, isPaid: boolean) => void;
}

export default function LoanCard({ loan, onStatusChange }: LoanCardProps) {
  const getLoanStatus = (): LoanStatus => {
    if (loan.isPaid) return 'paid';
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    return today > dueDate ? 'overdue' : 'current';
  };

  const status = getLoanStatus();

  const statusConfig = {
    current: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />,
      label: 'Em Dia'
    },
    overdue: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      icon: <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />,
      label: 'Atrasado'
    },
    paid: {
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
      icon: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />,
      label: 'Pago'
    }
  };

  const config = statusConfig[status];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = status === 'overdue';

  return (
    <div className={`rounded-lg border p-4 sm:p-6 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{loan.borrowerName}</h3>
          <p className="text-sm text-gray-600">{loan.phone}</p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {config.icon}
          <span className={`text-sm font-medium ${config.textColor}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Valor</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            {formatCurrency(loan.amount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Juros</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            {loan.interestRate}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Início</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            {formatDate(loan.startDate)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Vencimento</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            {formatDate(loan.dueDate)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Endereço</p>
        <p className="text-sm sm:text-base text-gray-900">{loan.address}</p>
      </div>

      {loan.contacts.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Contatos de Referência</p>
          <div className="space-y-2">
            {loan.contacts.map((contact, index) => (
              <div key={index} className="text-sm sm:text-base text-gray-900">
                <span className="font-medium">{contact.name}</span> -{' '}
                {contact.phone}
              </div>
            ))}
          </div>
        </div>
      )}

      {isOverdue && (
        <div className="flex items-center gap-2 p-3 bg-red-100 rounded-md mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">
            Este empréstimo está atrasado! Entre em contato com o tomador.
          </span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => onStatusChange(loan.id, !loan.isPaid)}
          className={`w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg text-base sm:text-sm font-medium ${
            loan.isPaid
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loan.isPaid ? 'Marcar como Não Pago' : 'Marcar como Pago'}
        </button>
      </div>
    </div>
  );
}
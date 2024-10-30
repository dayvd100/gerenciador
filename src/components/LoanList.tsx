import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Trash2, PlayCircle, PauseCircle, RefreshCw } from 'lucide-react';
import type { Loan } from '../types';

interface Props {
  loans: Loan[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'open' | 'current') => void;
}

export default function LoanList({ loans, onToggleStatus, onDelete, onStatusChange }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateTotalWithFees = (amount: number, interestRate: number) => {
    return amount * (1 + interestRate / 100);
  };

  const handleRenewal = (loan: Loan) => {
    if (window.confirm('Confirmar renovação do empréstimo? Isso indica que uma nova data de vencimento será definida.')) {
      const totalAmount = calculateTotalWithFees(loan.amount, loan.interestRate);
      const interestAmount = totalAmount - loan.amount;
      const paymentAmount = prompt('Digite o valor pago pelo cliente:');
      
      if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) < 0) {
        alert('Por favor, insira um valor válido.');
        return;
      }

      const payment = Number(paymentAmount);
      if (payment > totalAmount) {
        alert('O valor pago não pode ser maior que o valor total devido (incluindo juros).');
        return;
      }

      const newDueDate = prompt('Digite a nova data de vencimento (AAAA-MM-DD):');
      if (newDueDate && isValidDate(newDueDate)) {
        let newPrincipal = loan.amount;
        
        // Se o pagamento for maior que os juros, reduz o valor principal
        if (payment > interestAmount) {
          const principalPayment = payment - interestAmount;
          newPrincipal = loan.amount - principalPayment;
        }
        // Se o pagamento for menor ou igual aos juros, mantém o valor principal

        const updatedLoan = {
          ...loan,
          amount: newPrincipal,
          dueDate: newDueDate,
          status: 'current' as const
        };

        // Atualiza o empréstimo no localStorage
        const storedLoans = JSON.parse(localStorage.getItem('loans') || '[]');
        const updatedLoans = storedLoans.map((l: Loan) => 
          l.id === loan.id ? updatedLoan : l
        );
        localStorage.setItem('loans', JSON.stringify(updatedLoans));
        window.location.reload(); // Recarrega para atualizar a interface
      } else {
        alert('Data inválida. Use o formato AAAA-MM-DD');
      }
    }
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <div
          key={loan.id}
          className={`p-5 rounded-lg shadow-md ${
            loan.isPaid
              ? 'bg-green-50'
              : loan.status === 'overdue'
              ? 'bg-red-50'
              : loan.status === 'open'
              ? 'bg-yellow-50'
              : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">{loan.borrowerName}</h3>
            <div className="flex gap-2">
              {!loan.isPaid && (
                <>
                  <button
                    onClick={() => handleRenewal(loan)}
                    className="p-2 rounded-full text-blue-600 hover:text-blue-800"
                    title="Renovar empréstimo"
                  >
                    <RefreshCw className="w-7 h-7" />
                  </button>
                  <button
                    onClick={() => onStatusChange(loan.id, loan.status === 'open' ? 'current' : 'open')}
                    className={`p-2 rounded-full ${
                      loan.status === 'open'
                        ? 'text-yellow-600 hover:text-yellow-800'
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    {loan.status === 'open' ? (
                      <PlayCircle className="w-7 h-7" />
                    ) : (
                      <PauseCircle className="w-7 h-7" />
                    )}
                  </button>
                </>
              )}
              <button
                onClick={() => onToggleStatus(loan.id)}
                className={`p-2 rounded-full ${
                  loan.isPaid
                    ? 'text-green-600 hover:text-green-800'
                    : 'text-red-600 hover:text-red-800'
                }`}
              >
                {loan.isPaid ? (
                  <CheckCircle className="w-7 h-7" />
                ) : (
                  <XCircle className="w-7 h-7" />
                )}
              </button>
              <button
                onClick={() => onDelete(loan.id)}
                className="p-2 rounded-full text-gray-600 hover:text-gray-800"
              >
                <Trash2 className="w-7 h-7" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Endereço:</p>
              <p className="text-base">{loan.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefone:</p>
              <p className="text-base">{loan.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor Principal:</p>
              <p className="text-lg font-semibold">{formatCurrency(loan.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taxa de Juros:</p>
              <p className="text-base">{loan.interestRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor Total com Juros:</p>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(calculateTotalWithFees(loan.amount, loan.interestRate))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vencimento:</p>
              <p className="text-base">{formatDate(loan.dueDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status:</p>
              <div className="flex items-center gap-1 mt-1">
                {loan.status === 'overdue' && !loan.isPaid && (
                  <>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-base text-red-600">Atrasado</span>
                  </>
                )}
                {loan.isPaid && (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-base text-green-600">Pago</span>
                  </>
                )}
                {loan.status === 'open' && !loan.isPaid && (
                  <span className="text-base text-yellow-600">Em Aberto</span>
                )}
                {loan.status === 'current' && !loan.isPaid && (
                  <span className="text-base text-gray-600">Em Andamento</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Referências:</p>
            <ul className="list-disc list-inside space-y-1">
              {loan.references.map((ref, index) => (
                <li key={index} className="text-base">
                  {ref}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {loans.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum empréstimo cadastrado
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import type { LoanFormData } from '../types';

interface Props {
  onSubmit: (data: LoanFormData) => void;
}

export default function LoanForm({ onSubmit }: Props) {
  const [references, setReferences] = useState(['']);

  const [formData, setFormData] = useState<LoanFormData>({
    borrowerName: '',
    address: '',
    phone: '',
    references: [''],
    amount: '',
    interestRate: '',
    dueDate: '',
    isPaid: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount) || 0,
      interestRate: Number(formData.interestRate) || 0,
      references
    });
  };

  const addReference = () => {
    setReferences([...references, '']);
  };

  const removeReference = (index: number) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  const updateReference = (index: number, value: string) => {
    const newReferences = [...references];
    newReferences[index] = value;
    setReferences(newReferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-base font-medium text-gray-700 mb-1">Nome do Cliente</label>
        <input
          type="text"
          required
          className="block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
          value={formData.borrowerName}
          onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700 mb-1">Endereço</label>
        <input
          type="text"
          required
          className="block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700 mb-1">Telefone</label>
        <input
          type="tel"
          required
          className="block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700 mb-1">indicação </label>
        {references.map((ref, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <input
              type="text"
              required
              className="flex-1 h-12 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
              value={ref}
              onChange={(e) => updateReference(index, e.target.value)}
            />
            {index === references.length - 1 ? (
              <button
                type="button"
                onClick={addReference}
                className="p-3 text-blue-600 hover:text-blue-800"
              >
                <PlusCircle className="w-6 h-6" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => removeReference(index)}
                className="p-3 text-red-600 hover:text-red-800"
              >
                <MinusCircle className="w-6 h-6" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700 mb-1">Valor do Empréstimo</label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          className="block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700 mb-1">Taxa de Juros (%)</label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          className="block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
          value={formData.interestRate}
          onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-base font-medium text-gray-700 mb-1">Data de Vencimento</label>
        <input
          type="date"
          required
          className="block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-medium mt-6"
      >
        Cadastrar Empréstimo
      </button>
    </form>
  );
}
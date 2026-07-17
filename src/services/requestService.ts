'use client';

import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { TransactionType } from '@/constants';

/**
 * @fileOverview Production-Ready Financial Request Service.
 * Instead of direct balance updates, we create requests for Founder approval.
 */

export interface TransactionRequest {
  userId: string;
  type: TransactionType;
  category: string;
  amount: number;
  currency: string;
  recipient?: string;
  details?: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  referenceId: string;
}

export const RequestService = {
  /**
   * Submits a financial transaction for manual processing.
   */
  async submitRequest(data: Omit<TransactionRequest, 'status' | 'referenceId'>): Promise<string> {
    const referenceId = 'REQ-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const requestRef = await addDoc(collection(db, 'transaction_requests'), {
      ...data,
      status: 'pending',
      referenceId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return requestRef.id;
  },

  /**
   * Submits a Deposit request with receipt URL.
   */
  async submitDeposit(userId: string, amount: number, receiptUrl: string, details: any) {
    return this.submitRequest({
      userId,
      type: TransactionType.DEPOSIT,
      category: 'Funding',
      amount,
      currency: 'NGN',
      details: { ...details, receiptUrl }
    });
  },

  /**
   * Submits a Withdrawal request.
   */
  async submitWithdrawal(userId: string, amount: number, bankDetails: any) {
    return this.submitRequest({
      userId,
      type: TransactionType.WITHDRAWAL,
      category: 'Withdrawal',
      amount,
      currency: 'NGN',
      details: { bankDetails }
    });
  }
};

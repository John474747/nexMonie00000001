
"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  Copy, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Loader2, 
  Wallet,
  Upload,
  AlertCircle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { NexLogo } from '@/components/ui/NexLogo'
import { BottomNav } from '@/components/layout/BottomNav'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useUser, useDoc, db, storage } from '@/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function FundAccountPage() {
  const router = useRouter()
  const { user } = useUser()
  const { toast } = useToast()

  const [stage, setStage] = useState<'display' | 'confirm' | 'pending'>('display')
  const [loading, setLoading] = useState(false)
  const [banks, setBanks] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    amount: '',
    senderBank: '',
    reference: '',
    file: null as File | null
  })

  // Get founder bank details from Firestore
  const { data: config } = useDoc<any>({ table: 'app_config', id: 'bank_details' });

  useEffect(() => {
    fetch('/api/banks')
      .then(r => r.json())
      .then(setBanks)
      .catch((err) => {
        console.error('Failed to fetch banks:', err);
        setBanks([]);
      });
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFormData({ ...formData, file: e.target.files[0] });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.amount || !formData.senderBank) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill all required fields.' });
      return;
    }

    setLoading(true);
    try {
      let receiptUrl = '';
      if (formData.file) {
        const storageRef = ref(storage, `receipts/${user.uid}_${Date.now()}`);
        await uploadBytes(storageRef, formData.file);
        receiptUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'deposits'), {
        userId: user.uid,
        amount: Number(formData.amount),
        senderBank: formData.senderBank,
        reference: formData.reference,
        receiptUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      });

      setStage('pending');
    } catch (e) {
      console.error('Submission failed:', e);
      toast({ variant: 'destructive', title: 'Error', description: 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-32 bg-[#F8FAF9]">
      <header className="px-6 pt-6 sm:pt-10 pb-4 bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1A1A1A] border border-gray-100"><ChevronLeft size={22} /></button>
          <NexLogo />
          <div className="w-10" />
        </div>
        <h1 className="text-[22px] font-bold text-[#1A1A1A]">Fund Account</h1>
      </header>

      <div className="px-6 py-8">
        {stage === 'display' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="overflow-hidden border-none shadow-nex-soft rounded-[32px] bg-white">
              <div className="bg-primary/5 p-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank Name</p>
                  <p className="text-[18px] font-black text-accent">{config?.bankName || 'Moniepoint MFB'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Number</p>
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-50">
                    <p className="text-[24px] font-black tabular-nums">{config?.accountNumber || '5051528892'}</p>
                    <button onClick={() => { navigator.clipboard.writeText(config?.accountNumber || '5051528892'); toast({ title: "Copied!" }) }} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary"><Copy size={18} /></button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Name</p>
                  <p className="text-[15px] font-bold">{config?.accountName || 'NEXMONIE SOLUTIONS LTD'}</p>
                </div>
              </div>
            </Card>

            <button onClick={() => setStage('confirm')} className="w-full py-5 bg-[#1A1A1A] text-white font-bold rounded-[22px] shadow-xl flex items-center justify-center gap-3">
              I Have Made Payment <ArrowRight size={20} />
            </button>
          </div>
        )}

        {stage === 'confirm' && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right duration-500">
            <Card className="p-8 border-none shadow-nex-soft rounded-[32px] bg-white space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount Deposited (₦)</label>
                <Input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Bank</label>
                <Select value={formData.senderBank} onValueChange={(val) => setFormData({...formData, senderBank: val})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-medium">
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl">
                    {banks.map((b: any) => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative pt-4">
                <Input type="file" id="receipt" className="hidden" onChange={handleFileUpload} />
                <label htmlFor="receipt" className="w-full h-14 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 font-bold text-[13px] cursor-pointer">
                  {formData.file ? <CheckCircle2 className="text-emerald-500" /> : <Upload size={18} />}
                  {formData.file ? 'Receipt Uploaded' : 'Upload Payment Proof'}
                </label>
              </div>
            </Card>

            <button type="submit" disabled={loading} className="w-full py-5 bg-primary text-white font-bold rounded-[22px] shadow-lg flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : 'Submit Verification'}
            </button>
          </form>
        )}

        {stage === 'pending' && (
          <div className="text-center space-y-8 animate-in zoom-in duration-500 py-10">
            <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mx-auto">
              <Loader2 className="animate-spin" size={48} />
            </div>
            <h1 className="text-[28px] font-bold text-[#1A1A1A]">Deposit Submitted</h1>
            <p className="text-[15px] text-gray-500 px-8">Your deposit is pending verification. We will notify you once processed.</p>
            <button onClick={() => router.push('/')} className="w-full py-5 bg-[#1A1A1A] text-white font-bold rounded-[22px]">Return Home</button>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}

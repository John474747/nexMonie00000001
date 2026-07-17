"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bell, 
  User, 
  Search, 
  ChevronRight,
  ShieldCheck,
  Loader2,
  TrendingUp,
  Eye,
  EyeOff,
  Store,
  ChevronLeft,
  Copy,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  Upload
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser, useDoc } from '@/firebase'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { NexLogo } from '@/components/ui/NexLogo'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { BottomNav } from '@/components/layout/BottomNav'

type TransactionState = 'input' | 'payment' | 'verification' | 'success';

export default function FinancesScreen() {
  const router = useRouter()
  const { user } = useUser()
  const { toast } = useToast()
  
  const { data: wallet, loading: walletLoading } = useDoc<any>(user ? { table: 'wallets', id: user.uid } : null)
  
  const [showBalance, setShowBalance] = useState(true)
  const [activeAsset, setActiveAsset] = useState('USDT')
  const [p2pType, setP2pType] = useState<'BUY' | 'SELL'>('BUY')
  
  const [txModalOpen, setTxModalOpen] = useState(false)
  const [txState, setTxState] = useState<TransactionState>('input')
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null)
  const [spendAmount, setSpendAmount] = useState('')
  const [isReceiptUploaded, setIsReceiptUploaded] = useState(false)
  const [countdown, setCountdown] = useState(900)

  const handleMerchantOnboarding = () => {
    const balance = wallet?.available || 0;
    if (balance >= 75000) {
      toast({ title: "Instant Onboarding Approved!", description: "Welcome to the elite circle of merchants." });
    } else {
      toast({ 
        variant: "destructive", 
        title: "Deposit Required", 
        description: "Minimum balance of $50 (₦75,000) required for instant merchant status." 
      });
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (txState === 'payment' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [txState, countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  const openTrade = (merchant: any) => {
    setSelectedMerchant(merchant);
    setTxState('input');
    setTxModalOpen(true);
    setSpendAmount('');
    setIsReceiptUploaded(false);
    setCountdown(900);
  }

  const receiveAmount = spendAmount ? (Number(spendAmount) / 1453).toFixed(6) : "0.000000";

  return (
    <main className="min-h-screen pb-40 bg-[#F8FAF9]">
      <header className="px-5 sm:px-8 pt-10 pb-6 bg-white sticky top-0 z-40 border-b border-gray-50 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <NexLogo />
          <div className="flex items-center gap-3">
             <div className="relative p-1.5 cursor-pointer active:scale-95 transition-transform">
                <Bell size={24} className="text-[#1A1A1A]" />
                <div className="absolute top-1 right-1 w-4 h-4 bg-[#FF8882] rounded-full border-2 border-white flex items-center justify-center">
                   <span className="text-[8px] font-bold text-white tabular-nums">2</span>
                </div>
             </div>
             <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                <User size={20} className="text-gray-300" />
             </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search markets, symbols or merchants" 
            className="pl-11 h-12 rounded-2xl bg-gray-50 border-none text-[14px]" 
          />
        </div>
      </header>

      <div className="px-5 sm:px-8 py-6 space-y-6">
        <Card className="bg-[#008D83] p-6 sm:p-8 border-none text-white rounded-[28px] sm:rounded-[40px] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">Portfolio Value</span>
              <button onClick={() => setShowBalance(!showBalance)} className="opacity-60 hover:opacity-100 p-1">
                {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
            <h2 className="text-[28px] sm:text-[40px] font-bold tabular-nums tracking-tight leading-none mb-1">
              {showBalance ? (walletLoading ? "---" : `₦${Number(wallet?.available || 0).toLocaleString()}`) : "••••••••••"}
            </h2>
            <p className="text-[12px] font-bold text-[#D1FAE5] mb-6 flex items-center gap-1.5 tabular-nums">
               <TrendingUp size={14} /> +₦12,500.00 (0.69%)
            </p>

            <div className="flex gap-3">
              <button onClick={() => router.push('/fund-account')} className="flex-1 h-12 bg-white text-[#008D83] font-bold rounded-2xl active:scale-95 transition-all text-[14px]">
                Deposit
              </button>
              <button className="flex-1 h-12 bg-transparent border-2 border-white/30 text-white font-bold rounded-2xl active:scale-95 transition-all text-[14px]">
                Withdraw
              </button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-2">
           <GuideItem step="1" title="Select" desc="Find Ad" />
           <GuideItem step="2" title="Transfer" desc="Bank App" />
           <GuideItem step="3" title="Release" desc="Escrow" />
        </div>

        <div onClick={handleMerchantOnboarding} className="cursor-pointer">
           <Card className="p-5 border-none shadow-nex-soft rounded-[28px] bg-white flex items-center gap-4 group active:scale-[0.98] transition-all">
              <div className="w-12 h-12 rounded-[18px] bg-[#008D83]/5 flex items-center justify-center text-[#008D83]">
                 <Store size={24} />
              </div>
              <div className="flex-1">
                 <h4 className="text-[15px] font-bold text-slate-900 leading-tight">Become a P2P Merchant</h4>
                 <p className="text-[11px] text-gray-400 font-medium">Metal tier badges & 0 trade fees</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#FF8882] transition-colors" />
           </Card>
        </div>

        <section className="space-y-5">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-[20px] font-bold text-slate-900">Marketplace</h2>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                 <button onClick={() => setP2pType('BUY')} className={cn("px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all", p2pType === 'BUY' ? "bg-white text-[#008D83] shadow-sm" : "text-gray-400")}>BUY</button>
                 <button onClick={() => setP2pType('SELL')} className={cn("px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all", p2pType === 'SELL' ? "bg-white text-[#FF8882] shadow-sm" : "text-gray-400")}>SELL</button>
              </div>
           </div>

           <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-2 pb-2">
                {['USDT', 'BTC', 'ETH', 'USDC'].map((asset) => (
                  <button 
                    key={asset} 
                    onClick={() => setActiveAsset(asset)}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-[12px] font-bold transition-all border",
                      activeAsset === asset ? "bg-[#FF8882] text-white border-[#FF8882]" : "bg-white text-gray-400 border-gray-100"
                    )}
                  >
                    {asset}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
           </ScrollArea>

           <div className="space-y-4">
              <MerchantCard 
                name="NairaSwift_P2P" 
                completion="99.4%" 
                orders="3,120" 
                price="1,453.00" 
                min={10000} 
                max={500000} 
                onClick={() => openTrade({ name: "NairaSwift_P2P", completion: "99.4%", limitMin: 10000, limitMax: 500000 })}
              />
              <MerchantCard 
                name="Elite_Liquidity" 
                completion="100%" 
                orders="12,500" 
                price="1,452.80" 
                min={50000} 
                max={1500000} 
                onClick={() => openTrade({ name: "Elite_Liquidity", completion: "100%", limitMin: 50000, limitMax: 1500000 })}
              />
           </div>
        </section>
      </div>

      <Dialog open={txModalOpen} onOpenChange={setTxModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-[32px] sm:rounded-[40px] p-0 overflow-hidden border-none shadow-2xl bg-[#F8FAF9]">
           <div className="relative">
              <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
                 <button onClick={() => setTxModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-full"><ChevronLeft size={22} /></button>
                 <h3 className="text-[16px] font-bold text-slate-900">
                    {txState === 'input' && `Buy ${activeAsset}`}
                    {txState === 'payment' && 'Confirm Payment'}
                    {txState === 'verification' && 'Security Check'}
                    {txState === 'success' && 'Trade Successful'}
                 </h3>
                 <div className="w-10" />
              </div>

              <ScrollArea className="max-h-[80vh] p-6 sm:p-8">
                 {txState === 'input' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#008D83]/5 flex items-center justify-center text-[#008D83] font-bold text-xl italic border border-[#008D83]/10">{selectedMerchant?.name.charAt(0)}</div>
                          <div>
                             <h4 className="font-bold text-slate-900 text-[18px]">{selectedMerchant?.name}</h4>
                             <p className="text-[12px] font-bold text-[#008D83] uppercase tracking-widest">{selectedMerchant?.completion} Completion</p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">I want to pay</label>
                             <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-900 text-[20px]">₦</span>
                                <Input 
                                   value={spendAmount}
                                   onChange={(e) => setSpendAmount(e.target.value.replace(/\D/g, ''))}
                                   placeholder="0.00"
                                   className="h-16 pl-10 pr-6 rounded-[24px] bg-white border-none shadow-soft text-[22px] font-bold tabular-nums"
                                />
                             </div>
                             <p className="text-[10px] font-bold text-gray-400 ml-2 uppercase tracking-widest">
                                Limit: ₦{selectedMerchant?.limitMin.toLocaleString()} - ₦{selectedMerchant?.limitMax.toLocaleString()}
                             </p>
                          </div>

                          <div className="p-6 bg-[#008D83]/5 rounded-[28px] border border-[#008D83]/10 flex items-center justify-between">
                             <div className="space-y-1">
                                <p className="text-[10px] font-bold text-[#008D83] uppercase tracking-widest">I will receive</p>
                                <p className="text-[20px] font-bold text-[#008D83] tabular-nums">{receiveAmount}</p>
                             </div>
                             <span className="text-[14px] font-bold text-[#008D83]">{activeAsset}</span>
                          </div>
                       </div>

                       <button 
                          disabled={!spendAmount || Number(spendAmount) < selectedMerchant?.limitMin}
                          onClick={() => setTxState('payment')}
                          className="w-full h-16 bg-[#008D83] text-white font-bold rounded-[24px] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                          Initiate Secure Trade <ArrowRight size={20} />
                       </button>
                    </div>
                 )}

                 {txState === 'payment' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
                       <div className="flex items-center justify-between bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center"><Clock size={20} className="animate-pulse" /></div>
                             <span className="text-[22px] font-bold tabular-nums text-slate-900">{formatTime(countdown)}</span>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">To Pay</p>
                             <p className="text-[18px] font-bold text-[#008D83] tabular-nums">₦{Number(spendAmount).toLocaleString()}</p>
                          </div>
                       </div>

                       <div className="bg-[#FF8882]/10 p-5 rounded-[24px] border border-[#FF8882]/20 flex gap-4">
                          <Lock size={24} className="text-[#FF8882] shrink-0" />
                          <p className="text-[12px] text-[#FF8882] leading-relaxed font-bold">
                             CRITICAL: Do NOT write crypto terms (e.g. BTC, USDT) in your bank app memo.
                          </p>
                       </div>

                       <section className="space-y-4">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Seller Bank Details</label>
                          <Card className="p-6 sm:p-8 border-none shadow-soft rounded-[32px] bg-white space-y-6">
                             <BankRow label="Bank" value="Moniepoint MFB" />
                             <BankRow label="Account Name" value="NairaSwift Solutions" />
                             <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-4">
                                <div>
                                   <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Account Number</p>
                                   <p className="text-[24px] font-bold tabular-nums text-slate-900 tracking-[0.05em]">5051528892</p>
                                </div>
                                <button onClick={() => { navigator.clipboard.writeText('5051528892'); toast({ title: "Copied!" }) }} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#008D83] active:scale-90 transition-transform"><Copy size={20} /></button>
                             </div>
                             <BankRow label="Reference" value="NXM-9082" isRef />
                          </Card>
                       </section>

                       <section className="space-y-4">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Payment Proof</label>
                          <div 
                             onClick={() => setIsReceiptUploaded(true)}
                             className={cn(
                                "h-20 rounded-[24px] border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-all",
                                isReceiptUploaded ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-white border-gray-200 text-gray-400 hover:border-[#008D83]"
                             )}
                          >
                             {isReceiptUploaded ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                             <span className="text-[14px] font-bold">{isReceiptUploaded ? 'Receipt Uploaded' : 'Tap to Upload Receipt'}</span>
                          </div>
                       </section>

                       <button 
                          disabled={!isReceiptUploaded}
                          onClick={() => setTxState('verification')}
                          className="w-full h-16 bg-[#008D83] text-white font-bold rounded-[24px] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                          Transferred, Notify Seller <ChevronRight size={20} />
                       </button>
                    </div>
                 )}

                 {txState === 'verification' && (
                    <div className="space-y-8 py-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                       <div className="w-20 h-20 bg-[#008D83]/10 rounded-[30px] flex items-center justify-center text-[#008D83]">
                          <Loader2 size={40} className="animate-spin" />
                       </div>
                       <div className="space-y-2">
                          <h2 className="text-[22px] font-bold text-slate-900">Awaiting Seller Release</h2>
                          <p className="text-[14px] text-gray-500 px-8 leading-relaxed">The seller is verifying your payment. Your assets are currently secured in nexEscrow.</p>
                       </div>

                       <div className="pt-10 w-full">
                          <button 
                             onClick={() => setTxState('success')}
                             className="w-full py-4 bg-gray-900/5 text-gray-400 font-bold rounded-2xl text-[11px] uppercase tracking-widest border border-gray-100"
                          >
                             [ Sandbox: Simulate Seller Release ]
                          </button>
                       </div>
                    </div>
                 )}

                 {txState === 'success' && (
                    <div className="space-y-8 py-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                       <div className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-500 rounded-[32px] sm:rounded-[48px] flex items-center justify-center text-white shadow-2xl">
                          <CheckCircle2 size={56} className="sm:w-[72px] sm:h-[72px]" strokeWidth={2.5} />
                       </div>
                       <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-[#1A1A1A]">Order Complete!</h2>
                       <p className="text-[15px] sm:text-[16px] text-gray-500 px-4 leading-relaxed font-medium">
                        <span className="font-bold text-[#008D83] tabular-nums">+{receiveAmount} {activeAsset}</span> added to your wallet.
                       </p>
                       <button 
                          onClick={() => setTxModalOpen(false)}
                          className="w-full py-5 bg-[#1A1A1A] text-white font-bold rounded-[24px] shadow-xl active:scale-[0.98] transition-all"
                       >
                          Return to Portfolio
                       </button>
                    </div>
                 )}
              </ScrollArea>
           </div>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </main>
  )
}

function MerchantCard({ name, completion, orders, price, min, max, onClick }: any) {
  return (
    <Card className="p-5 sm:p-8 border-none shadow-nex-soft rounded-[28px] bg-white group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[18px] bg-gray-50 flex items-center justify-center text-[#008D83] font-bold italic text-xl border border-gray-100">{name.charAt(0)}</div>
          <div>
            <div className="flex items-center gap-1.5">
               <h4 className="text-[15px] font-bold text-slate-900">{name}</h4>
               <ShieldCheck size={16} className="text-blue-500" />
            </div>
            <p className="text-[11px] text-gray-400 font-bold tabular-nums uppercase tracking-widest">{completion} • {orders} trades</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[22px] font-bold tabular-nums text-[#008D83]">₦{price}</p>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">NGN / Unit</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-50 pt-5">
         <div>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-0.5">Limits</p>
            <p className="text-[13px] font-bold text-slate-900 tabular-nums">₦{min.toLocaleString()} - ₦{max.toLocaleString()}</p>
         </div>
         <button onClick={onClick} className="px-8 py-3 bg-[#008D83] text-white font-bold rounded-xl text-[12px] active:scale-95 transition-all">BUY</button>
      </div>
    </Card>
  )
}

function GuideItem({ step, title, desc }: any) {
  return (
    <div className="bg-white p-4 rounded-[22px] border border-gray-50 shadow-sm flex flex-col items-center text-center gap-1">
       <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center mb-1">{step}</span>
       <p className="text-[11px] font-bold text-slate-900 leading-none">{title}</p>
       <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{desc}</p>
    </div>
  )
}

function BankRow({ label, value, isRef }: any) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">{label}</span>
       <span className={cn("text-[14px] font-bold tabular-nums", isRef ? "text-[#FF8882]" : "text-slate-900")}>{value}</span>
    </div>
  )
}

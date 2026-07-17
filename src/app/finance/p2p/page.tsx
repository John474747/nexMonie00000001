"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  Filter, 
  Search, 
  ShieldCheck, 
  ArrowRightLeft,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { NexLogo } from '@/components/ui/NexLogo'
import { TradeModal } from '@/components/p2p/TradeModal'
import { ActiveTradeScreen } from '@/components/p2p/ActiveTradeScreen'
import { P2PListing, P2PTrade } from '@/types/p2p'
import { cn } from '@/lib/utils'
import { useUser, useCollection, db } from '@/firebase'
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, onSnapshot, orderBy } from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'

export default function P2PMarketplace() {
  const router = useRouter()
  const { user } = useUser()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState<'BUY' | 'SELL'>('BUY')
  const [assetType, setAssetType] = useState('USDT')
  const [selectedAd, setSelectedAd] = useState<any>(null)
  const [activeTrade, setActiveTrade] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch Listings from Firestore
  useEffect(() => {
    async function fetchListings() {
      if (!db) return
      setLoading(true)
      try {
        const q = query(
          collection(db, 'p2p_ads'),
          where('type', '==', activeTab.toLowerCase()),
          where('asset', '==', assetType),
          where('status', '==', 'active')
        )
        const snap = await getDocs(q)
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setListings(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [activeTab, assetType])

  const handleInitiateTrade = async (fiat: number, asset: number) => {
    if (!user || !selectedAd || !db) return

    try {
      const docRef = await addDoc(collection(db, 'p2p_orders'), {
        adId: selectedAd.id,
        buyerId: user.uid,
        sellerId: selectedAd.createdBy,
        asset: selectedAd.asset,
        quantity: asset,
        fiatAmount: fiat,
        price: selectedAd.price,
        status: 'pending',
        referenceId: 'NEX-ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: serverTimestamp(),
      })

      setActiveTrade({ id: docRef.id, status: 'pending', fiatAmount: fiat, asset: selectedAd.asset })
      setSelectedAd(null)
      toast({ title: 'Order Created', description: 'Please complete payment within 15 minutes.' })
    } catch (error: any) {
      console.error('P2P order creation failed:', error);
      toast({ variant: 'destructive', title: 'Order Failed', description: error.message })
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAF9] pb-20">
      <header className="px-6 pt-10 pb-4 bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1A1A1A]">
            <ChevronLeft size={22} />
          </button>
          <NexLogo />
          <div className="w-10" />
        </div>

        {!activeTrade && (
          <div className="flex items-center justify-between bg-gray-100 p-1.5 rounded-[22px]">
            <button 
              onClick={() => setActiveTab('BUY')}
              className={cn(
                "flex-1 py-3 rounded-2xl text-xs font-black uppercase transition-all",
                activeTab === 'BUY' ? "bg-emerald-500 text-white shadow-lg" : "text-gray-400"
              )}
            >
              BUY
            </button>
            <button 
              onClick={() => setActiveTab('SELL')}
              className={cn(
                "flex-1 py-3 rounded-2xl text-xs font-black uppercase transition-all",
                activeTab === 'SELL' ? "bg-red-500 text-white shadow-lg" : "text-gray-400"
              )}
            >
              SELL
            </button>
          </div>
        )}
      </header>

      <div className="px-6 py-6">
        {activeTrade ? (
          <div className="text-center py-20 bg-white rounded-[32px] shadow-nex-soft border border-gray-100">
             <ShieldCheck className="mx-auto text-primary mb-4" size={48} />
             <h2 className="text-nex-h3 font-bold mb-2">Order Initiated</h2>
             <p className="text-gray-400 text-xs px-10">Please proceed to order details to complete payment.</p>
             <button onClick={() => router.push(`/p2p/order/${activeTrade.id}`)} className="mt-8 px-8 py-4 bg-primary text-white font-bold rounded-2xl">Go to Order</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input placeholder="Amount..." className="w-full h-12 pl-11 pr-4 bg-white rounded-xl border-none shadow-sm text-sm" />
              </div>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {['USDT', 'BTC', 'ETH', 'USDC'].map(asset => (
                <button 
                  key={asset}
                  onClick={() => setAssetType(asset)}
                  className={cn(
                    "px-5 py-2 rounded-full text-[11px] font-bold uppercase border transition-all",
                    assetType === asset ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-gray-400 border-gray-100"
                  )}
                >
                  {asset}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="animate-spin text-primary" size={24} />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fetching Offers...</p>
                </div>
              ) : listings.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
                   <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active {activeTab} ads</p>
                </div>
              ) : (
                listings.map((ad) => (
                  <Card key={ad.id} className="p-6 border-none shadow-soft rounded-[32px] bg-white group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary font-black italic border border-gray-100">
                          {ad.merchantName?.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="text-sm font-bold text-[#1A1A1A]">{ad.merchantName}</h4>
                            <ShieldCheck size={14} className="text-blue-500" fill="currentColor" />
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold tabular-nums">
                            99.8% completion
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black italic text-primary tracking-tighter tabular-nums">
                          ₦{ad.price?.toLocaleString()}
                        </p>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">NGN / {ad.asset}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-4">
                      <div>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-0.5">Available</p>
                        <p className="text-[12px] font-black italic text-gray-600 tabular-nums">{ad.availableQuantity} {ad.asset}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Limits</p>
                        <p className="text-[12px] font-black italic text-[#1A1A1A] tabular-nums">₦{ad.minLimit?.toLocaleString()} - ₦{ad.maxLimit?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {ad.paymentMethods?.map((p: any) => (
                          <span key={p} className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 rounded-full text-[8px] font-bold uppercase">{p}</span>
                        ))}
                      </div>
                      <button 
                        onClick={() => setSelectedAd(ad)}
                        className={cn(
                          "px-8 py-2.5 rounded-xl font-black italic text-[11px] shadow-lg active:scale-95 transition-all text-white",
                          activeTab === 'BUY' ? "bg-emerald-500 shadow-emerald-500/20" : "bg-red-500 shadow-red-500/20"
                        )}
                      >
                        {activeTab} {ad.asset}
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <TradeModal 
        listing={selectedAd} 
        onClose={() => setSelectedAd(null)}
        onConfirm={handleInitiateTrade}
      />
    </main>
  )
}

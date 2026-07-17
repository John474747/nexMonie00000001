import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/firebase/admin';

const MOCK_BANKS = [
  { id: '1', name: 'Access Bank' },
  { id: '2', name: 'Zenith Bank' },
  { id: '3', name: 'Guaranty Trust Bank (GTB)' },
  { id: '4', name: 'First Bank of Nigeria' },
  { id: '5', name: 'United Bank for Africa (UBA)' },
  { id: '6', name: 'Moniepoint MFB' },
  { id: '7', name: 'Opay' },
  { id: '8', name: 'Kuda Microfinance Bank' },
  { id: '9', name: 'PalmPay' },
  { id: '10', name: 'Standard Chartered' },
  { id: '11', name: 'Fidelity Bank' },
  { id: '12', name: 'Union Bank' },
  { id: '13', name: 'Stanbic IBTC' },
  { id: '14', name: 'Wema Bank' },
  { id: '15', name: 'Sterling Bank' },
];

/**
 * GET /api/banks
 * Authenticated route to fetch bank list.
 */
export async function GET(request: Request) {
  try {
    // Security check: Verify Firebase ID Token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(idToken);

    // Fetch from Firestore Admin
    const banksSnap = await adminDb.collection('banks').orderBy('name').get();
    
    if (banksSnap.empty) {
      return NextResponse.json(MOCK_BANKS);
    }

    const banks = banksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(banks);
  } catch (error) {
    // Graceful fallback for dev or uninitialized DB
    return NextResponse.json(MOCK_BANKS);
  }
}

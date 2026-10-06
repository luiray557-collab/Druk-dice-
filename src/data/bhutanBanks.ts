// Bhutanese Banking System and House Treasury Configuration

export interface BhutanBank {
  id: string;
  name: string;
  shortName: string;
  appCode: string;
  color: string;
  prefix: string;
  description: string;
}

export const BHUTAN_BANKS: BhutanBank[] = [
  {
    id: 'bob',
    name: 'Bank of Bhutan Ltd',
    shortName: 'BOB',
    appCode: 'mBOB',
    color: '#D97706',
    prefix: '109 / 130',
    description: 'Oldest and largest premier commercial bank in Bhutan',
  },
  {
    id: 'bnbl',
    name: 'Bhutan National Bank Ltd',
    shortName: 'BNBL',
    appCode: 'B-Ngul (MPAY)',
    color: '#0284C7',
    prefix: '200 / 500',
    description: 'Leading nationwide digital retail banking network',
  },
  {
    id: 'dpnbl',
    name: 'Druk PNB Bank Ltd',
    shortName: 'DPNBL',
    appCode: 'Druk PNB Mobile',
    color: '#E11D48',
    prefix: '010 / 020',
    description: 'International joint-venture bank across all dzongkhags',
  },
  {
    id: 'tbank',
    name: 'Tashi Bank Ltd',
    shortName: 'T-Bank',
    appCode: 'TPay',
    color: '#10B981',
    prefix: '701 / 702',
    description: 'Tashi Group commercial and private banking arm',
  },
  {
    id: 'bdbl',
    name: 'Bhutan Development Bank Ltd',
    shortName: 'BDBL',
    appCode: 'eTeeru',
    color: '#8B5CF6',
    prefix: '301 / 302',
    description: 'Rural and nationwide agricultural development banking',
  },
];

export interface BhutaneseBankAccount {
  id: string;
  bankId: string;
  bankName: string;
  shortName?: string;
  appCode: string;
  accountNumber: string;
  accountHolder: string;
  phone: string;
  isDefault: boolean;
}

// User specified House Commission Account
export const HOUSE_COMMISSION_ACCOUNT = {
  bankName: 'Bank of Bhutan Ltd (BOB)',
  appCode: 'mBOB',
  accountNumber: '130174063',
  accountHolder: 'House Commissioner Treasury',
  description: 'Designated beneficiary for all 5% match tournament commissions',
};

// Initial default preset accounts for convenient testing
export const INITIAL_PLAYER_ACCOUNTS: BhutaneseBankAccount[] = [
  {
    id: 'acc_bob_1',
    bankId: 'bob',
    bankName: 'Bank of Bhutan Ltd',
    shortName: 'BOB',
    appCode: 'mBOB',
    accountNumber: '109552819',
    accountHolder: 'Karma Tshering',
    phone: '+975 17892341',
    isDefault: true,
  },
  {
    id: 'acc_bnbl_1',
    bankId: 'bnbl',
    bankName: 'Bhutan National Bank Ltd',
    shortName: 'BNBL',
    appCode: 'B-Ngul (MPAY)',
    accountNumber: '200481923',
    accountHolder: 'Pema Wangmo',
    phone: '+975 77123456',
    isDefault: false,
  },
];

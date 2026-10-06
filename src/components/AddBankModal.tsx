import React, { useState } from 'react';
import { X, Building2, CreditCard, User, Phone, CheckCircle, Shield } from 'lucide-react';
import { BHUTAN_BANKS, BhutaneseBankAccount } from '../data/bhutanBanks';
import { sounds } from '../utils/audio';

interface AddBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: BhutaneseBankAccount) => void;
}

export const AddBankModal: React.FC<AddBankModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [selectedBankId, setSelectedBankId] = useState<string>('bob');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [phone, setPhone] = useState<string>('17');
  const [setAsDefault, setSetAsDefault] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentBank = BHUTAN_BANKS.find((b) => b.id === selectedBankId) || BHUTAN_BANKS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim() || accountNumber.trim().length < 6) {
      setErrorMsg('Please enter a valid bank account number (at least 6 digits).');
      return;
    }
    if (!accountHolder.trim()) {
      setErrorMsg('Please enter the account holder name.');
      return;
    }

    const newAcc: BhutaneseBankAccount = {
      id: 'acc_' + Date.now(),
      bankId: currentBank.id,
      bankName: currentBank.name,
      shortName: currentBank.shortName,
      appCode: currentBank.appCode,
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim(),
      phone: `+975 ${phone.trim()}`,
      isDefault: setAsDefault,
    };

    sounds.playCoinClink();
    onAddAccount(newAcc);
    setErrorMsg(null);
    setAccountNumber('');
    setAccountHolder('');
    onClose();
  };

  const handleQuickFill = (bankId: string) => {
    const bank = BHUTAN_BANKS.find((b) => b.id === bankId) || BHUTAN_BANKS[0];
    setSelectedBankId(bankId);
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    setAccountNumber(randomDigits.toString());
    setAccountHolder('Dechen Pelzom');
    setPhone('17' + Math.floor(100000 + Math.random() * 900000));
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#241408] border border-amber-800/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#2C180B] border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-amber-100">
                Link Bhutanese Bank Account
              </h2>
              <p className="text-xs text-amber-400/80">
                Connect your account from any Bhutanese commercial bank
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-700/60 text-xs text-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Bank Selection */}
          <div>
            <label className="text-xs uppercase tracking-wider text-amber-300/80 font-semibold block mb-2">
              Choose Bhutanese Bank
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BHUTAN_BANKS.map((bank) => {
                const isSelected = selectedBankId === bank.id;
                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => {
                      setSelectedBankId(bank.id);
                      setErrorMsg(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#3A200E] border-amber-400 ring-2 ring-amber-500/30 shadow-md'
                        : 'bg-[#1C0E05] border-amber-950 hover:border-amber-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-100">{bank.shortName}</span>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-stone-400 block mt-0.5 truncate">
                      {bank.appCode}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-400 mt-1.5">
              Selected: <strong className="text-amber-200">{currentBank.name}</strong> ({currentBank.appCode})
            </p>
          </div>

          {/* Account Number */}
          <div>
            <label className="text-xs uppercase tracking-wider text-amber-300/80 font-semibold flex items-center gap-1.5 mb-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 109283741 or 200481923"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C0E05] border border-amber-900/60 focus:border-amber-400 focus:outline-none text-white font-mono text-sm placeholder:text-stone-600"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Typical prefix for {currentBank.shortName}: {currentBank.prefix}
            </span>
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="text-xs uppercase tracking-wider text-amber-300/80 font-semibold flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Account Holder Full Name
            </label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="e.g. Tashi Dorji, Sonam Wangchuk"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C0E05] border border-amber-900/60 focus:border-amber-400 focus:outline-none text-white text-sm placeholder:text-stone-600"
            />
          </div>

          {/* Registered Mobile Number */}
          <div>
            <label className="text-xs uppercase tracking-wider text-amber-300/80 font-semibold flex items-center gap-1.5 mb-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              Registered Bhutan Mobile Number
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2.5 rounded-xl bg-[#1C0E05] border border-amber-900/60 text-stone-400 text-xs font-mono">
                +975
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="17XXXXXX or 77XXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C0E05] border border-amber-900/60 focus:border-amber-400 focus:outline-none text-white font-mono text-sm placeholder:text-stone-600"
              />
            </div>
          </div>

          {/* Set as Default Toggle */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="setAsDefault"
              checked={setAsDefault}
              onChange={(e) => setSetAsDefault(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-[#1C0E05] border-amber-900 cursor-pointer"
            />
            <label htmlFor="setAsDefault" className="text-xs text-amber-200 cursor-pointer">
              Set as primary bank account for stakes and prize deposits
            </label>
          </div>

          {/* Quick Fill Previews */}
          <div className="pt-2 border-t border-amber-900/30">
            <span className="text-[11px] text-stone-400 block mb-1.5">
              Quick test presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('bob')}
                className="px-2 py-1 text-[11px] bg-[#1C0E05] hover:bg-[#321B0B] border border-amber-900/50 rounded text-amber-300 cursor-pointer"
              >
                + Quick BOB mBOB
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('bnbl')}
                className="px-2 py-1 text-[11px] bg-[#1C0E05] hover:bg-[#321B0B] border border-amber-900/50 rounded text-amber-300 cursor-pointer"
              >
                + Quick BNBL B-Ngul
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('dpnbl')}
                className="px-2 py-1 text-[11px] bg-[#1C0E05] hover:bg-[#321B0B] border border-amber-900/50 rounded text-amber-300 cursor-pointer"
              >
                + Quick Druk PNB
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-stone-300 flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Your match prize winnings (95%) will be securely deposited directly into this linked Bhutanese account.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-amber-900/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-400 hover:text-white text-xs font-semibold rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Link Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

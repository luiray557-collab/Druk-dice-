export interface RandomChallenger {
  id: string;
  name: string;
  dzongkhag: string;
  avatarEmoji: string;
  rating: number;
  winRate: string;
  playStyle: string;
  favoriteCall: string;
  ping: number;
}

export const BHUTAN_RANDOM_PLAYERS: RandomChallenger[] = [
  {
    id: 'rp_thimphu_1',
    name: 'Tashi Wangchuk',
    dzongkhag: 'Thimphu Clock Tower',
    avatarEmoji: '🏹',
    rating: 1540,
    winRate: '68%',
    playStyle: 'Auspicious First Rolls',
    favoriteCall: 'Druk Karpo (Sixer Strike)',
    ping: 18,
  },
  {
    id: 'rp_paro_2',
    name: 'Sonam Pelden',
    dzongkhag: 'Paro Rinpung Dzong',
    avatarEmoji: '🏔️',
    rating: 1480,
    winRate: '62%',
    playStyle: 'Steady Defensive Chants',
    favoriteCall: 'Samtse Shokey',
    ping: 24,
  },
  {
    id: 'rp_bumthang_3',
    name: 'Karma Lhamo',
    dzongkhag: 'Bumthang Valley',
    avatarEmoji: '🌾',
    rating: 1610,
    winRate: '74%',
    playStyle: 'High Roller Aggression',
    favoriteCall: 'Chumey Zhabdrung Roll',
    ping: 32,
  },
  {
    id: 'rp_punakha_4',
    name: 'Dorji Khandu',
    dzongkhag: 'Punakha Mo Chhu',
    avatarEmoji: '🌊',
    rating: 1430,
    winRate: '59%',
    playStyle: 'Overtime Specialist',
    favoriteCall: 'Chorten Ningpo Chime',
    ping: 28,
  },
  {
    id: 'rp_phuentsholing_5',
    name: 'Dechen Zangmo',
    dzongkhag: 'Phuentsholing Border',
    avatarEmoji: '🪙',
    rating: 1590,
    winRate: '71%',
    playStyle: 'Calculated Odds Reader',
    favoriteCall: 'Gomtu Golden Strike',
    ping: 22,
  },
  {
    id: 'rp_trashigang_6',
    name: 'Ugyen Tshering',
    dzongkhag: 'Trashigang Dzong',
    avatarEmoji: '🦅',
    rating: 1675,
    winRate: '78%',
    playStyle: 'Unflinching Veteran',
    favoriteCall: 'Radhi Thunder Clap',
    ping: 36,
  },
  {
    id: 'rp_haa_7',
    name: 'Kinzang Namgay',
    dzongkhag: 'Haa Katsho',
    avatarEmoji: '🌲',
    rating: 1390,
    winRate: '54%',
    playStyle: 'Sudden Death Master',
    favoriteCall: 'Meri Puensum Luck',
    ping: 29,
  },
  {
    id: 'rp_wangdue_8',
    name: 'Pema Chedon',
    dzongkhag: 'Wangdue Phodrang',
    avatarEmoji: '🔥',
    rating: 1515,
    winRate: '66%',
    playStyle: 'Rhythmic Cup Shaker',
    favoriteCall: 'Bajo Wind Howl',
    ping: 25,
  },
];

export function getRandomPlayer(): RandomChallenger {
  const index = Math.floor(Math.random() * BHUTAN_RANDOM_PLAYERS.length);
  return BHUTAN_RANDOM_PLAYERS[index];
}

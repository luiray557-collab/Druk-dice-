// Authentic Bhutanese Sho (འབྲུག་ཤོ་) dice calls and lore

export interface DiceCall {
  value: number;
  dzongkhaNum: string;
  name: string;
  tibetan: string;
  meaning: string;
}

export const SHO_CALLS: Record<number, DiceCall> = {
  1: {
    value: 1,
    dzongkhaNum: '༡',
    name: 'Chik-pa',
    tibetan: 'གཅིག་པ',
    meaning: 'Single Peak · Solitary Arrow',
  },
  2: {
    value: 2,
    dzongkhaNum: '༢',
    name: 'Nyik-pa',
    tibetan: 'གཉིས་པ',
    meaning: 'The Twin Horns of the Yak',
  },
  3: {
    value: 3,
    dzongkhaNum: '༣',
    name: 'Sum-tse',
    tibetan: 'གསུམ་རྩེ',
    meaning: 'The Three Jewels (Triratna)',
  },
  4: {
    value: 4,
    dzongkhaNum: '༤',
    name: 'Zhi-ba',
    tibetan: 'བཞི་པ',
    meaning: 'The Four Auspicious Directions',
  },
  5: {
    value: 5,
    dzongkhaNum: '༥',
    name: 'Nga-pa',
    tibetan: 'ལྔ་པ',
    meaning: 'Five Wisdom Dhyani Buddhas',
  },
  6: {
    value: 6,
    dzongkhaNum: '༦',
    name: 'Druk-dril (Chung)',
    tibetan: 'འབྲུག་འགྲིལ',
    meaning: 'Thunder Dragon Roar · The Champion',
  },
};

// 2-Dice combinations and traditional names
export const TWO_DICE_CALLS: Record<number, { name: string; chant: string }> = {
  2: { name: 'Khatser', chant: 'Double Single! The mountain pass opens!' },
  3: { name: 'Sum-ka', chant: 'Three winds from Pelela!' },
  4: { name: 'Zhi-nor', chant: 'The four-fold fortune unfolds!' },
  5: { name: 'Nga-den', chant: 'Five prayer flags dancing!' },
  6: { name: 'Druk-sho', chant: 'Dragon roll gathers strength!' },
  7: { name: 'Dun-nor', chant: 'The seven precious royal emblems!' },
  8: { name: 'Gye-tse', chant: 'Eight lucky treasures (Ashtamangala)!' },
  9: { name: 'Gu-phel', chant: 'Nine sacred snow peaks!' },
  10: { name: 'Chu-tshang', chant: 'Ten-fold completion of grace!' },
  11: { name: 'Chuk-chig', chant: 'Eleven arrows in the target!' },
  12: { name: 'Druk-chen', chant: 'Supreme Druk Thunder! Thunder Dragon roars!' },
};

export interface Opponent {
  id: string;
  name: string;
  dzongkhaTitle: string;
  origin: string;
  role: string;
  avatarEmoji: string;
  quote: string;
  winBanter: string;
  loseBanter: string;
  recommendedStake: number;
}

export const OPPONENTS: Opponent[] = [
  {
    id: 'kinley',
    name: 'Kinley the Archer',
    dzongkhaTitle: 'མདའ་དཔོན་ ཀུན་ལེགས',
    origin: 'Changlimithang, Thimphu',
    role: 'National Archery Champion',
    avatarEmoji: '🏹',
    quote: 'The same steady hand that hits the bullseye rolls the winning dice!',
    winBanter: 'A clean shot into the golden circle! Better luck next round.',
    loseBanter: 'Tashi delek! Your dice flew true like an arrow through the wind.',
    recommendedStake: 50,
  },
  {
    id: 'pema',
    name: 'Pema of Bumthang',
    dzongkhaTitle: 'བུམ་ཐང་ པདྨ',
    origin: 'Jakar Valley, Bumthang',
    role: 'Highland Yak Herder & Weaver',
    avatarEmoji: '🏔️',
    quote: 'Up in the high pastures, we play Sho to warm the cold Himalayan nights.',
    winBanter: 'The blessing of the high valleys was with me this match!',
    loseBanter: 'Well played! May your Ngultrum bring you abundant butter tea.',
    recommendedStake: 20,
  },
  {
    id: 'dorji',
    name: 'Lama Dorji',
    dzongkhaTitle: 'བླ་མ་ རྡོ་རྗེ',
    origin: 'Punakha Dzong',
    role: 'Monastery Elder & Scholar',
    avatarEmoji: '☸️',
    quote: 'Dice are like karma: what rolls today returns tomorrow with equanimity.',
    winBanter: 'Patience and peace, my friend. Fortune comes and goes like mist.',
    loseBanter: 'The wheel turns in your favor. May your winnings be used wisely.',
    recommendedStake: 100,
  },
  {
    id: 'sonam',
    name: 'Sonam the Merchant',
    dzongkhaTitle: 'ཚོང་དཔོན་ བསོད་ནམས',
    origin: 'Norzin Lam, Thimphu',
    role: 'Textile & Gem Trader',
    avatarEmoji: '💎',
    quote: 'Fortune favors the bold! In the bazaar and on the Sho mat, double down!',
    winBanter: 'Another day, another stack of Ngultrum in the register!',
    loseBanter: 'Oof! You drove a hard bargain with those dice today!',
    recommendedStake: 200,
  },
  {
    id: 'dechen',
    name: 'Dechen of Paro',
    dzongkhaTitle: 'སྤ་རོ་ བདེ་ཆེན',
    origin: 'Tiger\'s Nest, Paro',
    role: 'Sho Guild Master',
    avatarEmoji: '🐉',
    quote: 'Hear the thunder of the Druk! I have never conceded a 5-round match easily.',
    winBanter: 'The Tiger\'s spirit never yields! A glorious match.',
    loseBanter: 'Incredible spirit! You truly embody the strength of the Druk.',
    recommendedStake: 500,
  },
];


import { SunMedium, Music, Heart, BookOpen } from 'lucide-react';
import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  { name: "Aartis", icon: <SunMedium size={24} className="text-orange-500" /> },
  { name: "Kirtan", icon: <Music size={24} className="text-amber-600" /> },
  { name: "Pad", icon: <Heart size={24} className="text-rose-500" /> },
  { name: "Varta", icon: <BookOpen size={24} className="text-indigo-500" /> },
];

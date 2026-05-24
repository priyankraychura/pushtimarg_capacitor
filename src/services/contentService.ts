// ==========================================
// Content API Service
// ==========================================
// Pure functions — no React dependencies.
// Handles all HTTP calls to the static content backend.

import { contentClient } from '../lib/contentClient';
import type {
  ContentIndexItem,
  VaishnavIndexItem,
  AartiContent,
  VartaContent,
} from '../types/content';

// ==========================================
// Index (List) Endpoints
// ==========================================

/** Fetch the Aarti & Kirtan index list */
export async function getAartiIndex(): Promise<ContentIndexItem[]> {
  const { data } = await contentClient.get<ContentIndexItem[]>('/index.json');
  return data;
}

/** Fetch the 84 Vaishnavon Ki Varta index */
export async function getVarta84Index(): Promise<VaishnavIndexItem[]> {
  const { data } = await contentClient.get<VaishnavIndexItem[]>('/index_84.json');
  return data;
}

/** Fetch the 252 Vaishnavon Ki Varta index */
export async function getVarta252Index(): Promise<VaishnavIndexItem[]> {
  const { data } = await contentClient.get<VaishnavIndexItem[]>('/index_252.json');
  return data;
}

// ==========================================
// Detail (Content) Endpoints
// ==========================================

/** Fetch full aarti/kirtan content by filename */
export async function getAartiContent(file: string): Promise<AartiContent> {
  const { data } = await contentClient.get<AartiContent>(`/aartis/${file}`);
  return data;
}

/** Fetch full varta prasang content by file path (e.g. "84/v84_1_p1.json") */
export async function getVartaContent(file: string): Promise<VartaContent> {
  const { data } = await contentClient.get<VartaContent>(`/varta/${file}`);
  return data;
}

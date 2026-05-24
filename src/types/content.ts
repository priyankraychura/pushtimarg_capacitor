// ==========================================
// Content API Type Definitions
// ==========================================
// Mirrors the shapes returned by the static backend at
// https://pushtimarg-web-api.netlify.app

// ------------------------------------------
// Index types (list endpoints)
// ------------------------------------------

/** Item shape from /index.json — Aartis & Kirtan list */
export interface ContentIndexItem {
  id: string;
  title: string;
  artist: string;
  category: string;
  file: string;
}

/** Prasang entry nested within a Vaishnav */
export interface VaishnavPrasang {
  id: string;
  title: string;
  file: string;
}

/** Vaishnav item from /index_84.json or /index_252.json */
export interface VaishnavIndexItem {
  id: string;
  index: number;
  group: string;
  name: string;
  bio: string;
  prasangs: VaishnavPrasang[];
}

// ------------------------------------------
// Detail types (content endpoints)
// ------------------------------------------

/** Full aarti/kirtan content from /aartis/<file>.json */
export interface AartiContent {
  id: string;
  videoId?: string;
  artist: string;
  title: string;
  category: string;
  content: string[];
}

/** Full varta prasang content from /varta/<group>/<file>.json */
export interface VartaContent {
  id: string;
  title: string;
  vaishnavName: string;
  content: string;
}

/** Union of all possible content detail types */
export type ContentDetail = AartiContent | VartaContent;

// ------------------------------------------
// Type guards
// ------------------------------------------

/** Check if content detail is an Aarti (content is string array) */
export function isAartiContent(detail: ContentDetail): detail is AartiContent {
  return Array.isArray((detail as AartiContent).content);
}

/** Check if content detail is a Varta (content is a string) */
export function isVartaContent(detail: ContentDetail): detail is VartaContent {
  return typeof (detail as VartaContent).content === 'string';
}

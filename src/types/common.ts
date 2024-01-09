export interface Coor {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  id?: string;
}

export interface Oper {
  title: string;
  onClick: () => void;
  isConfirm?: boolean;
}

export interface SavedPage {
  title: string;
  url: string;
  tagIds: string[];
  desc: string;
  createdTime: number;
  updatedTime: number;
}

export interface PageNote {
  id: string;
  url: string;
  content: string;
  createdTime: number;
  updatedTime: number;
}
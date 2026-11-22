export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkItem {
  id: string;
  shortCode: string;
  destinationUrl: string;
  title: string | null;
  description: string | null;
  isActive: boolean;
  expiresAt: Date | null;
  workspaceId: string;
  campaignId: string | null;
  createdAt: Date;
  updatedAt: Date;
  clicksCount?: number;
}

export interface CampaignItem {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  linksCount?: number;
  clicksCount?: number;
}

export interface ClickMetric {
  date: string;
  clicks: number;
  visitors: number;
}

export interface BreakdownItem {
  name: string;
  count: number;
  percentage: number;
}

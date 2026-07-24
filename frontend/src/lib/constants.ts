// Risk Levels & Variants
export const RISK_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// Common reusable Tailwind color classes for cards, borders, and backgrounds
export const THEME_CLASSES = {
  cardBg: 'bg-white dark:bg-[#161B22]',
  cardBorder: 'border border-gray-200 dark:border-[#30363D]',
  subtleBg: 'bg-gray-50 dark:bg-[#0D1117]',
  hoverBg: 'hover:bg-gray-50 dark:hover:bg-[#21262D]',
  containerBg: 'bg-white dark:bg-[#0D1117]',
} as const;

// Dashboard Stat Items
export const RECENT_ANALYSES_STATS = [
  { label: 'Critical Risk', value: 8, color: 'bg-red-500' },
  { label: 'High Risk', value: 19, color: 'bg-orange-500' },
  { label: 'Medium Risk', value: 31, color: 'bg-blue-500' },
  { label: 'Low Risk', value: 42, color: 'bg-blue-600 dark:bg-blue-400' },
];

export const SUMMARY_STATS = [
  { label: 'Projects', value: '8' },
  { label: 'Analyses', value: '47' },
  { label: 'High-Risk Changes', value: '12', alert: true },
  { label: 'Issues Prevented', value: '126', success: true },
];

export interface RecentAnalysis {
  id: string;
  title: string;
  project: string;
  changeType: string;
  riskVariant: 'critical' | 'high' | 'medium' | 'low';
  riskLabel: string;
  impactedFiles: string;
  date: string;
  targetView: string;
}

export const RECENT_ANALYSES: RecentAnalysis[] = [
  {
    id: '1',
    title: 'Authentication Refactor',
    project: 'commerce-api',
    changeType: 'Method Signature',
    riskVariant: 'critical',
    riskLabel: 'Critical 91',
    impactedFiles: '24 files',
    date: '2 min ago',
    targetView: 'results',
  },
  {
    id: '2',
    title: 'Database Schema Update',
    project: 'user-service',
    changeType: 'SQL Migration',
    riskVariant: 'high',
    riskLabel: 'High 74',
    impactedFiles: '12 files',
    date: '15 min ago',
    targetView: 'progress',
  },
  {
    id: '3',
    title: 'UI Theme Migration',
    project: 'dashboard-web',
    changeType: 'CSS Variable Mapping',
    riskVariant: 'medium',
    riskLabel: 'Medium 42',
    impactedFiles: '156 files',
    date: '45 min ago',
    targetView: 'progress',
  },
  {
    id: '4',
    title: 'CI Pipeline Optimization',
    project: 'infra-templates',
    changeType: 'YAML Config',
    riskVariant: 'low',
    riskLabel: 'Low 12',
    impactedFiles: '2 files',
    date: '1 hour ago',
    targetView: 'progress',
  },
];

export interface UserProfile {
  username: string;
  role: string;
  initials: string;
}

export const CURRENT_USER: UserProfile = {
  username: 'dev_lead_user',
  role: 'Sr. Engineer',
  initials: 'JD',
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'import', label: 'Project Import' },
  { id: 'select-change', label: 'Architecture' },
  { id: 'results', label: 'Impact Trace' },
];

export const BOTTOM_NAV_ITEMS = [
  { id: 'docs', label: 'Documentation' },
  { id: 'support', label: 'Support' },
];

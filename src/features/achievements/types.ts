export interface Award {
  periodLabel: string;
  title: string;
  project: string;
  displayOrder: number;
}

export interface Activity {
  periodLabel: string;
  category: string;
  title: string;
  displayOrder: number;
}

export interface Achievements {
  awards: Award[];
  activities: Activity[];
}

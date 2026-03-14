export type DemoAnnouncement = {
  body: string;
  id: string;
  title: string;
};

export const DEMO_ANNOUNCEMENTS: DemoAnnouncement[] = [
  {
    id: 'announcement-1',
    title: 'Quarter Kickoff',
    body: 'Prioritize BOM accuracy this week so purchasing can begin supplier outreach without delay.',
  },
];

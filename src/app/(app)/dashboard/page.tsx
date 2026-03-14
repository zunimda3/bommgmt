import { getLatestAnnouncement } from '@/lib/data/announcements';
import { getProjectSummaries } from '@/lib/data/projects';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';

export default async function DashboardPage() {
  const [announcement, summary] = await Promise.all([getLatestAnnouncement(), getProjectSummaries()]);

  return (
    <DashboardOverview
      activeProjectCount={summary.activeProjectCount}
      announcement={announcement}
      projectCount={summary.projectCount}
    />
  );
}

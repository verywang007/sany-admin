import { fetchActiveRate, fetchMauList } from '@/services/customer-analysis/mau';
import UserMetricReport from '../components/UserMetricReport';

/** 客户分析 - 月活跃用户 */
export default function MauPage() {
  return (
    <UserMetricReport
      title="月活跃用户"
      metricLabel="活跃率"
      formula="月活跃率=本月活跃用户数/本月用户总数"
      exportName="月活跃用户"
      fetchList={fetchMauList}
      fetchRate={fetchActiveRate}
    />
  );
}

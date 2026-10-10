import { fetchRetentionList, fetchRetentionRate } from '@/services/customer-analysis/retention';
import UserMetricReport from '../components/UserMetricReport';

/** 客户分析 - 用户留存率 */
export default function RetentionPage() {
  return (
    <UserMetricReport
      title="用户留存率"
      metricLabel="用户留存率"
      formula="用户留存率=本月新注册的用户下月活跃用户数/本月新注册用户数"
      exportName="用户留存率"
      fetchList={fetchRetentionList}
      fetchRate={fetchRetentionRate}
    />
  );
}

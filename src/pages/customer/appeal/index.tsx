import { useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import {
  fetchAppealList,
  fetchProblemTypes,
  type Appeal,
  type ProblemType,
} from '@/services/customer/appeal';
import { useTableQuery } from '@/utils/useTableQuery';
import { usePrototypeActions } from '@/utils/feedback';
import { buildColumns } from './columns';
import { FEEDBACK, REPLY_STATE } from './constants';
import { toOptions } from '@/utils/lookup';
import ReplyModal from './components/ReplyModal';
import ReplyRecordsModal from './components/ReplyRecordsModal';

/** 异常申诉（页头原文为「异常申诉清单」） */
export default function AppealPage() {
  // 原型 DataSet 写的 size: 20 不生效，实际为 10，与快照一致
  const { tableProps, search, reset, reload } = useTableQuery(fetchAppealList, {
    defaultPageSize: 10,
  });
  const { exportData } = usePrototypeActions();
  const [problemTypes, setProblemTypes] = useState<ProblemType[]>([]);
  const [replying, setReplying] = useState<Appeal>();
  const [viewing, setViewing] = useState<Appeal>();

  useEffect(() => {
    fetchProblemTypes().then(setProblemTypes);
  }, []);

  const fields = useMemo<SearchField[]>(
    () => [
      {
        type: 'select',
        name: 'problemType',
        label: '错误类型',
        placeholder: '请选择错误类型',
        options: problemTypes.map((t) => ({ value: t.typeCode, label: t.typeName })),
      },
      {
        type: 'select',
        name: 'replyState',
        label: '状态',
        placeholder: '请选择回复状态',
        options: toOptions(REPLY_STATE),
      },
      {
        type: 'select',
        name: 'feedback',
        label: '反馈结果',
        placeholder: '请选择用户反馈结果',
        options: toOptions(FEEDBACK),
      },
      { type: 'dateRange', name: 'times', label: '起止日期' },
      { type: 'input', name: 'paramKey', label: '设备编码', placeholder: '请输入设备编码或名称' },
      { type: 'input', name: 'createdByName', label: '登录账号', placeholder: '登录账号' },
    ],
    [problemTypes],
  );

  const columns = useMemo(
    () => buildColumns({ onReply: setReplying, onViewRecords: setViewing }),
    [],
  );

  return (
    <PageContainer title="异常申诉清单">
      <SearchForm fields={fields} columns={3} labelWidth={80} onSearch={search} onReset={reset} />
      <div style={{ marginBottom: 12, textAlign: 'right' }}>
        <Button type="link" onClick={() => exportData('异常申诉清单')}>
          导出
        </Button>
      </div>
      <DataTable<Appeal> {...tableProps} columns={columns} />
      <ReplyModal record={replying} onClose={() => setReplying(undefined)} onSuccess={reload} />
      <ReplyRecordsModal record={viewing} onClose={() => setViewing(undefined)} />
    </PageContainer>
  );
}

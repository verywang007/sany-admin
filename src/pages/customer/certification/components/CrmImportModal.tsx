import { App } from 'antd';
import ImportModal from '@/components/ImportModal';
import { importCrmFile, type ImportType } from '@/services/customer/certification';
import { NOTICE_TITLE } from '../constants';

const META: Record<ImportType, { title: string; template: string; file: string }> = {
  1: { title: '导入考核国家信息', template: '考核国家信息模板下载', file: '考核国家信息模板.xlsx' },
  2: { title: '导入客户信息', template: '客户信息模板下载', file: '客户信息模板.xlsx' },
};

interface Props {
  /** 导入类型，为空时关闭 */
  type?: ImportType;
  onClose: () => void;
  onImported: () => void;
}

/** 导入客户信息 / 导入考核国家信息：结果按全部成功 / 部分失败 / 全部失败给出不同级别的通知 */
export default function CrmImportModal({ type, onClose, onImported }: Props) {
  const { notification } = App.useApp();
  const meta = type ? META[type] : undefined;

  return (
    <ImportModal
      open={!!type}
      title={meta?.title}
      templateText={meta?.template}
      onDownloadTemplate={() =>
        notification.success({ message: NOTICE_TITLE, description: `已下载：${meta?.file}` })
      }
      onCancel={onClose}
      onOk={async (file) => {
        if (!type) return;
        try {
          const { totalCount, successCount, failCount } = await importCrmFile(type, file);
          const description = `导入总条数${totalCount},成功导入${successCount},失败${failCount}`;
          const level = failCount === totalCount ? 'error' : failCount > 0 ? 'warning' : 'success';
          notification[level]({ message: NOTICE_TITLE, description });
          onImported();
          onClose();
        } catch (e) {
          notification.error({ message: NOTICE_TITLE, description: '文件异常，导入失败' });
          throw e;
        }
      }}
    />
  );
}

import { useState } from 'react';
import { App, Modal, Typography, Upload, type UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

interface Props {
  open: boolean;
  title?: string;
  /** 允许的扩展名，默认 .xls,.xlsx */
  accept?: string;
  /** 单文件大小上限（MB），默认 50 */
  maxSizeMB?: number;
  /** 提供则显示「下载模板」 */
  templateName?: string;
  onCancel: () => void;
  /** 点击确定后回调，返回 Promise 时按钮显示加载态，resolve 后关闭 */
  onOk: (file: File) => Promise<void> | void;
}

/** 通用 Excel 导入弹窗：选择单个文件 → 校验类型与大小 → 确认导入 */
export default function ImportModal({
  open,
  title = '导入',
  accept = '.xls,.xlsx',
  maxSizeMB = 50,
  templateName,
  onCancel,
  onOk,
}: Props) {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const exts = accept.split(',').map((e) => e.trim().toLowerCase());

  const close = () => {
    setFileList([]);
    onCancel();
  };

  const submit = async () => {
    const file = fileList[0]?.originFileObj;
    if (!file) {
      message.warning('请先选择文件');
      return;
    }
    setLoading(true);
    try {
      await onOk(file);
      setFileList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title={title} onCancel={close} onOk={submit} confirmLoading={loading} destroyOnHidden>
      {templateName && (
        <Typography.Paragraph>
          请先
          <Typography.Link onClick={() => message.success(`已下载模板：${templateName}`)}>
            下载模板
          </Typography.Link>
          ，按模板填写后上传。
        </Typography.Paragraph>
      )}
      <Upload.Dragger
        accept={accept}
        maxCount={1}
        fileList={fileList}
        beforeUpload={(file) => {
          const ok = exts.some((e) => file.name.toLowerCase().endsWith(e));
          if (!ok) {
            message.error(`仅支持 ${exts.join(' / ')} 格式文件`);
            return Upload.LIST_IGNORE;
          }
          if (file.size > maxSizeMB * 1024 * 1024) {
            message.error(`文件大小不能超过 ${maxSizeMB}M`);
            return Upload.LIST_IGNORE;
          }
          return false;
        }}
        onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域</p>
        <p className="ant-upload-hint">
          支持 {exts.join(' / ')}，单个文件不超过 {maxSizeMB}M
        </p>
      </Upload.Dragger>
    </Modal>
  );
}

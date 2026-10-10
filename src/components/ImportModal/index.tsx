import { useState } from 'react';
import { App, Form, Modal, Upload, type UploadFile } from 'antd';
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { colors } from '@/theme';

interface Props {
  open: boolean;
  title?: string;
  /** 允许的扩展名，默认 .xls,.xlsx */
  accept?: string;
  /** 单文件大小上限（MB），默认 50 */
  maxSizeMB?: number;
  /** 模板链接文字；提供则显示「下载导入模板」一行 */
  templateText?: string;
  /** 点击模板链接；不传时提示已下载 */
  onDownloadTemplate?: () => void;
  /** 未选择文件就点确认时的提示 */
  emptyTip?: string;
  onCancel: () => void;
  /**
   * 确认导入。返回 Promise 时按钮显示加载态：resolve 后关闭弹窗，reject 则保持打开。
   * 导入结果的提示由页面自行处理。
   */
  onOk: (file: File) => Promise<void> | void;
}

/** 通用 Excel 导入弹窗（与 HZERO 原系统导入弹窗样式一致）：下载模板 + 上传附件 */
export default function ImportModal({
  open,
  title = '导入',
  accept = '.xls,.xlsx',
  maxSizeMB = 50,
  templateText,
  onDownloadTemplate,
  emptyTip = '请上传附件',
  onCancel,
  onOk,
}: Props) {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const exts = accept.split(',').map((e) => e.trim().toLowerCase());
  const extText = exts.map((e) => e.replace('.', '')).join('、');

  const close = () => {
    setFileList([]);
    onCancel();
  };

  const submit = async () => {
    const file = fileList[0]?.originFileObj;
    if (!file) {
      message.warning(emptyTip);
      return;
    }
    setLoading(true);
    try {
      await onOk(file);
      setFileList([]);
    } catch {
      // 失败提示由页面给出，弹窗保持打开以便重新选择
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      width={600}
      onCancel={close}
      onOk={submit}
      okText="确认"
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form labelCol={{ flex: '110px' }} wrapperCol={{ flex: '1 1 0' }}>
        {templateText && (
          <Form.Item label="下载导入模板">
            <a
              style={{ color: colors.primary }}
              onClick={() =>
                onDownloadTemplate
                  ? onDownloadTemplate()
                  : message.success(`已下载：${templateText}`)
              }
            >
              <DownloadOutlined style={{ marginRight: 8 }} />
              {templateText}
            </a>
          </Form.Item>
        )}
        <Form.Item label="上传附件" required>
          <Upload.Dragger
            accept={accept}
            maxCount={1}
            fileList={fileList}
            beforeUpload={(file) => {
              if (!exts.some((e) => file.name.toLowerCase().endsWith(e))) {
                message.error(`只能上传${extText}格式文件`);
                return Upload.LIST_IGNORE;
              }
              if (file.size > maxSizeMB * 1024 * 1024) {
                message.error(`文件不能超过${maxSizeMB}M`);
                return Upload.LIST_IGNORE;
              }
              return false;
            }}
            onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              将文件拖到此处，或<span style={{ color: colors.primary }}>点击上传</span>
            </p>
            <p className="ant-upload-hint">
              只能上传{extText}格式文件，文件不能超过{maxSizeMB}M
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
}

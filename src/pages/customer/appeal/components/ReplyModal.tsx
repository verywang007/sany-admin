import { useEffect, useState } from 'react';
import { App, Image, Input, Modal, Typography, Upload, type UploadFile } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { colors } from '@/theme';
import { submitReply, type Appeal } from '@/services/customer/appeal';

const MAX_LENGTH = 300;
const MAX_IMAGES = 3;
const MAX_SIZE = 200 * 1024 * 1024;

interface Props {
  /** 被回复的申诉；为空时弹窗关闭 */
  record?: Appeal;
  onClose: () => void;
  onSuccess: () => void;
}

/** 读成 data URL，供原型内预览与保存（真实环境为上传接口返回的地址） */
const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/** 回复弹窗 */
export default function ReplyModal({ record, onClose, onSuccess }: Props) {
  const { message, notification } = App.useApp();
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  // 打开时清空上次填写的内容
  useEffect(() => {
    if (record) {
      setContent('');
      setFileList([]);
    }
  }, [record]);

  const submit = async () => {
    if (!record) return;
    if (!content.trim()) {
      message.info('回复内容不能为空');
      return;
    }
    setLoading(true);
    try {
      // 原型取 DataSet 当前行的 id，这里直接使用被点击的行，避免取错行
      await submitReply({
        id: record.id,
        problemReply: content,
        problemReplyImage: fileList.map((f) => f.url ?? '').filter(Boolean),
      });
      message.success('操作成功');
      onClose();
    } catch (e) {
      message.info((e as Error).message);
      onClose();
    } finally {
      setLoading(false);
      // 原型无论成功失败都会刷新列表
      onSuccess();
    }
  };

  return (
    <Modal
      open={!!record}
      title="回复内容"
      width={500}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Input.TextArea
        rows={4}
        placeholder="请输入回复内容"
        maxLength={MAX_LENGTH}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div style={{ textAlign: 'right', color: colors.textSecondary, marginBottom: 8 }}>
        已输入{content.length}/{MAX_LENGTH}
      </div>
      <div style={{ marginBottom: 4 }}>
        上传照片<span style={{ color: colors.textSecondary }}>（最多3张）</span>
      </div>
      <Upload
        listType="picture-card"
        accept="image/png,image/jpeg"
        multiple
        maxCount={MAX_IMAGES}
        fileList={fileList}
        beforeUpload={async (file) => {
          if (file.size > MAX_SIZE) {
            notification.error({ message: '文件超出大小限制，无法上传' });
            return Upload.LIST_IGNORE;
          }
          if (!/\.(png|jpe?g)$/i.test(file.name)) {
            notification.error({ message: '请上传png或jpg图片' });
            return Upload.LIST_IGNORE;
          }
          const url = await readAsDataUrl(file);
          setFileList((list) =>
            [...list, { uid: file.uid, name: file.name, status: 'done' as const, url }].slice(
              0,
              MAX_IMAGES,
            ),
          );
          // 原型直接上传到服务器；这里只在本地保留
          return Upload.LIST_IGNORE;
        }}
        onRemove={(file) => setFileList((list) => list.filter((f) => f.uid !== file.uid))}
        onPreview={(file) => setPreview(file.url ?? '')}
      >
        {fileList.length < MAX_IMAGES && (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 4 }}>上传</div>
          </div>
        )}
      </Upload>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        只能上传jpg/png格式文件，文件不能超过200M
      </Typography.Text>
      {preview && (
        <Image
          style={{ display: 'none' }}
          src={preview}
          preview={{ visible: true, src: preview, onVisibleChange: (v) => !v && setPreview('') }}
        />
      )}
    </Modal>
  );
}

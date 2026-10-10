import { Image, Space, Tooltip } from 'antd';

/** 100×100 缩略图横排，点击打开全屏大图预览（替代原型自绘的 previewContainer 遮罩层） */
export function Thumbnails({ list }: { list: string[] }) {
  if (!list.length) return null;
  return (
    <Image.PreviewGroup>
      <Space size={4}>
        {list.map((src) => (
          <Image
            key={src}
            src={src}
            width={100}
            height={100}
            alt="缩略图"
            style={{ objectFit: 'cover' }}
          />
        ))}
      </Space>
    </Image.PreviewGroup>
  );
}

/** 单行省略 + Tooltip 显示完整内容 */
export function EllipsisText({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <Tooltip title={value} placement="topLeft">
      <span>{value}</span>
    </Tooltip>
  );
}

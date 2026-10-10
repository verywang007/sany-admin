import { useState, type ReactNode } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select, type FormInstance } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import styles from './index.module.css';

export interface Option {
  label: string;
  value: string | number;
}

export type SearchField =
  | { type: 'input'; name: string; label: string; placeholder?: string }
  | {
      type: 'select';
      name: string;
      label: string;
      options: Option[];
      placeholder?: string;
      mode?: 'multiple';
    }
  | { type: 'date'; name: string; label: string; placeholder?: string }
  | { type: 'month'; name: string; label: string; placeholder?: string }
  | {
      type: 'dateRange';
      name: string;
      label: string;
      /** 是否带时分秒 */
      showTime?: boolean;
      placeholder?: [string, string];
    }
  | { type: 'custom'; name: string; label: string; render: () => ReactNode };

export type SearchValues = Record<string, unknown>;

interface Props {
  fields: SearchField[];
  /** 每行列数，默认 4 */
  columns?: number;
  /** 收起状态下展示的行数，默认 1；字段超出时出现「更多 / 收起」 */
  collapsedRows?: number;
  /** 始终显示「更多」按钮（与原型保持一致，即使没有更多字段） */
  alwaysShowMore?: boolean;
  initialValues?: SearchValues;
  labelWidth?: number;
  /** 由页面持有的表单实例：需要在查询区外读写条件时传入（如统计卡、快捷日期） */
  form?: FormInstance;
  onSearch: (values: SearchValues) => void;
  onReset?: () => void;
}

function renderControl(field: SearchField) {
  switch (field.type) {
    case 'input':
      return <Input allowClear placeholder={field.placeholder ?? '请输入'} />;
    case 'select':
      return (
        <Select
          allowClear
          mode={field.mode}
          placeholder={field.placeholder ?? '请选择'}
          options={field.options}
        />
      );
    case 'date':
      return <DatePicker style={{ width: '100%' }} placeholder={field.placeholder ?? '请选择'} />;
    case 'month':
      return (
        <DatePicker
          picker="month"
          style={{ width: '100%' }}
          placeholder={field.placeholder ?? '请选择月份'}
        />
      );
    case 'dateRange':
      return (
        <DatePicker.RangePicker
          style={{ width: '100%' }}
          showTime={field.showTime}
          placeholder={field.placeholder ?? ['开始日期', '结束日期']}
          separator="~"
        />
      );
    case 'custom':
      return field.render();
  }
}

/**
 * 通用查询区：栅格排布字段，右下角固定「更多 / 重置 / 查询」。
 * Enter 键触发查询；收起时隐藏的字段仍保留取值并参与查询。
 */
export default function SearchForm({
  fields,
  columns = 4,
  collapsedRows = 1,
  alwaysShowMore = false,
  initialValues,
  labelWidth = 96,
  form: outerForm,
  onSearch,
  onReset,
}: Props) {
  const [innerForm] = Form.useForm();
  const form = outerForm ?? innerForm;
  const [expanded, setExpanded] = useState(false);
  const limit = columns * collapsedRows;
  const hasMore = fields.length > limit;
  const visible = expanded || !hasMore ? fields : fields.slice(0, limit);
  const span = 24 / columns;

  return (
    <Form
      form={form}
      className={styles.form}
      initialValues={initialValues}
      labelCol={{ flex: `${labelWidth}px` }}
      wrapperCol={{ flex: '1 1 0', style: { minWidth: 0 } }}
      // 取全部值：收起状态下被隐藏的字段条件也要带上
      onFinish={() => onSearch(form.getFieldsValue(true))}
    >
      <Row gutter={16}>
        {visible.map((f) => (
          <Col span={span} key={f.name}>
            <Form.Item name={f.name} label={f.label}>
              {renderControl(f)}
            </Form.Item>
          </Col>
        ))}
      </Row>
      <div className={styles.actions}>
        {(hasMore || alwaysShowMore) && (
          <Button onClick={() => setExpanded((e) => !e)}>
            {expanded ? <UpOutlined /> : <DownOutlined />}
            {expanded ? '收起' : '更多'}
          </Button>
        )}
        <Button
          onClick={() => {
            form.resetFields();
            onReset?.();
          }}
        >
          重置
        </Button>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
      </div>
    </Form>
  );
}

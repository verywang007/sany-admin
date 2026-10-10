import { useEffect, useState } from 'react';
import { Descriptions, Drawer, type TableColumnsType } from 'antd';
import DataTable from '@/components/DataTable';
import {
  fetchOrgMembers,
  type OrgMember,
  type Organization,
} from '@/services/customer/organization';

const columns: TableColumnsType<OrgMember> = [
  { title: '成员名称', dataIndex: 'userName', width: 140 },
  { title: '登录账号', dataIndex: 'account', width: 160 },
  { title: '角色', dataIndex: 'roleName', width: 100 },
  { title: '加入时间', dataIndex: 'joinDate' },
];

interface Props {
  org?: Organization;
  onClose: () => void;
}

/** 管理组织（原型未捕获，推断为抽屉：组织信息 + 成员列表） */
export default function ManageDrawer({ org, onClose }: Props) {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!org) return;
    setMembers([]);
    setLoading(true);
    fetchOrgMembers(org)
      .then(setMembers)
      .finally(() => setLoading(false));
  }, [org]);

  return (
    <Drawer open={!!org} title="管理组织" width={720} onClose={onClose} destroyOnHidden>
      {org && (
        <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }}>
          <Descriptions.Item label="组织名称" span={2}>
            {org.organizationName}
          </Descriptions.Item>
          <Descriptions.Item label="组织关联客户编码">{org.crmCustomerNo}</Descriptions.Item>
          <Descriptions.Item label="成员数量">{org.orgUserSize}</Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>
            {org.creationDate}
          </Descriptions.Item>
        </Descriptions>
      )}
      <DataTable<OrgMember>
        dataSource={members}
        loading={loading}
        columns={columns}
        pagination={false}
      />
    </Drawer>
  );
}

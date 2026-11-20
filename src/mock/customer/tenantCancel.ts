import type { CancelRecord } from '@/services/customer/tenantCancel';

export const tenantCancelOptions = [
  {
    id: 'EU10001',
    name: 'Rhein Equipment GmbH',
    contact: 'Anna Müller',
    phone: '+49 **** 1038',
    fullPhone: '+49 151 2345 1038',
    email: 'anna.mueller@example.com',
    username: 'anna_mueller',
    userId: 'USR10001',
    nickname: '演示客户1',
  },
  {
    id: 'EU10002',
    name: 'Lyon Construction SAS',
    contact: 'Jean Martin',
    phone: '+33 **** 2086',
    fullPhone: '+33 6 1234 2086',
    email: 'jean.martin@example.com',
    username: 'jean_martin',
    userId: 'USR10002',
    nickname: '演示客户2',
  },
  {
    id: 'EU10003',
    name: 'Milano Machinery SRL',
    contact: 'Luca Rossi',
    phone: '+39 **** 6652',
    fullPhone: '+39 333 123 6652',
    email: 'luca.rossi@example.com',
    username: 'luca_rossi',
    userId: 'USR10003',
    nickname: '演示客户3',
  },
];

/** 虚构注销记录，覆盖分页、筛选及数据处置详情；不占用待注销演示租户。 */
export const tenantCancelSeed: CancelRecord[] = Array.from({ length: 16 }, (_, index) => {
  const number = index + 1;
  const retained = index % 3 === 0;
  const names = [
    'Nord Equipment GmbH',
    'Alpes Construction SAS',
    'Roma Machinery SRL',
    'Iberia Crane SL',
  ];
  const contacts = ['Max Weber', 'Marie Laurent', 'Marco Bianchi', 'Elena García'];
  const phones = ['+49 **** 3826', '+33 **** 1905', '+39 **** 4721', '+34 **** 6283'];
  const reasons = [
    '合同到期，客户不再续用服务',
    '企业业务整合，迁移至集团统一租户',
    '项目结束，客户申请停止租户服务',
    '重复创建租户，客户确认关闭旧租户',
  ];
  const date = `2026-11-${String(18 - index).padStart(2, '0')}`;
  return {
    id: `TC202611${String(number).padStart(4, '0')}`,
    tenantId: `EU${20001 + index}`,
    userId: `USR${30001 + index}`,
    nickname: `客户用户${number}`,
    tenantName: `${names[index % names.length]}（示例${number}）`,
    contact: contacts[index % contacts.length],
    phone: phones[index % phones.length],
    email: `tenant.user${number}@example.com`,
    username: `tenant_user_${String(number).padStart(3, '0')}`,
    createdAt: `${date} 14:30:00`,
    verifiedAt: `${date} 14:28:16`,
    operator: ['平台运营-张敏', '客户服务-李明', '系统管理员-王晨'][index % 3],
    status: '已注销',
    authority: `租户授权管理员；授权证明编号 AUTH-2026-${String(number).padStart(4, '0')}`,
    instruction: `客户书面注销工单 SR-202611-${String(number).padStart(4, '0')}（模拟）`,
    reason: reasons[index % reasons.length],
    retention: retained ? '部分保留' : '按客户指令删除 / 返还后删除',
    ...(retained
      ? {
          retentionBasis:
            '示例处置方案：仅保留财务凭证及必要审计信息，限制财务与合规角色访问；具体适用法律及期限待法务核定，不作为真实保留依据。',
          retentionUntil: '2026-12-31',
        }
      : {}),
    acknowledged: true,
  };
});

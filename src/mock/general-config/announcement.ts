import type { Announcement } from '@/services/general-config/announcement';

/** 当前后管用户总数（取原型统计中的总人数） */
export const ADMIN_USER_TOTAL = 1562;

/** 第 1 条公告正文，也是「新建公告」简体中文正文的默认值（原样） */
export const INTRANET_HTML =
  '<p>为进一步加强平台信息安全防护，MySANY 管理平台将调整访问方式，现将有关事项通知如下：</p><p>一、自 <b>2026 年 11 月 1 日</b> 起，平台仅支持通过<b>三一内网</b>登录及使用，公网访问入口将同步关闭，公网环境将无法打开或登录本平台；</p><p>二、请在公司办公网络环境下使用本平台；办公场所之外如需访问，请先<b>连接公司 VPN</b>，再登录平台；</p><p>三、本次调整不影响平台功能与数据，账号、权限及历史数据均保持不变；</p><p>四、如遇无法访问或登录异常，请联系平台管理员，或通过「客户管理 → 异常申诉」提交反馈。</p><p>感谢您的理解与配合。</p><p style="text-align:right;color:#98a4b4">MySANY 管理平台<br>2026 年 10 月 9 日</p>';

/**
 * 样本数据：来自原型页面，原样保留；content 按语言存储（原型只有简体中文一份）。
 * 需求变更：标题改为按语言维护且各语言必填，其他语言标题为补充的译文
 */
export const announcementSeed: Announcement[] = [
  {
    id: '1',
    no: 'GG-20261009-001',
    title: {
      'zh-CN': '关于 MySANY 管理平台切换内网访问的公告',
      'en-US': 'Notice on Switching MySANY Admin Platform to Intranet Access',
      'id-ID': 'Pengumuman Peralihan Akses Platform Admin MySANY ke Intranet',
      'zh-TW': '關於 MySANY 管理平台切換內網訪問的公告',
    },
    type: 'sys',
    touches: ['系统通知', '站内消息'],
    force: true,
    once: true,
    effType: 'IMMEDIATE',
    eff: '2026-10-09 10:00',
    exp: '2026-11-30 23:59',
    status: 'PUBLISHED',
    publisher: '刘伏旺',
    publishTime: '2026-10-09 10:02',
    confirm: 1054,
    content: {
      'zh-CN': INTRANET_HTML,
      'en-US': '',
      'id-ID': '',
      'zh-TW': '',
    },
    confirmText: '我已知晓：11 月 1 日起需通过三一内网（或 VPN）访问本平台',
  },
  {
    id: '2',
    no: 'GG-20261011-003',
    title: {
      'zh-CN': '平台数据库升级维护通知',
      'en-US': 'Notice of Platform Database Upgrade Maintenance',
      'id-ID': 'Pemberitahuan Pemeliharaan Peningkatan Basis Data Platform',
      'zh-TW': '平台資料庫升級維護通知',
    },
    type: 'maint',
    touches: ['系统通知'],
    force: false,
    once: true,
    effType: 'SCHEDULED',
    eff: '2026-10-11 22:00',
    exp: '2026-10-12 06:00',
    status: 'SCHEDULED',
    publisher: '系统管理员-王强',
    publishTime: '2026-10-09 09:30',
    confirm: null,
    content: {
      'zh-CN':
        '<p>平台将于 2026-10-11 22:00 至 2026-10-12 06:00 进行数据库升级维护，期间平台暂无法访问，请提前保存工作内容。</p>',
      'en-US': '',
      'id-ID': '',
      'zh-TW': '',
    },
  },
  {
    id: '3',
    no: 'GG-20260928-006',
    title: {
      'zh-CN': '平台 10 月版本更新维护通知',
      'en-US': 'Notice of Platform October Release Maintenance',
      'id-ID': 'Pemberitahuan Pemeliharaan Pembaruan Versi Oktober Platform',
      'zh-TW': '平台 10 月版本更新維護通知',
    },
    type: 'maint',
    touches: ['系统通知', '站内消息'],
    force: false,
    once: true,
    effType: 'SCHEDULED',
    eff: '2026-09-28 22:00',
    exp: '2026-09-29 06:00',
    status: 'EXPIRED',
    publisher: '系统管理员-王强',
    publishTime: '2026-09-27 18:40',
    confirm: 1377,
    content: {
      'zh-CN':
        '<p>平台将于 2026-09-28 22:00 至 2026-09-29 06:00 进行版本更新维护，期间暂无法访问。</p>',
      'en-US': '',
      'id-ID': '',
      'zh-TW': '',
    },
  },
  {
    id: '4',
    no: 'GG-20261012-002',
    title: {
      'zh-CN': '积分商城“双 11”活动规则调整预告',
      'en-US': 'Preview: Points Mall “Double 11” Campaign Rule Changes',
      'id-ID': 'Pratinjau Perubahan Aturan Kampanye “Double 11” Mal Poin',
      'zh-TW': '積分商城「雙 11」活動規則調整預告',
    },
    type: 'op',
    touches: ['站内消息'],
    force: false,
    once: true,
    effType: 'SCHEDULED',
    eff: '2026-10-12 09:00',
    exp: '2026-10-20 23:59',
    status: 'DRAFT',
    publisher: '刘伏旺',
    publishTime: '—',
    confirm: null,
    content: {
      'zh-CN':
        '<p>积分商城“双 11”专题活动将于 11 月 1 日上线，积分兑换比例与部分商品上下架规则将同步调整，详见活动页说明。</p>',
      'en-US': '',
      'id-ID': '',
      'zh-TW': '',
    },
  },
  {
    id: '5',
    no: 'GG-20260815-011',
    title: {
      'zh-CN': '关于规范账号密码及开启双因素认证的通知',
      'en-US': 'Notice on Account Password Standards and Enabling Two-Factor Authentication',
      'id-ID': 'Pemberitahuan Standar Kata Sandi Akun dan Aktivasi Autentikasi Dua Faktor',
      'zh-TW': '關於規範帳號密碼及開啟雙因素認證的通知',
    },
    type: 'sys',
    touches: ['系统通知'],
    force: true,
    once: true,
    effType: 'IMMEDIATE',
    eff: '2026-08-15 09:00',
    exp: '2026-09-15 23:59',
    status: 'EXPIRED',
    publisher: '系统管理员-王强',
    publishTime: '2026-08-14 17:20',
    confirm: 1301,
    content: {
      'zh-CN':
        '<p>为提升账号安全，请于 9 月 15 日前完成密码强度升级并开启双因素认证，逾期未完成的账号将被限制登录。</p>',
      'en-US': '',
      'id-ID': '',
      'zh-TW': '',
    },
  },
];

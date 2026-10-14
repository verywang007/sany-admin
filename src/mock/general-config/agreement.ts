import type { AgreementLog, AgreementRelease } from '@/services/general-config/agreement';

/**
 * 样本数据：来自原型页面（字段名按接口口径整理；原型无 effType，统一为定时生效）。
 * 发布编号按「SV + 年月日 + 当日 2 位序号」规则生成，日期取创建日期。
 */
export const agreementSeed: AgreementRelease[] = [
  {
    id: '6',
    version: 'SV2026092901',
    sites: ['新加坡'],
    langs: ['zh-CN', 'en-US'],
    has: ['P', 'S', 'C'],
    status: 'DRAFT',
    effType: 'SCHEDULED',
    effectiveTime: '',
    expireTime: '',
    totalUser: 0,
    agreeUser: 0,
    publisher: '刘伏旺',
    created: '2026-09-29 18:02',
  },
  {
    id: '5',
    version: 'SV2026092801',
    sites: ['新加坡'],
    langs: ['zh-CN', 'en-US'],
    has: ['P', 'S', 'C'],
    status: 'SCHEDULED',
    effType: 'SCHEDULED',
    effectiveTime: '2026-10-15 00:00',
    expireTime: '',
    totalUser: 0,
    agreeUser: 0,
    publisher: '刘伏旺',
    created: '2026-09-28 10:15',
  },
  {
    id: '4',
    version: 'SV2026092001',
    sites: ['新加坡'],
    langs: ['zh-CN', 'en-US'],
    has: ['P', 'S', 'C'],
    status: 'SCHEDULED',
    effType: 'SCHEDULED',
    effectiveTime: '2026-11-01 00:00',
    expireTime: '',
    totalUser: 0,
    agreeUser: 0,
    publisher: '刘伏旺',
    created: '2026-09-20 09:40',
  },
  {
    id: '3',
    version: 'SV2026021801',
    sites: ['法兰克福'],
    langs: ['zh-CN', 'en-US', 'id-ID'],
    has: ['P', 'S'],
    status: 'PUBLISHED',
    effType: 'SCHEDULED',
    effectiveTime: '2026-03-01 00:00',
    expireTime: '',
    totalUser: 214860,
    agreeUser: 208913,
    publisher: '王丽',
    created: '2026-02-18 14:22',
  },
  {
    id: '2',
    version: 'SV2025102001',
    sites: ['新加坡'],
    langs: ['zh-CN'],
    has: ['P', 'S', 'C'],
    status: 'EXPIRED',
    effType: 'SCHEDULED',
    effectiveTime: '2025-11-01 00:00',
    expireTime: '2026-03-01 00:00',
    totalUser: 186204,
    agreeUser: 180655,
    publisher: '王丽',
    created: '2025-10-20 11:05',
  },
  {
    id: '1',
    version: 'SV2025051501',
    sites: ['新加坡'],
    langs: ['zh-CN'],
    has: ['P', 'S'],
    status: 'EXPIRED',
    effType: 'SCHEDULED',
    effectiveTime: '2025-06-01 00:00',
    expireTime: '2025-11-01 00:00',
    totalUser: 152377,
    agreeUser: 149802,
    publisher: '陈建国',
    created: '2025-05-15 16:31',
  },
];

/** 操作日志（备注里的 V1.x / V2.1 为旧口径版本号，原样保留） */
export const agreementLogSeed: Record<string, AgreementLog[]> = {
  '6': [
    {
      id: '6-1',
      time: '2026-09-29 18:02',
      operator: '刘伏旺',
      action: '创建草稿',
      remark: '由 V2.1 复制而来',
    },
  ],
  '5': [
    {
      id: '5-1',
      time: '2026-09-28 10:15',
      operator: '刘伏旺',
      action: '创建草稿',
      remark: '—',
    },
    {
      id: '5-2',
      time: '2026-09-28 16:40',
      operator: '刘伏旺',
      action: '提交发布',
      remark: '定时生效',
    },
  ],
  '4': [
    {
      id: '4-1',
      time: '2026-09-20 09:40',
      operator: '刘伏旺',
      action: '创建草稿',
      remark: '—',
    },
    {
      id: '4-2',
      time: '2026-09-21 10:12',
      operator: '刘伏旺',
      action: '提交发布',
      remark: '定时生效',
    },
  ],
  '3': [
    {
      id: '3-1',
      time: '2026-02-18 14:22',
      operator: '王丽',
      action: '创建草稿',
      remark: '—',
    },
    {
      id: '3-2',
      time: '2026-02-19 09:30',
      operator: '王丽',
      action: '提交发布',
      remark: '—',
    },
    {
      id: '3-3',
      time: '2026-03-01 00:00',
      operator: '系统',
      action: '发布生效',
      remark: '取代 V1.1',
    },
  ],
  '2': [
    {
      id: '2-1',
      time: '2025-10-20 11:05',
      operator: '王丽',
      action: '创建草稿',
      remark: '—',
    },
    {
      id: '2-2',
      time: '2025-10-21 09:10',
      operator: '王丽',
      action: '提交发布',
      remark: '—',
    },
    {
      id: '2-3',
      time: '2025-11-01 00:00',
      operator: '系统',
      action: '发布生效',
      remark: '取代 V1.0',
    },
    {
      id: '2-4',
      time: '2026-03-01 00:00',
      operator: '系统',
      action: '失效',
      remark: '被 V1.2 取代',
    },
  ],
  '1': [
    {
      id: '1-1',
      time: '2025-05-15 16:31',
      operator: '陈建国',
      action: '创建草稿',
      remark: '—',
    },
    {
      id: '1-2',
      time: '2025-05-16 10:20',
      operator: '陈建国',
      action: '提交发布',
      remark: '—',
    },
    {
      id: '1-3',
      time: '2025-06-01 00:00',
      operator: '系统',
      action: '发布生效',
      remark: '首个版本',
    },
    {
      id: '1-4',
      time: '2025-11-01 00:00',
      operator: '系统',
      action: '失效',
      remark: '被 V1.1 取代',
    },
  ],
};

/** 编辑视图默认正文（原型附录 A，逐字原样） */
export const PRIVACY_ZH_HTML =
  '<p><strong>更新日期：</strong>2026 年 10 月 15 日</p><p><strong>生效日期：</strong>2026 年 10 月 15 日</p><p>MG Live（以下简称"我们"）非常重视用户个人信息和隐私保护。在您使用 MG Live APP 及相关服务时，我们可能会收集和使用您的相关信息。我们希望通过本《隐私政策》向您说明，在您使用我们的服务时，我们如何收集、使用、储存、共享和转让这些信息，以及我们为您提供的访问、更新、删除和保护这些信息的方式。</p><p><strong>一、我们如何收集和使用您的个人信息</strong></p><p>1. 账号注册与登录：当您注册 MG Live 账号时，我们会收集您的手机号码、验证码，用于创建账号、登录验证与找回密码。</p><p>2. 车辆绑定与服务：当您绑定车辆时，我们会收集车辆识别代号（VIN）、车牌号、车型信息，用于提供车辆状态查询、远程控制、保养提醒等服务。</p><p>3. 位置信息：当您使用附近经销商、道路救援、行程记录等功能时，我们会收集您的地理位置信息。您可以在系统设置中随时关闭定位权限，关闭后不影响其他功能的使用。</p><p>4. 设备信息：为保障服务正常运行、预防恶意程序，我们会收集设备型号、操作系统版本、设备标识符、网络状态。</p><p><strong>二、我们如何使用 Cookie 和同类技术</strong></p><p>为确保 APP 正常运转、为您获得更轻松的访问体验，我们会在您的设备上存储名为 Cookie 的小数据文件。</p><p><strong>三、我们如何共享、转让、公开披露您的个人信息</strong></p><p>我们不会与任何公司、组织和个人共享您的个人信息，但以下情况除外：事先获得您明确的同意或授权；根据适用的法律法规、法律程序的要求、强制性的行政或司法要求所必需的情况。</p><p><strong>四、我们如何保护您的个人信息</strong></p><p>我们已使用符合业界标准的安全防护措施保护您提供的个人信息，防止数据遭到未经授权的访问、公开披露、使用、修改、损坏或丢失。</p><p><strong>五、您的权利</strong></p><p>您可以通过 APP「我的 - 设置」访问、更正、删除您的个人信息，也可以注销账号。如您无法通过上述方式行使权利，可通过本政策末尾的联系方式与我们取得联系。</p><p><strong>六、我们如何处理未成年人的个人信息</strong></p><p>我们的产品、网站和服务主要面向成人。如果没有父母或监护人的同意，未成年人不应创建自己的个人信息主体账户。</p><p><strong>七、本政策如何更新</strong></p><p>我们可能适时修订本政策的条款。未经您明确同意，我们不会削减您按照本政策所应享有的权利。对于重大变更，我们会通过弹窗提示等显著方式通知您。</p><p><strong>八、如何联系我们</strong></p><p>如您对本政策有任何疑问、意见或建议，可通过客服电话 400-828-1088 与我们联系。</p>';
export const PRIVACY_EN_HTML =
  '<h3>MG Live Privacy Policy</h3><p><strong>Last Updated:</strong> October 15, 2026</p><p><strong>Effective Date:</strong> October 15, 2026</p><p>MG Live (hereinafter referred to as "we") attaches great importance to the protection of your personal information and privacy. When you use the MG Live APP and related services, we may collect and use your relevant information. Through this Privacy Policy, we want to explain how we collect, use, store, share, and transfer this information when you use our services, as well as how we provide you with access, update, deletion, and protection of this information.</p><p><strong>1. How We Collect and Use Your Personal Information</strong></p><p>1.1 Account Registration and Login: When you register an MG Live account, we collect your mobile number and verification code to create your account, verify your login, and recover your password.</p><p>1.2 Vehicle Binding and Services: When you bind a vehicle, we collect the Vehicle Identification Number (VIN), license plate number, and vehicle model to provide vehicle status queries, remote control, and maintenance reminders.</p><p>1.3 Location Information: When you use features such as nearby dealers, roadside assistance, and trip records, we collect your geographic location. You may disable location permissions in your system settings at any time without affecting other functions.</p><p>1.4 Device Information: To ensure proper service operation and prevent malicious programs, we collect device model, operating system version, device identifier, and network status.</p><p><strong>2. How We Use Cookies and Similar Technologies</strong></p><p>To ensure the APP functions properly and to provide you with a smoother access experience, we store small data files called Cookies on your device.</p><p><strong>3. How We Share, Transfer, and Disclose Your Personal Information</strong></p><p>We do not share your personal information with any company, organization, or individual, except in the following cases: with your prior explicit consent or authorization; or as required by applicable laws, regulations, legal procedures, mandatory administrative or judicial requirements.</p><p><strong>4. How We Protect Your Personal Information</strong></p><p>We have implemented security measures that meet industry standards to protect the personal information you provide against unauthorized access, public disclosure, use, modification, damage, or loss.</p><p><strong>5. Your Rights</strong></p><p>You may access, correct, or delete your personal information, or cancel your account, via "My - Settings" in the APP. If you are unable to exercise these rights through the above means, please contact us using the information at the end of this policy.</p><p><strong>6. How We Handle Minors\' Personal Information</strong></p><p>Our products, websites, and services are primarily intended for adults. Without the consent of a parent or guardian, minors should not create their own personal information subject accounts.</p><p><strong>7. How This Policy Is Updated</strong></p><p>We may revise the terms of this policy from time to time. Without your explicit consent, we will not reduce the rights you are entitled to under this policy. For material changes, we will notify you through prominent means such as popup prompts.</p><p><strong>8. How to Contact Us</strong></p><p>If you have any questions, comments, or suggestions regarding this policy, please contact us via customer service hotline 400-828-1088.</p>';
export const SERVICE_ZH_HTML =
  '<p><strong>更新日期：</strong>2026 年 10 月 15 日</p><p><strong>生效日期：</strong>2026 年 10 月 15 日</p><p>欢迎您使用 MG Live！本协议是您与 MG Live 之间就您使用 MG Live 平台及相关服务所订立的协议。请您仔细阅读本协议的全部内容，特别是以粗体标注的条款。</p><p><strong>一、协议的范围</strong></p><p>1.1 本协议是您与 MG Live 之间关于您下载、安装、使用 MG Live 客户端，以及使用 MG Live 相关服务所订立的协议。</p><p>1.2 本协议内容同时包括 MG Live 可能不断发布的关于本服务的相关协议、业务规则等内容。上述内容一经正式发布，即视为本协议不可分割的组成部分。</p><p><strong>二、关于本服务</strong></p><p>2.1 本服务是指 MG Live 向您提供的车辆管理、远程控制、保养提醒、社区互动、积分商城等服务。</p><p>2.2 您使用本服务需要注册 MG Live 账号，并绑定您的车辆。您应确保注册信息真实、准确、完整。</p><p><strong>三、账号与密码安全</strong></p><p>3.1 您应妥善保管您的账号及密码，并对该账号下发生的一切行为承担责任。</p><p>3.2 如您发现账号被非法使用或存在安全漏洞，应立即通知 MG Live。</p><p><strong>四、您的行为规范</strong></p><p>4.1 您在使用本服务时须遵守法律法规，不得利用本服务从事违法违规活动。</p><p>4.2 您不得利用任何技术手段干扰、破坏本服务的正常运行。</p><p><strong>五、知识产权声明</strong></p><p>MG Live 在本服务中提供的内容（包括但不限于网页、文字、图片、音频、视频、图表等）的知识产权均归 MG Live 所有。</p><p><strong>六、免责声明</strong></p><p>您理解并同意，在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务发生中断。MG Live 将努力在第一时间与相关单位配合，及时进行修复。</p><p><strong>七、协议的变更</strong></p><p>MG Live 有权在必要时修改本协议条款。您可以在相关页面查阅最新版本的协议条款。本协议条款变更后，如果您继续使用本服务，即视为您已接受修改后的协议。</p>';
export const SERVICE_EN_HTML =
  '<h3>MG Live User Service Agreement</h3><p><strong>Last Updated:</strong> October 15, 2026</p><p><strong>Effective Date:</strong> October 15, 2026</p><p>Welcome to MG Live! This Agreement is entered into between you and MG Live regarding your use of the MG Live platform and related services. Please read all terms of this Agreement carefully, especially those in bold.</p><p><strong>1. Scope of the Agreement</strong></p><p>1.1 This Agreement governs your download, installation, and use of the MG Live client and related services.</p><p>1.2 The Agreement also includes any additional terms, business rules, and related agreements that MG Live may publish from time to time. Once formally published, the foregoing shall be deemed an integral part of this Agreement.</p><p><strong>2. About the Services</strong></p><p>2.1 The Services refer to vehicle management, remote control, maintenance reminders, community interaction, points mall, and other services provided by MG Live to you.</p><p>2.2 To use the Services, you must register an MG Live account and bind your vehicle. You should ensure that your registration information is true, accurate, and complete.</p><p><strong>3. Account and Password Security</strong></p><p>3.1 You shall properly keep your account and password, and you shall be responsible for all activities under your account.</p><p>3.2 If you discover that your account has been used illegally or there is a security vulnerability, you shall notify MG Live immediately.</p><p><strong>4. Your Code of Conduct</strong></p><p>4.1 You shall comply with laws and regulations when using the Services, and shall not engage in illegal or irregular activities through the Services.</p><p>4.2 You shall not use any technical means to interfere with or disrupt the normal operation of the Services.</p><p><strong>5. Intellectual Property Statement</strong></p><p>The intellectual property rights of the content provided by MG Live in the Services (including but not limited to web pages, text, images, audio, video, charts, etc.) belong to MG Live.</p><p><strong>6. Disclaimer</strong></p><p>You understand and agree that during the use of the Services, force majeure and other risk factors may cause the Services to be interrupted. MG Live will endeavor to cooperate with the relevant parties and restore the Services as soon as possible.</p><p><strong>7. Changes to the Agreement</strong></p><p>MG Live reserves the right to modify the terms of this Agreement when necessary. You may consult the latest version of the Agreement on the relevant pages. If you continue to use the Services after the Agreement has been changed, you are deemed to have accepted the modified Agreement.</p>';
export const POPUP_ZH_TEXT =
  '尊敬的用户，感谢您使用 MG Live APP，为了更好地保障您的用户权益，我们对《隐私政策》与《个人信息共享清单》进行了优化更新。本次更新主要涉及以下内容：\n1. 更新了《隐私政策》与《个人信息共享清单》中，Growing IO的隐私政策地址；\n\n建议您仔细阅读并充分理解上述更新内容，如果您勾选同意或继续使用 MG 官方平台，即表示您知情并接受更新后的隐私政策内容。若您对更新后的《隐私政策》与《个人信息共享清单》有异议，建议您暂停下一步操作。\n如果您有任何疑问或需要任何帮助，欢迎随时联系我们（{{客服电话}}），我们将竭诚为您解答。';
export const POPUP_EN_TEXT =
  'Dear user, thank you for using MG Live APP. To better protect your rights, we have optimized and updated the "Privacy Policy" and the "Personal Information Sharing List". The main updates are as follows:\n1. Updated the privacy policy address of Growing IO in the "Privacy Policy" and the "Personal Information Sharing List";\n\nPlease carefully read and fully understand the above updates. By selecting "Agree" or continuing to use the MG official platform, you acknowledge and accept the updated privacy policy. If you have any objection to the updated "Privacy Policy" and "Personal Information Sharing List", we recommend that you stop further actions.\n\nIf you have any questions or need any help, please feel free to contact us ({{客服电话}}). We are happy to assist you.';

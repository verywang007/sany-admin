import type { CustomerStat } from '@/services/customer/customerAnalysis';

/** 样本数据：来自原型页面，原样保留 */
export const customerStatSeed: CustomerStat[] = [
  {
    id: '1',
    country: '南三维治岛,统一',
    increaseNumber: 22040,
    totalNumber: 22040,
  },
  {
    id: '2',
    country: '西撒哈拉',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    id: '3',
    country: '加拿大,波多黎哥,美国',
    increaseNumber: 965,
    totalNumber: 965,
  },
  {
    id: '4',
    country: '巴哈马(群岛)',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    id: '5',
    country: '巴巴多斯',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    id: '6',
    country: '安提瓜和巴布达',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    id: '7',
    country: '英属维尔京群岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    id: '8',
    country: '美属维尔京群岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    id: '9',
    country: '开曼群岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    id: '10',
    country: '百慕大群岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
];

/** 补齐到原型总数 221 行的其余国家/地区（演示数据：原型快照只含首页 10 行） */
export const customerStatExtra: Omit<CustomerStat, 'id'>[] = [
  {
    country: '中国',
    increaseNumber: 15320,
    totalNumber: 486210,
  },
  {
    country: '中国香港',
    increaseNumber: 95,
    totalNumber: 1420,
  },
  {
    country: '中国澳门',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '中国台湾',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '日本',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '韩国',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '朝鲜',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '蒙古',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '越南',
    increaseNumber: 380,
    totalNumber: 4960,
  },
  {
    country: '老挝',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '柬埔寨',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '泰国',
    increaseNumber: 410,
    totalNumber: 5820,
  },
  {
    country: '缅甸',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '马来西亚',
    increaseNumber: 860,
    totalNumber: 9620,
  },
  {
    country: '新加坡',
    increaseNumber: 120,
    totalNumber: 1890,
  },
  {
    country: '印度尼西亚',
    increaseNumber: 3120,
    totalNumber: 41980,
  },
  {
    country: '文莱',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '菲律宾',
    increaseNumber: 540,
    totalNumber: 7310,
  },
  {
    country: '东帝汶',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '印度',
    increaseNumber: 1180,
    totalNumber: 15600,
  },
  {
    country: '巴基斯坦',
    increaseNumber: 210,
    totalNumber: 2980,
  },
  {
    country: '孟加拉国',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '斯里兰卡',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '尼泊尔',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '不丹',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '马尔代夫',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '阿富汗',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '伊朗',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '伊拉克',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '叙利亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '约旦',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '黎巴嫩',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '以色列',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '巴勒斯坦',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '沙特阿拉伯',
    increaseNumber: 260,
    totalNumber: 3150,
  },
  {
    country: '阿联酋',
    increaseNumber: 150,
    totalNumber: 2260,
  },
  {
    country: '卡塔尔',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '巴林',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '科威特',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '阿曼',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '也门',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '土耳其',
    increaseNumber: 85,
    totalNumber: 1230,
  },
  {
    country: '塞浦路斯',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '格鲁吉亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '亚美尼亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '阿塞拜疆',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '哈萨克斯坦',
    increaseNumber: 130,
    totalNumber: 1720,
  },
  {
    country: '吉尔吉斯斯坦',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '塔吉克斯坦',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '乌兹别克斯坦',
    increaseNumber: 70,
    totalNumber: 980,
  },
  {
    country: '土库曼斯坦',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '俄罗斯联邦',
    increaseNumber: 720,
    totalNumber: 8840,
  },
  {
    country: '乌克兰',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '白俄罗斯',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '摩尔多瓦',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '波兰',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '捷克',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '斯洛伐克',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '匈牙利',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '罗马尼亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '保加利亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '塞尔维亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '黑山',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '波黑',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '克罗地亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '斯洛文尼亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '北马其顿',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '阿尔巴尼亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '希腊',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '意大利',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '梵蒂冈',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '圣马力诺',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '马耳他',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '西班牙',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '葡萄牙',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '安道尔',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '法国',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '摩纳哥',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '比利时',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '荷兰',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '卢森堡',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '德国',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '奥地利',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '瑞士',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '列支敦士登',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '英国',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '爱尔兰',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '冰岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '挪威',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '瑞典',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '芬兰',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '丹麦',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '爱沙尼亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '拉脱维亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '立陶宛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '埃及',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '利比亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '突尼斯',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '阿尔及利亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '摩洛哥',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '苏丹',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '南苏丹',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '埃塞俄比亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '厄立特里亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '吉布提',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '索马里',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '肯尼亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '乌干达',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '坦桑尼亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '卢旺达',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '布隆迪',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '刚果(金)',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '刚果(布)',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '加蓬',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '赤道几内亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '喀麦隆',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '中非',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '乍得',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '尼日尔',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '尼日利亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '贝宁',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '多哥',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '加纳',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '科特迪瓦',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '利比里亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '塞拉利昂',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '几内亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '几内亚比绍',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '塞内加尔',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '冈比亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '马里',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '布基纳法索',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '毛里塔尼亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '佛得角',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '圣多美和普林西比',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '安哥拉',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '赞比亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '马拉维',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '莫桑比克',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '津巴布韦',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '博茨瓦纳',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '纳米比亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '南非',
    increaseNumber: 90,
    totalNumber: 1360,
  },
  {
    country: '莱索托',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '斯威士兰',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '马达加斯加',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '毛里求斯',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '塞舌尔',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '科摩罗',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '留尼汪',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '墨西哥',
    increaseNumber: 110,
    totalNumber: 1640,
  },
  {
    country: '危地马拉',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '伯利兹',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '萨尔瓦多',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '洪都拉斯',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '尼加拉瓜',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '哥斯达黎加',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '巴拿马',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '古巴',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '牙买加',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '海地',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '多米尼加',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '多米尼克',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '格林纳达',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '圣卢西亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '圣文森特和格林纳丁斯',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '特立尼达和多巴哥',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '圣基茨和尼维斯',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '阿鲁巴',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '库拉索',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '哥伦比亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '委内瑞拉',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '圭亚那',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '苏里南',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '法属圭亚那',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '厄瓜多尔',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '秘鲁',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '玻利维亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '巴西',
    increaseNumber: 330,
    totalNumber: 4210,
  },
  {
    country: '巴拉圭',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '乌拉圭',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '阿根廷',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '智利',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '福克兰群岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '澳大利亚',
    increaseNumber: 140,
    totalNumber: 2050,
  },
  {
    country: '新西兰',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '巴布亚新几内亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '所罗门群岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '瓦努阿图',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '斐济',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '萨摩亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '汤加',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '基里巴斯',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '图瓦卢',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '瑙鲁',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '马绍尔群岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '密克罗尼西亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '帕劳',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '库克群岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '法属波利尼西亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '新喀里多尼亚',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '关岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '格陵兰',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '法罗群岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '直布罗陀',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '马恩岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '泽西岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '根西岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '特克斯和凯科斯群岛',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '安圭拉',
    increaseNumber: 0,
    totalNumber: 0,
  },
  {
    country: '蒙特塞拉特',
    increaseNumber: 0,
    totalNumber: 0,
  },
];

export type TemplateFieldItem = { en: string; zh: string };
export type TemplateFieldGroup = { groupZh: string; fields: TemplateFieldItem[] };
export type TemplateFieldsCategory = 'resume' | 'contract' | 'waybill';

const RESUME_TOP: TemplateFieldItem[] = [
  { en: 'name', zh: '姓名' },
  { en: 'gender', zh: '性别' },
  { en: 'dob', zh: '出生日期' },
  { en: 'age', zh: '年龄' },
  { en: 'phone', zh: '电话' },
  { en: 'email', zh: '邮箱' },
  { en: 'location', zh: '目前居住地' },
  { en: 'nationality', zh: '国籍' },
  { en: 'marital_status', zh: '婚姻状况' },
  { en: 'id_number', zh: '身份证号' },
  { en: 'wechat', zh: '微信' },
  { en: 'portfolio_url', zh: '作品集链接' },
  { en: 'expected_salary', zh: '期望薪资' },
  { en: 'current_salary', zh: '当前薪资' },
  { en: 'availability', zh: '到岗时间' },
  { en: 'years_of_experience', zh: '工作年限' },
  { en: 'job_title', zh: '求职意向职位' },
  { en: 'summary', zh: '个人简介' },
  { en: 'skills', zh: '技能' },
  { en: 'languages', zh: '语言能力' },
  { en: 'certifications', zh: '证书资质' },
  { en: 'awards', zh: '获奖经历' },
  { en: 'hobbies', zh: '兴趣爱好' },
  { en: 'photo_url', zh: '照片' },
];

const RESUME_EDUCATION: TemplateFieldItem[] = [
  { en: 'education.degree', zh: '学位' },
  { en: 'education.school', zh: '学校' },
  { en: 'education.major', zh: '专业' },
  { en: 'education.graduation_year', zh: '毕业年份' },
  { en: 'education.start_year', zh: '入学年份' },
  { en: 'education.end_year', zh: '毕业年份' },
  { en: 'education.gpa', zh: '绩点' },
  { en: 'education.honors', zh: '荣誉' },
  { en: 'education.thesis', zh: '论文/课题' },
  { en: 'education.location', zh: '学校所在地' },
];

const RESUME_WORK: TemplateFieldItem[] = [
  { en: 'work_experience.company', zh: '公司' },
  { en: 'work_experience.position', zh: '职位' },
  { en: 'work_experience.start_date', zh: '开始日期' },
  { en: 'work_experience.end_date', zh: '结束日期' },
  { en: 'work_experience.description', zh: '描述' },
  { en: 'work_experience.location', zh: '工作地点' },
  { en: 'work_experience.salary', zh: '薪资' },
  { en: 'work_experience.achievements', zh: '主要业绩' },
  { en: 'work_experience.skills_used', zh: '所用技能' },
  { en: 'work_experience.supervisor', zh: '直属上级' },
  { en: 'work_experience.reason_for_leaving', zh: '离职原因' },
];

const CONTRACT_TOP: TemplateFieldItem[] = [
  { en: 'contract_no', zh: '合同编号' },
  { en: 'title', zh: '标题' },
  { en: 'contract_type', zh: '合同类型' },
  { en: 'party_a', zh: '甲方' },
  { en: 'party_b', zh: '乙方' },
  { en: 'sign_date', zh: '签署日期' },
  { en: 'effective_date', zh: '生效日期' },
  { en: 'expiry_date', zh: '到期日期' },
  { en: 'total_amount', zh: '总金额' },
  { en: 'currency', zh: '币种' },
  { en: 'contract_name', zh: '合同名称' },
  { en: 'version', zh: '版本号' },
  { en: 'governing_law', zh: '适用法律' },
  { en: 'jurisdiction', zh: '管辖法院' },
  { en: 'notice_period', zh: '通知期限' },
  { en: 'termination_clause', zh: '终止条款' },
  { en: 'renewal_terms', zh: '续约条款' },
  { en: 'payment_terms', zh: '付款条款' },
  { en: 'delivery_terms', zh: '交付条款' },
  { en: 'warranty', zh: '保修/保证' },
  { en: 'liability_cap', zh: '责任上限' },
  { en: 'insurance', zh: '保险要求' },
  { en: 'dispute_resolution', zh: '争议解决' },
  { en: 'amendment_history', zh: '修订记录' },
  { en: 'signatories', zh: '签署方' },
  { en: 'witnesses', zh: '见证人' },
];

const CONTRACT_CLAUSES: TemplateFieldItem[] = [
  { en: 'contract_clauses.clause_type', zh: '条款类型' },
  { en: 'contract_clauses.clause_text', zh: '条款内容' },
  { en: 'contract_clauses.page', zh: '页码' },
  { en: 'contract_clauses.clause_number', zh: '条款编号' },
  { en: 'contract_clauses.effective_from', zh: '条款生效日' },
];

const WAYBILL_TOP: TemplateFieldItem[] = [
  { en: 'carrier', zh: '承运方' },
  { en: 'sender_name', zh: '发件人姓名' },
  { en: 'sender_phone', zh: '发件人电话' },
  { en: 'sender_address', zh: '发件人地址' },
  { en: 'recipient_name', zh: '收件人姓名' },
  { en: 'recipient_phone', zh: '收件人电话' },
  { en: 'recipient_address', zh: '收件人地址' },
  { en: 'ship_date', zh: '发货日期' },
  { en: 'weight', zh: '重量' },
  { en: 'status', zh: '状态' },
  { en: 'waybill_no', zh: '运单号' },
  { en: 'tracking_no', zh: '跟踪单号' },
  { en: 'service_type', zh: '服务类型' },
  { en: 'pickup_date', zh: '揽收日期' },
  { en: 'delivery_date', zh: '送达日期' },
  { en: 'estimated_delivery', zh: '预计送达' },
  { en: 'dimensions', zh: '尺寸' },
  { en: 'volume', zh: '体积' },
  { en: 'declared_value', zh: '申报价值' },
  { en: 'insurance_amount', zh: '保价金额' },
  { en: 'payment_method', zh: '付款方式' },
  { en: 'freight_charge', zh: '运费' },
  { en: 'packaging_type', zh: '包装类型' },
  { en: 'special_instructions', zh: '特殊说明' },
  { en: 'reference_numbers', zh: '参考号' },
  { en: 'customs_info', zh: '报关信息' },
];

const WAYBILL_ITEMS: TemplateFieldItem[] = [
  { en: 'waybill_items.description', zh: '描述' },
  { en: 'waybill_items.quantity', zh: '数量' },
  { en: 'waybill_items.weight', zh: '重量' },
  { en: 'waybill_items.unit', zh: '单位' },
  { en: 'waybill_items.value', zh: '价值' },
  { en: 'waybill_items.dimensions', zh: '尺寸' },
  { en: 'waybill_items.hs_code', zh: '海关编码' },
];

export const TEMPLATE_FIELDS_BY_CATEGORY: Record<
  TemplateFieldsCategory,
  TemplateFieldGroup[]
> = {
  resume: [
    { groupZh: '', fields: RESUME_TOP },
    { groupZh: '教育经历', fields: RESUME_EDUCATION },
    { groupZh: '工作经历', fields: RESUME_WORK },
  ],
  contract: [
    { groupZh: '', fields: CONTRACT_TOP },
    { groupZh: '合同条款', fields: CONTRACT_CLAUSES },
  ],
  waybill: [
    { groupZh: '', fields: WAYBILL_TOP },
    { groupZh: '运单明细', fields: WAYBILL_ITEMS },
  ],
};

export const CATEGORY_LABELS: Record<TemplateFieldsCategory, string> = {
  resume: '简历',
  contract: '合同',
  waybill: '运单',
};

export function getAllFieldEnNames(category: TemplateFieldsCategory): string[] {
  const groups = TEMPLATE_FIELDS_BY_CATEGORY[category];
  return groups.flatMap((g) => g.fields.map((f) => f.en));
}

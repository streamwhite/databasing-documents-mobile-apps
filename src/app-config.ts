export const APP_DISPLAY_NAME = 'databasing-documents-mobile-apps';

export const TAB_LABEL_HOME = '首页';
export const TAB_LABEL_PROFILE = '我';

export const TAB_BAR_BG = '#f5f5f5';
export const TAB_BAR_BORDER = '#e0e0e0';

/** Ionicons names for bottom tabs (from @expo/vector-icons) */
export const TAB_ICON_HOME = 'home';
export const TAB_ICON_PROFILE = 'person';

/** Home screen: document camera */
export const BTN_TAKE_DOCUMENT_PHOTO = '拍摄文档';
export const MSG_PHOTO_TAKEN = '已拍摄';
export const MSG_CAMERA_CANCELLED = '已取消';
export const MSG_CAMERA_PERMISSION_DENIED = '需要相机权限';
export const MSG_CAMERA_ERROR = '出错';

/** Home screen: pick document from phone (gallery) */
export const BTN_PICK_DOCUMENT_FROM_PHONE = '从相册选择';
export const MSG_PICKED = '已选择';
export const MSG_PICK_CANCELLED = '已取消';
export const MSG_PICK_PERMISSION_DENIED = '需要相册权限';
export const MSG_PICK_ERROR = '出错';

/** Home screen: upload document (choose take photo or pick, then upload) */
export const BTN_UPLOAD_DOCUMENT = '上传文档';
export const UPLOAD_CHOICE_TITLE = '选择方式';
export const UPLOAD_OPTION_CAMERA = '拍摄';
export const UPLOAD_OPTION_GALLERY = '选择文件或图片';
export const UPLOAD_OPTION_CANCEL = '取消';
export const MSG_UPLOADED = '已上传';

/** Home screen: extract (category + fields) */
export const LABEL_CATEGORY = '文档类型';
export const LABEL_FIELDS_SELECT = '选择要提取的字段';
export const BTN_SELECT_ALL = '全选';
export const BTN_DESELECT_ALL = '取消全选';
export const BTN_EXTRACT = '提取';
export const MSG_EXTRACT_OK = '提取成功';
export const MSG_EXTRACT_ERROR = '提取失败';
export const MSG_EXTRACT_NO_FIELDS = '请至少选择一个字段';
export const MSG_EXTRACT_NEED_LOGIN = '请先登录';
export const MSG_EXTRACT_LOADING = '提取中...';
export const LABEL_EXTRACT_FILES = '已选文件';
/** Field selector: checkbox display (user-facing only; en names used internally) */
export const CHECKBOX_UNCHECKED = '☐';
export const CHECKBOX_CHECKED = '☑';

/** Home screen: query */
export const PLACEHOLDER_QUERY = '输入查询条件';
export const BTN_SEND_QUERY = '发送查询';
export const MSG_QUERY_OK = '查询成功';
export const MSG_QUERY_ERROR = '查询失败';
export const MSG_QUERY_LOADING = '查询中...';
export const LABEL_QUERY_SQL = 'SQL';

/** Auth: labels and placeholders */
export const AUTH_LABEL_EMAIL = '邮箱';
export const AUTH_LABEL_PASSWORD = '密码';
export const AUTH_LABEL_TENANT_ID = '租户 ID';
export const AUTH_LABEL_TENANT_NAME = '租户名称';
export const AUTH_LABEL_USER_NAME = '用户名';
export const AUTH_PLACEHOLDER_EMAIL = 'user@example.com';
export const AUTH_PLACEHOLDER_PASSWORD = '••••••••';
export const AUTH_PLACEHOLDER_TENANT_ID = 'tenant_id';
export const AUTH_PLACEHOLDER_TENANT_NAME = '租户名称';
export const AUTH_PLACEHOLDER_USER_NAME = '用户名';

/** Auth: actions */
export const AUTH_BTN_LOGIN = '登录';
export const AUTH_BTN_REGISTER = '注册';
export const AUTH_LINK_TO_REGISTER = '没有账号？去注册';
export const AUTH_LINK_TO_LOGIN = '已有账号？去登录';
export const AUTH_MSG_LOGIN_OK = '登录成功';
export const AUTH_MSG_REGISTER_OK = '注册成功';
export const AUTH_MSG_LOGOUT = '已退出';
export const AUTH_BTN_LOGOUT = '退出登录';

/** Auth: common alert titles/messages */
export const ALERT_TITLE_EMPTY = '';
export const AUTH_ALERT_LOGIN_FAILED_TITLE = '登录失败';
export const AUTH_ALERT_REGISTER_FAILED_TITLE = '注册失败';
export const AUTH_ALERT_NETWORK_ERROR = '网络或未知错误';
export const AUTH_ALERT_LOGIN_MISSING_FIELDS = '请填写邮箱、密码和租户 ID';
export const AUTH_ALERT_REGISTER_MISSING_FIELDS =
  '请填写邮箱、密码、租户名称和用户名';
export const AUTH_ALERT_REGISTER_SUCCESS_PREFIX = '注册成功，租户 ID：';
export const AUTH_ALERT_REGISTER_SUCCESS_SUFFIX = '。请使用该租户 ID 登录。';

/** Auth: tenant selection (login) */
export const AUTH_LABEL_TENANT_PICK = '租户';
export const AUTH_TENANT_PICK_PLACEHOLDER = '请选择租户';
export const AUTH_TENANT_LOADING = '正在加载租户...';
export const AUTH_TENANT_EMPTY = '未找到租户';
export const AUTH_TENANT_FETCH_FAILED = '获取租户列表失败';
export const AUTH_TENANT_REQUEST_LABEL = '请求';

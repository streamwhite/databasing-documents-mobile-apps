export const todos = {
  nice_to_have: [
    `semantic search,extract和qury的全部功能. `,
    [
      `完善每个应用的细节,除了测试之外`,
      [`营销`, `移动端全面展示所有功能`, `文本,更加合适`],
    ],
  ],
  essential: [
    `this project is cloned from another project, so: change project name as 'databasing-documents-mobile-apps' and other project settings; remove current UIs, show a placeholder UI for home`,
    `remove this part and related code, since it is implementation for another project.`,
    `add another tab '我' for user profile and user settings, and show a placeholder UI for it.`,
    `on home, add a btn to use camera to take a photo of a document. `,
    `on home, remove placeholder content `,
    `change workflow to: upload document(btn): ask for take photo or select from phone, then upload the document`,
    `when select from phone, no limited to photos, also allow file from other location of phone`,

    `allow to select multiple files at once`,
    `use curl -X 'POST' \
  'http://0.0.0.0:4020/documents/extract' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'files=string' \
  -F 'document_category=string' \
  -F 'fields=string' \
  -F 'provider=string' \
`,
    `provider use google/gemini-3-flash-preview`,
    `add fileds input to extract fields from document, use these fields`,
    `add category input and then show corresponding fields.`,
    [
      `it does not show the fields for user to select, fix it`,
      `use selected fields and document category to extract document`,
      `add a env for prd backend url`,

      `use checkbox for fileds unselected state, not circle`,
      `do not show fileds names like contract_no, this only for app use, not to user, label is good enough`,
      `change fields layout to more columns for less scrolling`,
      `use the access token after login or refresh token. for query action and extract action`,
      [
        `add login page and register page`,
        `refresh token if expired or close to expiration time(2 min threshold) for current all api requests to backend(espcially extract and query action), this is shared part could be reused for other api calls`,
        `curl -X 'POST' \
  'http://0.0.0.0:4020/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "stringst",
  "tenant_name": "string",
  "user_name": "string"
}'-> {
  "message": "string",
  "tenant_id": "string"
}`,
        `curl -X 'POST' \
  'http://0.0.0.0:4020/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "string",
  "tenant_id": "string"
}'-> {
  "access_token": "string",
  "token_type": "bearer",
  "refresh_token": "string",
  "balance": "string"
}`,
        `curl -X 'POST' \
  'http://0.0.0.0:4020/auth/refresh' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "refresh_token": "string",
  "tenant_id": "string"
}'-> {
  "access_token": "string",
  "token_type": "bearer",
  "refresh_token": "string",
  "balance": "string"
}
`,
        `use curl -X 'GET' \
  'http://0.0.0.0:4020/tenants/by-email?email=herwidget%40gmail.com' \
  -H 'accept: application/json'->
  {
  "email": "user@example.com",
  "tenants": [
    {
      "tenant_id": "string",
      "tenant_name": "string"
    }
  ]
}
on login page, when user type in email (on lost focus), show the tenants list(name), and allow to select a tenant, then use the tenant id for login,`,
      ],
    ],
    [
      `allow to qury document,add a input for query, default to 本科专业为工商管理的简历`,
      `use api:curl -X 'POST' \
  'http://0.0.0.0:4020/query' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "query": "string",

}'->{
  "sql": "string",
  "rows": [
    {
      "additionalProp1": {}
    }
  ],
  "row_count": 0
}`,
      `use x-api-key with d2623508-114a-4518-9051-74828889a130 for all request to backend`,
      `do not tenant id separately on login page, only the list for tenants, and use the tenant id on select a tenant by name`,
      `still '获取租户列表失败', show me the request to backend.`,
      `do not show the quest on app ui for geting tenants list.`,
      `i have a .env.production file, when i production-apk build, what env file will be used?`,
      `the tenant list in login page should in a select UI`,
      `fix query action fails `,
      `for query action, now show the sql returned for now`,
      `when i dev with emulator, how to take photo with camera and select documents with emulator? add this to a new md file`,
      `fix extract actio error`,
      `show the files(names) selected for extract action`,

      `for query and extract action, show the processing status when it is processing`,
      `provider use google/gemini-3-flash-preview for extract action`,
      `the processing text should in the btn, add toast for extract and query action success or fail`,
      `create a new repo and push to that repo.`,
      `change branch name to main, also in remote`,
    ],
    [
      `重点`,
      [
        `开发移动端功能,保持几个测试功能(主要是marketing功能和简单测试)`,
        `先安卓系统,后续再苹果.(等待确实有效果之后再说)`,
        `移动端,开发和提交,RN只是:营销(demo),部分语音功能输入(暂时不需要这么复杂功能,demo的情况),不提供全部功能, 思考下是否需要,`,
      ],
      [
        `整理哪些功能是必须,通过后端api检索,.`,
        [
          `不需要登陆就可以使用.毕竟是测试,不要弄得太复杂.`,
          `限制测试,每天只有一次`,
          `公司搜索,因为不需要登陆,那就不需要了.`,
          `i like user to use this extract and query action specific times a day`,
          `since the backend now requires login(the backend is used by a web app too), show me how to change the backend to not require login for extract and query action only for this mobile app`,
          `create a md file to concise describe the solution first.`,
          `not time range limit, what i need is limit the number of times a day user can use the extract and query action`,
          `show a full flow for backend to implement X-Client: mobile, x-api-key, signed token(server only secret with /auth/mobile-token)`,

          `for /auth/mobile-token, send tenant_id as Nwa2YSWRutdnkYDhs4nz8H(hard coded and keep it secure), to access data to this tenant when user use extract and query action without login. if user logined, still use old logic to access data to its own tenant. so all mobile testing data(no login cases) goes to this tenant.`,
          `update related md files or create one if necessary to show this feature new feature(no login for extract and query action with limited usage per day)`,

          `sensure all logined user use old logic: do not go through mobile token logic, use old logic.`,

          `since each unlogined user use same tenant, when user query, it could query documents from other users too, so need to add document_id to query request to ensure it query documents from its own tenant. use document_version_id from latest extract response to add to query request and then append to query(field) in request body for query api.`,
          `response example for extract action: {
  "results": [
    {
      "file_name": "string",
      "status": "string",
      "document_id": 0,
      "document_version_id": 0,
      "message": "string",
      "extracted": {
        "additionalProp1": {}
      }
    }
  ]
}`,
          ` add notices, for testing cases(un-login cases), the document uploaded could be deleted after 7 days, so need to add notices to user to tell them this.`,
          `show a exmaple for query filed with document_version_id: [document_version_ids:1,2,3] and add to related md file.`,
          `should only take up to 5 latest document_version_ids.`,
          `show clear notice if daily limit is over for testing cases(un-login cases), for query and extract action for front enforcement and backend enforcement. the backend(backend enforcement) could return: For mobile testing (un-logged-in) users, the exceed limit case is:
Status code: 429 (Too Many Requests)
Body (JSON):
{"detail": "Device daily limit exceeded (5 requests per device per day). Log in for more."} to testing cases(un-login cases)`,
          `Check status code 429 and response.detail.error_code === "MOBILE_DEVICE_LIMIT_EXCEEDED" to show the notice for testing cases(un-login cases) in chinese, since backend is standardized the error code for exceed limit case.`,
        ],

        [
          `提示(并且提示用户全部功能需要到web,效率更好)`,
          `add a notice to user(overlay on top of app with timeout to dismiss) that this mobile app has limited features, user need to web(show url: http://di.piaosiyuan.cn) to use full features `,
        ],

        [
          `本地completion api并不稳定,是从国内发送openrouter所以有这个问题.但是应该是gpt的模型导致的.gemini应该没有这个问题.`,
        ],
        [
          `如何进行调试`,
          `how to add breakpoint in cursor to debug the app, add this to a new md file if possible or best practices in industry for debugging react native app with expo, make it concise.`,
        ],
        [`allow to select multiple files once for extract action`],
        [
          `UI要好看一些.上面的标题`,
          `do not show title for each tab, it is not necessary since each tab has label`,
          `for query action,show raw_text(multipart) in 1st row of rows, render the markdown content, do not show sql returned any more`,
          `center text for extract action and query action btn`,
          `for query action, add label over input to let user know this is query extracted document content. keep query and extract section easy to know it is two different sections`,
          `for me tab, show tenant_name, user_name from login reponse, do not show tenant id any more`,
          `it should not show this title for me tab`,
          `its content should not go to status bar for me tab, just like home tab does`,
          `for each tab, when i dev with emulator, it does not scroll smoothly, i do not know it is caused by emulator or what.fix it`,
          [
            `for extract and query action, make notice(toast) less height, no go to status bar.`,
          ],
        ],
      ],
    ],
  ],
};

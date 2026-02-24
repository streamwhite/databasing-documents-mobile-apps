export const todos = {
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
        `refresh token if expired or close to expiration time(2 min threshold), this is shared part could be reused for other api calls`,
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
      `show raw_text(multipart) in 1st row of rows, render the markdown content, do not show sql returned any more`,
      `when i dev with emulator, how to take photo with camera and select documents with emulator? add this to a new md file`,
      `fix extract actio error`,
      `show the files(names) selected for extract action`,

      `for query and extract action, show the processing status when it is processing`,
      `provider use google/gemini-3-flash-preview for extract action`,
      `the processing text should in the btn, add toast for extract and query action success or fail`,
    ],
  ],
};

export interface RegisterParams {
  email: string;
  password: string;
  tenant_name: string;
  user_name: string;
}

export interface RegisterResponse {
  message: string;
  tenant_id: string;
}

export interface LoginParams {
  email: string;
  password: string;
  tenant_id: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  balance?: string;
  tenant_name?: string;
  user_name?: string;
}

export interface RefreshParams {
  refresh_token: string;
  tenant_id: string;
}

export interface TenantInfo {
  tenant_id: string;
  tenant_name: string;
}

export interface TenantsByEmailResponse {
  email: string;
  tenants: TenantInfo[];
}

export interface StoredAuth {
  access_token: string;
  refresh_token: string;
  tenant_id: string;
  tenant_name: string;
  user_name: string;
}

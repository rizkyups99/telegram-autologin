// Types based on TDLib schema for Telegram QR code login

export interface AuthLoginToken {
  expires: number;
  token: string;
}

export interface AuthLoginTokenMigrateTo {
  dc_id: number;
  token: string;
}

export interface AuthLoginTokenSuccess {
  authorization: Authorization;
}

export interface Authorization {
  current?: boolean;
  official_app?: boolean;
  password_pending?: boolean;
  encrypted_requests_disabled?: boolean;
  call_requests_disabled?: boolean;
  unconfirmed?: boolean;
  hash: string;
  device_model: string;
  platform: string;
  system_version: string;
  api_id: number;
  app_name: string;
  app_version: string;
  date_created: number;
  date_active: number;
  ip: string;
  country: string;
  region: string;
}

export interface UpdateLoginToken {
  type: "updateLoginToken";
}

// Function interfaces
export interface AuthExportLoginToken {
  api_id: number;
  api_hash: string;
  except_ids: number[];
}

export interface AuthAcceptLoginToken {
  token: string;
}

export interface AuthImportLoginToken {
  token: string;
}

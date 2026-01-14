import fs from "fs";
import os from "os";
import path from "path";

interface Config {
  dbUrl: string;
  currentUserName: string;
}

function getConfigFilePath(): string {
  const home = os.homedir();
  return path.join(home, ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const path = getConfigFilePath();
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(path, data, "utf8");
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config");
  }

  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config");
  }

  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}

export function setUser(name: string): void {
  const config = readConfig();
  config.currentUserName = name;
  writeConfig(config);
}

export function readConfig(): Config {
  const path = getConfigFilePath();
  const data = fs.readFileSync(path, "utf8");
  const rawConfig = JSON.parse(data);
  return validateConfig(rawConfig);
}

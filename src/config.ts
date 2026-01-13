import fs from "fs";
import os from "os";
import path from "path";

interface Config {
  dbUrl: string;
  currentUserName: string;
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const configToSave = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  fs.writeFileSync(getConfigFilePath(), JSON.stringify(configToSave), "utf8");
}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig === null) {
    throw new Error("rawConfig should be an object");
  }

  if (
    !Object.hasOwn(rawConfig, "db_url") &&
    !Object.hasOwn(rawConfig, "current_user_name")
  ) {
    throw new Error("rawConfig must have db_url and current_user_name");
  }

  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}

export function setUser(name: string): void {
  const currConfig = readConfig();
  writeConfig({
    dbUrl: currConfig.dbUrl,
    currentUserName: name,
  });
}

export function readConfig(): Config {
  const cfg = fs.readFileSync(getConfigFilePath(), "utf8");
  return validateConfig(JSON.parse(cfg));
}

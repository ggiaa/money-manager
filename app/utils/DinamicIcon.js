import * as Icons from "./Icons";

function DinamicIcon({ iconName, style }) {
  const Icon = Icons[iconName];
  return <Icon className={style} />;
}

export default DinamicIcon;

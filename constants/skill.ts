export interface ISkill {
  skill_name: string;
  Image: string;
  width: number;
  height: number;
}

const ROOT = "/images/svgs/tech-stack";

const s = (skill_name: string, path: string, size = 60): ISkill => ({
  skill_name,
  Image: `${ROOT}/${path}`,
  width: size,
  height: size,
});

/**
 * Automation & AI operations — the current job. Glyphs for these tools are
 * drawn in-house (public/images/svgs/tech-stack/automation) so the whole
 * grid shares one visual weight.
 */
export const AutoSkillData: ISkill[] = [
  s("Make", "automation/make.svg"),
  s("Brevo", "automation/brevo.svg"),
  s("Supabase", "automation/supabase.svg"),
  s("LangChain", "automation/langchain.svg"),
  s("Dust", "automation/dust.svg"),
  s("Slack", "automation/slack.svg"),
  s("PandaDoc", "automation/pandadoc.svg"),
  s("Planhat", "automation/planhat.svg"),
  s("Qobra", "automation/qobra.svg"),
  s("Gong", "automation/gong.svg"),
  s("Chilipiper", "automation/chilipiper.svg"),
  s("Webhooks", "automation/webhook.svg"),
];

export const DevSkillData: ISkill[] = [
  s("TypeScript", "languages/typescript.svg"),
  s("JavaScript", "languages/javascript-original.svg", 50),
  s("Python", "languages/python-original-wordmark.svg"),
  s("Elixir", "languages/elixir-original-wordmark.svg", 75),
  s("Dart", "mobile-app-development/dart-original-wordmark.svg", 75),
  s("PHP", "languages/php-plain.svg", 70),
  s("Java", "languages/java-original-wordmark.svg", 65),
  s("C", "languages/c-original.svg"),
  s("C#", "languages/csharp-original.svg"),
  s("Embedded C", "languages/embeddedc-original-wordmark.svg"),
  s("Next.js", "frontend-development/nextjs-original.svg"),
  s("React", "frontend-development/react-original-wordmark.svg", 55),
  s("React Native", "mobile-app-development/react-native.svg", 50),
  s("Flutter", "mobile-app-development/flutter-original.svg", 40),
  s("Node.js", "backend-development/nodejs-original-wordmark.svg", 75),
  s("NestJS", "backend-development/nestjs-original.svg"),
  s("Express", "backend-development/express-original-wordmark.svg", 70),
  s("GraphQL", "backend-development/graphql.svg"),
  s("Prisma", "backend-development/prisma.svg"),
  s("FastAPI", "frameworks/fastapi-original-wordmark.svg", 80),
  s("Flask", "frameworks/flask-original-wordmark.svg", 70),
  s("Phoenix", "frameworks/phoenix-original-wordmark.svg", 55),
  s("Spring", "backend-development/spring-original-wordmark.svg"),
  s(".NET", "frameworks/dot-net-original-wordmark.svg", 55),
  s("CodeIgniter", "frameworks/codeigniter-plain-wordmark.svg"),
  s("Electron", "frameworks/electron-original.svg"),
  s("Odoo", "other-tools/Odoo-Logo.wine.svg", 80),
  s("HTML5", "frontend-development/html5-original-wordmark.svg"),
  s("CSS3", "frontend-development/css3-original-wordmark.svg"),
  s("Bootstrap", "frontend-development/bootstrap-plain-wordmark.svg", 50),
  s("Docker", "devops/docker-original-wordmark.svg", 55),
  s("Nginx", "backend-development/nginx-original.svg", 70),
  s("Bash", "devops/bash-original.svg"),
  s("SSH", "other-tools/ssh-original-wordmark.svg"),
  s("Git", "versionning/git-original-wordmark.svg"),
];

export const DbSkillData: ISkill[] = [
  s("PostgreSQL", "db/postgresql-original-wordmark.svg", 55),
  s("MySQL", "db/mysql-original-wordmark.svg", 70),
  s("MariaDB", "db/mariadb-icon.svg", 55),
  s("MongoDB", "db/mongodb-original-wordmark.svg"),
  s("SQLite", "db/sqlite-original-wordmark.svg"),
  s("Oracle", "db/oracle-original.svg", 70),
];

export const AiSkillData: ISkill[] = [
  s("Pandas", "ai-ml/pandas-original-wordmark.svg", 55),
  s("NumPy", "ai-ml/numpy-original-wordmark.svg", 70),
  s("scikit-learn", "ai-ml/scikit-learn-seeklogo.com.svg", 70),
  s("TensorFlow", "ai-ml/tensorflow-original-wordmark.svg", 75),
  s("PyTorch", "ai-ml/pytorch-original-wordmark.svg", 75),
  s("Jupyter", "ai-ml/jupyter-original-wordmark.svg"),
  s("Anaconda", "ai-ml/anaconda-original-wordmark.svg", 70),
  s("Kaggle", "ai-ml/kaggle-original-wordmark.svg"),
  s("Seaborn", "ai-ml/seaborn-seeklogo.com.svg", 55),
  s("MATLAB", "ai-ml/matlab-original.svg", 70),
];

export const SKILL_GROUPS = {
  auto: AutoSkillData,
  dev: DevSkillData,
  data: DbSkillData,
  ml: AiSkillData,
} as const;

export type SkillGroup = keyof typeof SKILL_GROUPS;

export const SKILL_COUNT =
  AutoSkillData.length +
  DevSkillData.length +
  DbSkillData.length +
  AiSkillData.length;

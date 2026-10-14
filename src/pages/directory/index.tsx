import { Link, useSearchParams } from 'react-router-dom';
import { Segmented } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { APP_TITLE } from '@/config/app';
import { BUILDING_PREFIX, FLAT_LEAVES, MENU, type FlatLeaf } from '@/config/menu';
import {
  DIRECTORY,
  FUNCTION_GROUPS,
  ROLES,
  type DirectoryEntry,
  type RoleKey,
} from '@/config/directory';
import { PAGES } from '@/router/pages';
import styles from './index.module.css';

/* 场景目录：原型入口，不属于后管界面。列出全部已实现页面，可按功能或按角色分组查看 */

type View = 'function' | 'role';

interface Item extends FlatLeaf {
  entry: DirectoryEntry;
}

const FALLBACK: DirectoryEntry = { group: 'account', desc: '', roles: [] };
const roleTitle = (k: RoleKey) => ROLES.find((r) => r.key === k)?.title ?? k;

const ITEMS: Item[] = FLAT_LEAVES.filter((l) => PAGES[l.path]).map((l) => ({
  ...l,
  entry: DIRECTORY[l.path] ?? FALLBACK,
}));
const UNCONFIGURED = ITEMS.filter((i) => !DIRECTORY[i.path]);

function Card({ item, view }: { item: Item; view: View }) {
  const { entry } = item;
  return (
    <Link className={styles.card} to={item.path}>
      <strong>{item.name}</strong>
      {entry.desc && <span className={styles.desc}>{entry.desc}</span>}
      <span className={styles.meta}>
        <span className={styles.trail}>{item.trail.join(' / ')}</span>
        {view === 'function'
          ? entry.roles.map((r) => (
              <span key={r} className={`${styles.tag} ${entry.inferred ? styles.inferred : ''}`}>
                {roleTitle(r)}
              </span>
            ))
          : (() => {
              const g = FUNCTION_GROUPS.find((f) => f.key === entry.group);
              return (
                <>
                  {g && <span className={styles.tag}>{g.title}</span>}
                  {entry.inferred && (
                    <span className={`${styles.tag} ${styles.inferred}`}>角色待确认</span>
                  )}
                </>
              );
            })()}
      </span>
      <code>#{item.path}</code>
    </Link>
  );
}

function Section({
  title,
  desc,
  items,
  view,
}: {
  title: string;
  desc?: string;
  items: Item[];
  view: View;
}) {
  if (!items.length) return null;
  return (
    <section className={styles.section}>
      <h2>
        {title}
        <em>{items.length}</em>
      </h2>
      <p>{desc || ' '}</p>
      <div className={styles.grid}>
        {items.map((i) => (
          <Card key={i.path} item={i} view={view} />
        ))}
      </div>
    </section>
  );
}

export default function Directory() {
  const [params, setParams] = useSearchParams();
  const view: View = params.get('view') === 'role' ? 'role' : 'function';

  const building = MENU.map((m) => ({
    name: m.name,
    leaves: FLAT_LEAVES.filter((l) => l.trail[0] === m.name && l.path.startsWith(BUILDING_PREFIX)),
  })).filter((m) => m.leaves.length);
  const buildingCount = building.reduce((n, m) => n + m.leaves.length, 0);

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <h1>{APP_TITLE}原型 · 场景目录</h1>
            <p>
              列出全部已实现的 {ITEMS.length}{' '}
              个页面，点击卡片进入后管对应页面。可按「功能」或「角色」分组查看。
              <br />
              角色依据方案文档；<span className={styles.inferredHint}>虚线标签</span>
              为按业务推断的角色，待评审确认。原型数据均为本地 mock，刷新页面即恢复。
            </p>
          </div>
          <Link className={styles.enter} to="/">
            进入系统 <ArrowRightOutlined />
          </Link>
        </div>

        <Segmented<View>
          className={styles.switch}
          value={view}
          options={[
            { label: '按功能', value: 'function' },
            { label: '按角色', value: 'role' },
          ]}
          onChange={(v) => setParams(v === 'role' ? { view: 'role' } : {}, { replace: true })}
        />

        {view === 'function'
          ? FUNCTION_GROUPS.map((g) => (
              <Section
                key={g.key}
                title={g.title}
                desc={g.desc}
                view={view}
                items={ITEMS.filter((i) => DIRECTORY[i.path]?.group === g.key)}
              />
            ))
          : ROLES.map((r) => (
              <Section
                key={r.key}
                title={r.title}
                desc={r.desc}
                view={view}
                items={ITEMS.filter((i) => DIRECTORY[i.path]?.roles.includes(r.key))}
              />
            ))}

        <Section
          title="其他"
          desc="尚未在 config/directory.ts 中分类的页面"
          view={view}
          items={UNCONFIGURED}
        />

        <section className={styles.section}>
          <h2>
            建设中
            <em>{buildingCount}</em>
          </h2>
          <p>侧栏中保留、原型尚未覆盖的菜单，点击后显示「建设中」</p>
          <div className={styles.building}>
            {building.map((m) => (
              <div key={m.name} className={styles.buildingRow}>
                <span className={styles.buildingModule}>{m.name}</span>
                {m.leaves.map((l) => (
                  <Link key={l.path} to={l.path} className={styles.chip}>
                    {l.trail.slice(1).join(' / ')}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

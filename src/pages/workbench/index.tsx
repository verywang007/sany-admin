import { Link, useNavigate } from 'react-router-dom';
import { Card, Col, Row, Typography } from 'antd';
import { MENU, leafPath } from '@/config/menu';
import { PAGES } from '@/router/pages';
import PageContainer from '@/components/PageContainer';

/** 工作台：按模块列出已实现的原型页面，作为快捷入口 */
export default function Workbench() {
  const navigate = useNavigate();
  const groups = MENU.map((m) => ({
    name: m.name,
    pages: (m.children ?? []).filter((c) => c.path && PAGES[c.path]),
  })).filter((g) => g.pages.length);

  return (
    <PageContainer
      title="工作台"
      card={false}
      extra={<Link to="/directory">查看场景目录（按功能 / 角色分类）</Link>}
    >
      <Row gutter={[12, 12]}>
        {groups.map((g) => (
          <Col span={8} key={g.name}>
            <Card title={g.name} size="small">
              {g.pages.map((p) => (
                <Typography.Link
                  key={p.name}
                  style={{ display: 'inline-block', margin: '4px 16px 4px 0' }}
                  onClick={() => navigate(leafPath(p))}
                >
                  {p.name}
                </Typography.Link>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
}

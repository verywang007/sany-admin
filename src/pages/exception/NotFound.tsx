import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="页面不存在"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回工作台
        </Button>
      }
    />
  );
}

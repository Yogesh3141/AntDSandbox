import React from 'react';
import 'antd/dist/reset.css';
import './App.css';
import { Tabs, TabsProps } from 'antd';
import PurchaseList from './Components/PurchaseList';
import SalesList from './Components/SalesList';

function App() {
  const [tabKey, setTabKey] = React.useState<string>('purchase');

  const items: TabsProps['items'] = [
    {
      key: 'purchase',
      label: `Purchase`,
      children: <PurchaseList />,
    },
    {
      key: 'sales',
      label: `Sales`,
      children: <SalesList />,
    },
  ];

  return (
    <div className="App">
      <Tabs centered destroyInactiveTabPane defaultActiveKey={tabKey} items={items} onChange={(key: string) => setTabKey(key)} />
    </div>
  );
}

export default App;

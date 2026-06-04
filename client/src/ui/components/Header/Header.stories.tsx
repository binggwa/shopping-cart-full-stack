import { Header } from "./Header";

export default {
  title: 'Common/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = () => {
  return <Header onLogoClick={() => alert('새로고침!')} />;
};

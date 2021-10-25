import { getInitPage } from '@keystone-next/auth/pages/InitPage';

const fieldPaths = ["name","email","password","phone"];

export default getInitPage({"listKey":"User","fieldPaths":["name","email","password","phone"],"enableWelcome":true});

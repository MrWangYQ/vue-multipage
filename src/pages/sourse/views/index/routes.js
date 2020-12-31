import Index from '../page/Index';
const Logged = r => require.ensure([], () => r(require('../page/logged')))

export default [
  { path: '/', component: Index },
  { path: '/logged', component: Logged },
];

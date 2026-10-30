// Shared deterministic browser environment for read-only presentation checks.
const path = require('path');
const util = require('util');
const FILE = path.resolve(__dirname, '../../index.html');
const URL_ = 'file:///' + FILE.replace(/\\/g, '/');
const FIXED_TIME = Date.UTC(2026, 9, 26, 10, 0, 0);

function beforeParse(window) {
  const RealDate = window.Date;
  window.Date = class extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : [FIXED_TIME]));
    }
    static now() {
      return FIXED_TIME;
    }
  };
  let seed = 42;
  window.Math.random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  // file:// history updates differ between jsdom and browsers. Record intended
  // routes so tests can still compare navigation without hiding product errors.
  const history = window.history;
  window.__routes = [];
  window.history.replaceState = function (...args) {
    try {
      history.replaceState.apply(history, args);
    } catch (error) {}
    window.__routes.push(String(args[2] || ''));
  };
  for (const name of ['TextEncoder', 'TextDecoder']) {
    if (!window[name]) window[name] = util[name];
  }
}

function routes(platform) {
  const result = [];
  for (const [section] of platform.sections) {
    const menu = platform.menus[section] || [];
    if (menu.length) menu.forEach(([item]) => result.push([section, item]));
    else result.push([section, 'home']);
  }
  result.push(
    ['scan', 'tasks', 'app-scan'],
    ['scan', 'tasks', 'web-scan'],
    // 旧地址：确认仍能换算到 scan/* 与 exercise/*
    ['evaluation', 'scan', 'web-scan'],
    ['evaluation', 'attack', 'tasks'],
    ['policy', 'policies', 'strategies'],
    ['policy', 'policies', 'methods'],
    ['policy', 'policies', 'content'],
  );
  return result;
}

module.exports = { FILE, URL_, beforeParse, routes };

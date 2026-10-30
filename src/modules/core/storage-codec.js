/* core/storage-codec。启动顺序见 src/boot.js。 */
window.AppParts = window.AppParts || {};

AppParts['core/storage-codec'] = function () {
  /* Lossless storage interning; decoding creates independent snapshot objects. */
  (function () {
    'use strict';
    const A = window.App,
      format = 'zhian-packed-v2';
    const C = (A.storageCodec = {
      encode(data) {
        const nodes = [],
          seen = new Map(),
          shapes = [],
          shapeIds = new Map();
        const visit = (value) => {
          if (value === null || (typeof value !== 'object' && typeof value !== 'string'))
            return value;
          if (typeof value === 'string' && value.length < 20) return value;
          let encoded;
          if (typeof value === 'string') encoded = value;
          else if (Array.isArray(value))
            encoded = ['a', ...value.map((v) => visit(v === undefined ? null : v))];
          else {
            const entries = Object.entries(value).filter(
                ([, v]) => v !== undefined && typeof v !== 'function',
              ),
              keys = entries.map(([k]) => k),
              signature = JSON.stringify(keys);
            let id = shapeIds.get(signature);
            if (id === undefined) {
              id = shapes.length;
              shapes.push(keys);
              shapeIds.set(signature, id);
            }
            encoded = ['o', id, ...entries.map(([, v]) => visit(v))];
          }
          const key = JSON.stringify(encoded);
          if (key.length < 40 && typeof encoded !== 'string') return encoded;
          if (seen.has(key)) return ['r', seen.get(key)];
          const id = nodes.length;
          nodes.push(encoded);
          seen.set(key, id);
          return ['r', id];
        };
        const root = visit(data);
        return { format, root, nodes, shapes };
      },
      decode(data) {
        if (![format, 'zhian-packed-v1'].includes(data?.format)) return data;
        const visit = (value, depth = 0) => {
          if (depth > 200) throw Error('Invalid stored data nesting');
          if (Array.isArray(value)) {
            if (value[0] === 'r') {
              if (!Number.isInteger(value[1]) || value[1] < 0 || value[1] >= data.nodes.length)
                throw Error('Invalid stored data reference');
              return visit(data.nodes[value[1]], depth + 1);
            }
            if (value[0] === 'o' && data.format === format) {
              const keys = data.shapes?.[value[1]];
              if (
                !Array.isArray(keys) ||
                keys.length !== value.length - 2 ||
                keys.some((k) => typeof k !== 'string')
              )
                throw Error('Invalid stored object shape');
              return Object.fromEntries(
                keys.map((key, i) => [key, visit(value[i + 2], depth + 1)]),
              );
            }
            if (value[0] !== 'a') throw Error('Invalid stored array');
            return value.slice(1).map((v) => visit(v, depth + 1));
          }
          if (value && typeof value === 'object')
            return Object.fromEntries(
              Object.entries(value).map(([k, v]) => [k, visit(v, depth + 1)]),
            );
          return value;
        };
        return visit(data.root);
      },
    });
    try {
      A.data = C.decode(A.data);
    } catch (error) {
      A.storageOK = false;
    }
    A.save = function () {
      try {
        localStorage.setItem('zhian-standalone-attack', JSON.stringify(C.encode(A.data)));
        A.storageOK = true;
      } catch (error) {
        A.storageOK = false;
        A.toast('浏览器存储不可用，本次修改仅在当前页面保留');
      }
    };
  })();
};

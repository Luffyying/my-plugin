(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.vtable = factory());
}(this, function () { 'use strict';

    function applyMixin(vue){
        vue.mixin({
            // components:{}
        });
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script = {
      name: 'vtable',
      props: {
        title: {
          type: Array,
          default: function() {
            return []
          }
        },
        list: {
          type: Array,
          default: function() {
            return []
          }
        }
      },
      data() {
        return {
          rows: [],
          count: null,
          reld: [], //二维数组
          //fields: ['k1', 'k3', 'k5', 'k4', 'k0'],
          fields: [],
          result: [],
          // body: {
          //   total: [
          //     {
          //       k0: 'v0',
          //       k1: 'v1',
          //       '<': [
          //         {
          //           '<': [
          //             {
          //               k4: 'v2',
          //               '<': [
          //                 {
          //                   k5: 'v3'
          //                 },
          //                 {
          //                   k5: 'v5'
          //                 }
          //               ]
          //             },
          //             {
          //               '<': [
          //                 {
          //                   k4: 'v6'
          //                 },
          //                 {
          //                   k4: 'v8'
          //                 }
          //               ],
          //               k5: 'v7'
          //             }
          //           ],
          //           k3: 'v4'
          //         },
          //         {
          //           '<': [
          //             {
          //               k4: 'v9',
          //               k5: 'v10'
          //             },
          //             {
          //               k4: 'v12',
          //               k5: 'v13'
          //             }
          //           ],
          //           k3: 'v11'
          //         }
          //       ]
          //     }
          //   ]
          // },

          // test: [
          //   {
          //     fields: [
          //       {
          //         key: 'k0',
          //         label: 'h0',
          //         type: 'text'
          //       },
          //       {
          //         key: 'k1',
          //         label: 'h1',
          //         type: 'text'
          //       },
          //       {
          //         label: 'h2',
          //         children: [
          //           {
          //             key: 'k4',
          //             label: 'h4',
          //             type: 'text'
          //           },
          //           {
          //             key: 'k5',
          //             label: 'h5',
          //             type: 'text'
          //           }
          //         ]
          //       },
          //       {
          //         key: 'k3',
          //         label: 'h3',
          //         type: 'text'
          //       }
          //     ]
          //   }
          //   // {
          //   //   fields: [
          //   //     {
          //   //       key: 'k0',
          //   //       label: 'h0',
          //   //       type: 'text'
          //   //     },
          //   //     {
          //   //       key: 'k1',
          //   //       label: 'h1',
          //   //       type: 'text'
          //   //     },
          //   //     {
          //   //       label: 'h2',
          //   //       children: [
          //   //         {
          //   //           key: 'k4',
          //   //           label: 'h4',
          //   //           type: 'text'
          //   //         },
          //   //         {
          //   //           key: 'k5',
          //   //           label: 'h5',
          //   //           type: 'text'
          //   //         }
          //   //       ]
          //   //     },
          //   //     {
          //   //       key: 'k3',
          //   //       label: 'h3',
          //   //       type: 'text'
          //   //     },
          //   //     {
          //   //       label: 'h6',
          //   //       children: [
          //   //         {
          //   //           label: 'h7',
          //   //           children: [
          //   //             {
          //   //               key: 'k8',
          //   //               label: 'h8',
          //   //               type: 'text'
          //   //             },
          //   //             {
          //   //               key: 'k9',
          //   //               label: 'h9',
          //   //               type: 'text'
          //   //             }
          //   //           ]
          //   //         },
          //   //         {
          //   //           key: 'k10',
          //   //           label: 'h10',
          //   //           type: 'text'
          //   //         }
          //   //       ]
          //   //     }
          //   //   ],
          //   //   key: 'total',
          //   //   label: '总计'
          //   // }
          // ]
        }
      },
      components: {},
      watch: {},
      methods: {
        fill_tree(stacks, si) {
          let result = [];
          for (let cell of stacks[si]) {
            result.push(cell);
            cell['~h'] = 0;
            cell['colspan'] = 1;
            cell['rowspan'] = 1;
            if ('children' in cell && typeof cell['children'] != 'undefined') {
              cell['colspan'] = 0;
              // debugger
              for (let child of cell['children']) {
                child['~p'] = cell;
                stacks[1 - si].push(child);
              }
            }
          }
          stacks[si] = [];
          return result
        },
        typeset_header(d) {
          let rows = this.rows;
          let stacks = [d, []];
          let si = 0;
          while (stacks[si].length) {
            rows.push(this.fill_tree(stacks, si));
            si = 1 - si;
          }
          for (let row of rows.reverse()) {
            let max_h = 0;
            for (let cell of row) {
              if ('~p' in cell) {
                cell['~p']['colspan'] += cell['colspan'];
                cell['~p']['~h'] = Math.max(cell['~p']['~h'], cell['~h'] + 1);
              }
              max_h = Math.max(max_h, cell['~h']);
            }
            for (let c of row) {
              if (max_h > 0 && c['~h'] == 0) {
                c['rowspan'] = max_h + 1;
              }
            }
          }
          //again revert
          rows.reverse();
        },
        disposehead() {
          this.typeset_header(this.title);
          let new_str = '';
          for (let row of this.rows) {
            let cells = [];
            for (let cell of row) {
              cells.push(
                `<th rowspan=${cell['rowspan']} colspan=${cell['colspan']}>${cell['label']}</th>`
              );
            }
            new_str += '<tr>' + '\n' + cells.join('\n') + '</tr>' + '\n';
            this.$refs.head.innerHTML = new_str;
          }
        },
        typeset_data_to_table(d, cur_row = null) {
          let append_cur_row = !cur_row;
          let row_span = 1,
            appear_branch = 0,
            top_keys = [];
          if (!cur_row) {
            cur_row = {};
          }
          for (let k in d) {
            let v = d[k];
            if (k == '<') {
              if (appear_branch) {
                throw TypeError('an error here')
              }
              appear_branch = 1;
              row_span = 0;
              for (let sd of v.slice(1).reverse()) {
                row_span += this.typeset_data_to_table(sd);
              }
              row_span += this.typeset_data_to_table(v[0], cur_row);
            } else {
              top_keys.push(k);
              cur_row[k] = { v: v };
            }
          }
          if (appear_branch) {
            for (let i of top_keys) {
              this.$set(cur_row[i], 'row_span', row_span);
            }
          }
          if (append_cur_row) {
            this.result.push(cur_row);
          }
          return row_span
        },
        disposevalue(arr) {
          //获得所有的叶子节点的数据
          arr.forEach((item) => {
            if (typeof item.children != 'undefined' && item.children.length != 0) {
              this.disposevalue(item.children);
            } else {
              item.key && this.fields.push(item.key);
            }
          });
        },
        disposebody() {
          let arr = this.list;
          arr.forEach((item) => {
            this.typeset_data_to_table(item);
          });
          let new_str = '';
          for (let r of this.result.reverse()) {
            let ds = [];
            for (let f of this.fields) {
              if (f in r) {
                ds.push(`<td rowspan=${r[f]['row_span']}>${r[f]['v']}</td>`);
              }
            }
            new_str += '<tr>' + '\n' + ds.join('\n') + '</tr>' + '\n';
            this.$refs.body.innerHTML = new_str;
          }
        }
      },
      created() {
        this.disposevalue(this.title);
      },
      mounted() {
        if (this.title.length) {
          this.disposehead();
          setTimeout(() => {
            this.disposebody();
          });
        }
      }
    };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
    /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
      } // Vue.extend constructor export interop.


      var options = typeof script === 'function' ? script.options : script; // render functions

      if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true; // functional template

        if (isFunctionalTemplate) {
          options.functional = true;
        }
      } // scopedId


      if (scopeId) {
        options._scopeId = scopeId;
      }

      var hook;

      if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
          // 2.3 injection
          context = context || // cached call
          this.$vnode && this.$vnode.ssrContext || // stateful
          this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
          // 2.2 with runInNewContext: true

          if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
            context = __VUE_SSR_CONTEXT__;
          } // inject component styles


          if (style) {
            style.call(this, createInjectorSSR(context));
          } // register component module identifier for async chunk inference


          if (context && context._registeredComponents) {
            context._registeredComponents.add(moduleIdentifier);
          }
        }; // used by ssr in case component is cached and beforeCreate
        // never gets called


        options._ssrRegister = hook;
      } else if (style) {
        hook = shadowMode ? function () {
          style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
        } : function (context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook) {
        if (options.functional) {
          // register for functional component in vue file
          var originalRender = options.render;

          options.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = options.beforeCreate;
          options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }

      return script;
    }

    var normalizeComponent_1 = normalizeComponent;

    var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
    function createInjector(context) {
      return function (id, style) {
        return addStyle(id, style);
      };
    }
    var HEAD;
    var styles = {};

    function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = {
        ids: new Set(),
        styles: []
      });

      if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;

        if (css.map) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

          code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
        }

        if (!style.element) {
          style.element = document.createElement('style');
          style.element.type = 'text/css';
          if (css.media) style.element.setAttribute('media', css.media);

          if (HEAD === undefined) {
            HEAD = document.head || document.getElementsByTagName('head')[0];
          }

          HEAD.appendChild(style.element);
        }

        if ('styleSheet' in style.element) {
          style.styles.push(code);
          style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
        } else {
          var index = style.ids.size - 1;
          var textNode = document.createTextNode(code);
          var nodes = style.element.childNodes;
          if (nodes[index]) style.element.removeChild(nodes[index]);
          if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
        }
      }
    }

    var browser = createInjector;

    /* script */
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "ivu-table-wrapper" }, [
        _c("div", { staticClass: "ivu-table ivu-table-default" }, [
          _c("div", { staticClass: "ivu-table-header" }, [
            _c(
              "table",
              { attrs: { cellspacing: "0", cellpadding: "0", border: "0" } },
              [_c("thead", { ref: "head", staticClass: "table-head" })]
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "ivu-table-body" }, [
            _c("table", { ref: "body", staticClass: "table-body" }, [_vm._m(0)])
          ])
        ])
      ])
    };
    var __vue_staticRenderFns__ = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("tr", [
          _c("td", { staticStyle: { "text-align": "center" } }, [
            _vm._v("暂无数据9090")
          ])
        ])
      }
    ];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = function (inject) {
        if (!inject) return
        inject("data-v-99583ec4_0", { source: "\n.table-head th,\r\n.table-body td {\r\n  text-align: center;\r\n  border: 1px solid #e8eaec;\n}\ntable {\r\n  width: 100%;\n}\r\n", map: {"version":3,"sources":["D:\\luffy\\vue-table\\my-plugin\\src\\vtable.vue"],"names":[],"mappings":";AA4UA;;EAEA,kBAAA;EACA,yBAAA;AACA;AAEA;EACA,WAAA;AACA","file":"vtable.vue","sourcesContent":["<template>\r\n  <div class=\"ivu-table-wrapper\">\r\n    <div class=\"ivu-table ivu-table-default\">\r\n      <div class=\"ivu-table-header\">\r\n        <table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n          <thead ref=\"head\" class=\"table-head\"></thead>\r\n        </table>\r\n      </div>\r\n      <div class=\"ivu-table-body\">\r\n        <table ref=\"body\" class=\"table-body\">\r\n          <tr>\r\n            <td style=\"text-align:center\">暂无数据9090</td>\r\n          </tr>\r\n        </table>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n<script>\r\nexport default {\r\n  name: 'vtable',\r\n  props: {\r\n    title: {\r\n      type: Array,\r\n      default: function() {\r\n        return []\r\n      }\r\n    },\r\n    list: {\r\n      type: Array,\r\n      default: function() {\r\n        return []\r\n      }\r\n    }\r\n  },\r\n  data() {\r\n    return {\r\n      rows: [],\r\n      count: null,\r\n      reld: [], //二维数组\r\n      //fields: ['k1', 'k3', 'k5', 'k4', 'k0'],\r\n      fields: [],\r\n      result: [],\r\n      // body: {\r\n      //   total: [\r\n      //     {\r\n      //       k0: 'v0',\r\n      //       k1: 'v1',\r\n      //       '<': [\r\n      //         {\r\n      //           '<': [\r\n      //             {\r\n      //               k4: 'v2',\r\n      //               '<': [\r\n      //                 {\r\n      //                   k5: 'v3'\r\n      //                 },\r\n      //                 {\r\n      //                   k5: 'v5'\r\n      //                 }\r\n      //               ]\r\n      //             },\r\n      //             {\r\n      //               '<': [\r\n      //                 {\r\n      //                   k4: 'v6'\r\n      //                 },\r\n      //                 {\r\n      //                   k4: 'v8'\r\n      //                 }\r\n      //               ],\r\n      //               k5: 'v7'\r\n      //             }\r\n      //           ],\r\n      //           k3: 'v4'\r\n      //         },\r\n      //         {\r\n      //           '<': [\r\n      //             {\r\n      //               k4: 'v9',\r\n      //               k5: 'v10'\r\n      //             },\r\n      //             {\r\n      //               k4: 'v12',\r\n      //               k5: 'v13'\r\n      //             }\r\n      //           ],\r\n      //           k3: 'v11'\r\n      //         }\r\n      //       ]\r\n      //     }\r\n      //   ]\r\n      // },\r\n\r\n      // test: [\r\n      //   {\r\n      //     fields: [\r\n      //       {\r\n      //         key: 'k0',\r\n      //         label: 'h0',\r\n      //         type: 'text'\r\n      //       },\r\n      //       {\r\n      //         key: 'k1',\r\n      //         label: 'h1',\r\n      //         type: 'text'\r\n      //       },\r\n      //       {\r\n      //         label: 'h2',\r\n      //         children: [\r\n      //           {\r\n      //             key: 'k4',\r\n      //             label: 'h4',\r\n      //             type: 'text'\r\n      //           },\r\n      //           {\r\n      //             key: 'k5',\r\n      //             label: 'h5',\r\n      //             type: 'text'\r\n      //           }\r\n      //         ]\r\n      //       },\r\n      //       {\r\n      //         key: 'k3',\r\n      //         label: 'h3',\r\n      //         type: 'text'\r\n      //       }\r\n      //     ]\r\n      //   }\r\n      //   // {\r\n      //   //   fields: [\r\n      //   //     {\r\n      //   //       key: 'k0',\r\n      //   //       label: 'h0',\r\n      //   //       type: 'text'\r\n      //   //     },\r\n      //   //     {\r\n      //   //       key: 'k1',\r\n      //   //       label: 'h1',\r\n      //   //       type: 'text'\r\n      //   //     },\r\n      //   //     {\r\n      //   //       label: 'h2',\r\n      //   //       children: [\r\n      //   //         {\r\n      //   //           key: 'k4',\r\n      //   //           label: 'h4',\r\n      //   //           type: 'text'\r\n      //   //         },\r\n      //   //         {\r\n      //   //           key: 'k5',\r\n      //   //           label: 'h5',\r\n      //   //           type: 'text'\r\n      //   //         }\r\n      //   //       ]\r\n      //   //     },\r\n      //   //     {\r\n      //   //       key: 'k3',\r\n      //   //       label: 'h3',\r\n      //   //       type: 'text'\r\n      //   //     },\r\n      //   //     {\r\n      //   //       label: 'h6',\r\n      //   //       children: [\r\n      //   //         {\r\n      //   //           label: 'h7',\r\n      //   //           children: [\r\n      //   //             {\r\n      //   //               key: 'k8',\r\n      //   //               label: 'h8',\r\n      //   //               type: 'text'\r\n      //   //             },\r\n      //   //             {\r\n      //   //               key: 'k9',\r\n      //   //               label: 'h9',\r\n      //   //               type: 'text'\r\n      //   //             }\r\n      //   //           ]\r\n      //   //         },\r\n      //   //         {\r\n      //   //           key: 'k10',\r\n      //   //           label: 'h10',\r\n      //   //           type: 'text'\r\n      //   //         }\r\n      //   //       ]\r\n      //   //     }\r\n      //   //   ],\r\n      //   //   key: 'total',\r\n      //   //   label: '总计'\r\n      //   // }\r\n      // ]\r\n    }\r\n  },\r\n  components: {},\r\n  watch: {},\r\n  methods: {\r\n    fill_tree(stacks, si) {\r\n      let result = []\r\n      for (let cell of stacks[si]) {\r\n        result.push(cell)\r\n        cell['~h'] = 0\r\n        cell['colspan'] = 1\r\n        cell['rowspan'] = 1\r\n        if ('children' in cell && typeof cell['children'] != 'undefined') {\r\n          cell['colspan'] = 0\r\n          // debugger\r\n          for (let child of cell['children']) {\r\n            child['~p'] = cell\r\n            stacks[1 - si].push(child)\r\n          }\r\n        }\r\n      }\r\n      stacks[si] = []\r\n      return result\r\n    },\r\n    typeset_header(d) {\r\n      let rows = this.rows\r\n      let stacks = [d, []]\r\n      let si = 0\r\n      while (stacks[si].length) {\r\n        rows.push(this.fill_tree(stacks, si))\r\n        si = 1 - si\r\n      }\r\n      for (let row of rows.reverse()) {\r\n        let max_h = 0\r\n        for (let cell of row) {\r\n          if ('~p' in cell) {\r\n            cell['~p']['colspan'] += cell['colspan']\r\n            cell['~p']['~h'] = Math.max(cell['~p']['~h'], cell['~h'] + 1)\r\n          }\r\n          max_h = Math.max(max_h, cell['~h'])\r\n        }\r\n        for (let c of row) {\r\n          if (max_h > 0 && c['~h'] == 0) {\r\n            c['rowspan'] = max_h + 1\r\n          }\r\n        }\r\n      }\r\n      //again revert\r\n      rows.reverse()\r\n    },\r\n    disposehead() {\r\n      this.typeset_header(this.title)\r\n      let new_str = ''\r\n      for (let row of this.rows) {\r\n        let cells = []\r\n        for (let cell of row) {\r\n          cells.push(\r\n            `<th rowspan=${cell['rowspan']} colspan=${cell['colspan']}>${cell['label']}</th>`\r\n          )\r\n        }\r\n        new_str += '<tr>' + '\\n' + cells.join('\\n') + '</tr>' + '\\n'\r\n        this.$refs.head.innerHTML = new_str\r\n      }\r\n    },\r\n    typeset_data_to_table(d, cur_row = null) {\r\n      let append_cur_row = !cur_row\r\n      let row_span = 1,\r\n        appear_branch = 0,\r\n        top_keys = []\r\n      if (!cur_row) {\r\n        cur_row = {}\r\n      }\r\n      for (let k in d) {\r\n        let v = d[k]\r\n        if (k == '<') {\r\n          if (appear_branch) {\r\n            throw TypeError('an error here')\r\n          }\r\n          appear_branch = 1\r\n          row_span = 0\r\n          for (let sd of v.slice(1).reverse()) {\r\n            row_span += this.typeset_data_to_table(sd)\r\n          }\r\n          row_span += this.typeset_data_to_table(v[0], cur_row)\r\n        } else {\r\n          top_keys.push(k)\r\n          cur_row[k] = { v: v }\r\n        }\r\n      }\r\n      if (appear_branch) {\r\n        for (let i of top_keys) {\r\n          this.$set(cur_row[i], 'row_span', row_span)\r\n        }\r\n      }\r\n      if (append_cur_row) {\r\n        this.result.push(cur_row)\r\n      }\r\n      return row_span\r\n    },\r\n    disposevalue(arr) {\r\n      //获得所有的叶子节点的数据\r\n      arr.forEach((item) => {\r\n        if (typeof item.children != 'undefined' && item.children.length != 0) {\r\n          this.disposevalue(item.children)\r\n        } else {\r\n          item.key && this.fields.push(item.key)\r\n        }\r\n      })\r\n    },\r\n    disposebody() {\r\n      let arr = this.list\r\n      arr.forEach((item) => {\r\n        this.typeset_data_to_table(item)\r\n      })\r\n      let new_str = ''\r\n      for (let r of this.result.reverse()) {\r\n        let ds = []\r\n        for (let f of this.fields) {\r\n          if (f in r) {\r\n            ds.push(`<td rowspan=${r[f]['row_span']}>${r[f]['v']}</td>`)\r\n          }\r\n        }\r\n        new_str += '<tr>' + '\\n' + ds.join('\\n') + '</tr>' + '\\n'\r\n        this.$refs.body.innerHTML = new_str\r\n      }\r\n    }\r\n  },\r\n  created() {\r\n    this.disposevalue(this.title)\r\n  },\r\n  mounted() {\r\n    if (this.title.length) {\r\n      this.disposehead()\r\n      setTimeout(() => {\r\n        this.disposebody()\r\n      })\r\n    }\r\n  }\r\n}\r\n</script>\r\n<style>\r\n.table-head th,\r\n.table-body td {\r\n  text-align: center;\r\n  border: 1px solid #e8eaec;\r\n}\r\n\r\ntable {\r\n  width: 100%;\r\n}\r\n</style>\r\n"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__ = undefined;
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject SSR */
      

      
      var vtable = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        browser,
        undefined
      );

    let Vue;
    let myinstall = function(_Vue,options){
        if(Vue){
            console.error('<v-table> has already installed' );
            return
        }
        Vue = _Vue;
        Vue.component('vtable',vtable);
        applyMixin(Vue);
    };
    const table = {
        install:myinstall
    };

    // let fields =[
    //     {
    //     key: 'k0',
    //     label: 'h0',
    //     type: 'text'
    //     },
    //     {
    //     key: 'k1',
    //     label: 'h1',
    //     type: 'text'
    //     },
    //     {
    //     label: 'h2',
    //     children: [
    //         {
    //         key: 'k4',
    //         label: 'h4',
    //         type: 'text'
    //         },
    //         {
    //         key: 'k5',
    //         label: 'h5',
    //         type: 'text'
    //         }
    //     ]
    //     },
    //     {
    //     key: 'k3',
    //     label: 'h3',
    //     type: 'text'
    //     },
    //     {
    //     label: 'h6',
    //     children: [
    //         {
    //         label: 'h7',
    //         children: [
    //             {
    //             key: 'k8',
    //             label: 'h8',
    //             type: 'text'
    //             },
    //             {
    //             key: 'k9',
    //             label: 'h9',
    //             type: 'text'
    //             }
    //         ]
    //         },
    //         {
    //         key: 'k10',
    //         label: 'h10',
    //         type: 'text'
    //         }
    //     ]
    //     }
    // ]
    // let body = [
    //         {
    //           k0: 'v0',
    //           k1: 'v1',
    //           '<': [
    //             {
    //               '<': [
    //                 {
    //                   k4: 'v2',
    //                   '<': [
    //                     {
    //                       k5: 'v3'
    //                     },
    //                     {
    //                       k5: 'v5'
    //                     }
    //                   ]
    //                 },
    //                 {
    //                   '<': [
    //                     {
    //                       k4: 'v6'
    //                     },
    //                     {
    //                       k4: 'v8'
    //                     }
    //                   ],
    //                   k5: 'v7'
    //                 }
    //               ],
    //               k3: 'v4'
    //             },
    //             {
    //               '<': [
    //                 {
    //                   k4: 'v9',
    //                   k5: 'v10'
    //                 },
    //                 {
    //                   k4: 'v12',
    //                   k5: 'v13'
    //                 }
    //               ],
    //               k3: 'v11'
    //             }
    //           ]
    //         }
    //       ]

    return table;

}));

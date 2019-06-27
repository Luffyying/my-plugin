<template>
  <div class="ivu-table-wrapper">
    <div class="ivu-table ivu-table-default">
      <div class="ivu-table-header">
        <table cellspacing="0" cellpadding="0" border="0">
          <thead ref="head" class="table-head"></thead>
        </table>
      </div>
      <div class="ivu-table-body">
        <table ref="body" class="table-body">
          <tr>
            <td style="text-align:center">暂无数据</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'vtable',
//   props: {
//     title: {
//       type: Array,
//       default: function() {
//         return []
//       }
//     },
//     list: {
//       type: Array,
//       default: function() {
//         return []
//       }
//     }
//   },
  data() {
    return {
      rows: [],
      count: null,
      reld: [], //二维数组
      fields: ['k1', 'k3', 'k5', 'k4', 'k0'],
    //   fields: [],
    //   result: []
      body: {
        total: [
          {
            k0: 'v0',
            k1: 'v1',
            '<': [
              {
                '<': [
                  {
                    k4: 'v2',
                    '<': [
                      {
                        k5: 'v3'
                      },
                      {
                        k5: 'v5'
                      }
                    ]
                  },
                  {
                    '<': [
                      {
                        k4: 'v6'
                      },
                      {
                        k4: 'v8'
                      }
                    ],
                    k5: 'v7'
                  }
                ],
                k3: 'v4'
              },
              {
                '<': [
                  {
                    k4: 'v9',
                    k5: 'v10'
                  },
                  {
                    k4: 'v12',
                    k5: 'v13'
                  }
                ],
                k3: 'v11'
              }
            ]
          }
        ]
      },

      test: [
        {
          fields: [
            {
              key: 'k0',
              label: 'h0',
              type: 'text'
            },
            {
              key: 'k1',
              label: 'h1',
              type: 'text'
            },
            {
              label: 'h2',
              children: [
                {
                  key: 'k4',
                  label: 'h4',
                  type: 'text'
                },
                {
                  key: 'k5',
                  label: 'h5',
                  type: 'text'
                }
              ]
            },
            {
              key: 'k3',
              label: 'h3',
              type: 'text'
            },
            {
              label: 'h6',
              children: [
                {
                  label: 'h7',
                  children: [
                    {
                      key: 'k8',
                      label: 'h8',
                      type: 'text'
                    },
                    {
                      key: 'k9',
                      label: 'h9',
                      type: 'text'
                    }
                  ]
                },
                {
                  key: 'k10',
                  label: 'h10',
                  type: 'text'
                }
              ]
            }
          ],
          key: 'total',
          label: '总计'
        }
      ]
    }
  },
  components: {},
  watch: {},
  methods: {
    fill_tree(stacks, si) {
      let result = []
      for (let cell of stacks[si]) {
        result.push(cell)
        cell['~h'] = 0
        cell['colspan'] = 1
        cell['rowspan'] = 1
        if ('children' in cell && typeof cell['children'] != 'undefined') {
          cell['colspan'] = 0
          // debugger
          for (let child of cell['children']) {
            child['~p'] = cell
            stacks[1 - si].push(child)
          }
        }
      }
      stacks[si] = []
      return result
    },
    typeset_header(d) {
      let rows = this.rows
      let stacks = [d, []]
      let si = 0
      while (stacks[si].length) {
        rows.push(this.fill_tree(stacks, si))
        si = 1 - si
      }
      for (let row of rows.reverse()) {
        let max_h = 0
        for (let cell of row) {
          if ('~p' in cell) {
            cell['~p']['colspan'] += cell['colspan']
            cell['~p']['~h'] = Math.max(cell['~p']['~h'], cell['~h'] + 1)
          }
          max_h = Math.max(max_h, cell['~h'])
        }
        for (let c of row) {
          if (max_h > 0 && c['~h'] == 0) {
            c['rowspan'] = max_h + 1
          }
        }
      }
      //again revert
      rows.reverse()
    },
    disposehead() {
      this.typeset_header(this.title)
      let new_str = ''
      for (let row of this.rows) {
        let cells = []
        for (let cell of row) {
          cells.push(
            `<th rowspan=${cell['rowspan']} colspan=${cell['colspan']}>${cell['label']}</th>`
          )
        }
        new_str += '<tr>' + '\n' + cells.join('\n') + '</tr>' + '\n'
        this.$refs.head.innerHTML = new_str
      }
    },
    typeset_data_to_table(d, cur_row = null) {
      let append_cur_row = !cur_row
      let row_span = 1,
        appear_branch = 0,
        top_keys = []
      if (!cur_row) {
        cur_row = {}
      }
      for (let k in d) {
        let v = d[k]
        if (k == '<') {
          if (appear_branch) {
            throw TypeError('an error here')
          }
          appear_branch = 1
          row_span = 0
          for (let sd of v.slice(1).reverse()) {
            row_span += this.typeset_data_to_table(sd)
          }
          row_span += this.typeset_data_to_table(v[0], cur_row)
        } else {
          top_keys.push(k)
          cur_row[k] = { v: v }
        }
      }
      if (appear_branch) {
        for (let i of top_keys) {
          this.$set(cur_row[i], 'row_span', row_span)
        }
      }
      if (append_cur_row) {
        this.result.push(cur_row)
      }
      return row_span
    },
    disposevalue(arr) {
      //获得所有的叶子节点的数据
      arr.forEach((item) => {
        if (typeof item.children != 'undefined' && item.children.length != 0) {
          this.disposevalue(item.children)
        } else {
          item.key && this.fields.push(item.key)
        }
      })
    },
    disposebody() {
      let arr = this.list
      arr.forEach((item) => {
        this.typeset_data_to_table(item)
      })
      let new_str = ''
      for (let r of this.result.reverse()) {
        let ds = []
        for (let f of this.fields) {
          if (f in r) {
            ds.push(`<td rowspan=${r[f]['row_span']}>${r[f]['v']}</td>`)
          }
        }
        new_str += '<tr>' + '\n' + ds.join('\n') + '</tr>' + '\n'
        this.$refs.body.innerHTML = new_str
      }
    }
  },
  created() {
    //this.disposevalue(this.title)
  },
  mounted() {
    // if (this.title.length) {
    //   this.disposehead()
    //   setTimeout(() => {
    //     this.disposebody()
    //   })
    // }
  }
}
</script>
<style>
.table-head th,
.table-body td {
  text-align: center;
  border: 1px solid #e8eaec;
}

table {
  width: 100%;
}
</style>

#### it is a vue npm package for create a simple table

> 通过传入数据Schema,展示一个表格（表头和BODY分开展示）,适用于大多数的表格场景

1. table header


    |    key                             | label| children | type |
    | ---------------------------------- | ---  |  ------- | ---- |
    | 对应BODY中的唯一一列，和BODY中键是一一对应的 |  展示内容 |  孩子| 类型 |

> input 是一个树状结构，是一个规则的N叉树


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
            }
          ]
        }
      ]


> output

![Alt text](/title1.png)

2. table body

> 结果用数组表示，每一个数组元素为一个对象；
用"<"表示分叉，指向一个数组，数组内的元素为"<"所在对象的子对象；
每一个对象只允许出现一次"<"，也就是一个子对象数组，以防止出现一个对象分叉为不同数量的子对象的情况；
若一个对象在展现上确实需要多次分叉，但即使如此，实际上分叉的维度应该是一致的，所以可以把多次分叉合并，然后通过schema调整数据显示位置；

> input



    body: {
        total:  [
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
      }


> output

![Alt text](/body1.png)

3. 整体效果

![Alt text](/mytest.png)

4. 相比测试用例更加复杂的其他表格展示

> header

![Alt text](/header.png)


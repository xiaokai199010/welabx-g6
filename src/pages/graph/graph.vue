<template>
  <div class="root">
    <div
      id="headPanel"
      :class="{ hidden: headVisible }"
    >
      <span class="logo">Vue 生命周期图示</span>
      <i
        class="gb-toggle-btn"
        @click="headVisible = !headVisible"
      />
    </div>
    <!-- 左侧按钮 -->
    <item-panel
      :graph="graph"
      @canvas-add-node="addNode"
    />
    <!-- 浮动工具条 -->
    <div id="toolbar">
      <i
        class="iconfont icon-undo"
        @click="addNode"
      />
      <i
        class="iconfont icon-redo"
        @click="addNode"
      />
      <i class="split" />
      <i
        class="iconfont icon-copy"
        @click="copyNode"
      />
      <i
        class="iconfont icon-paste"
        @click="addNode"
      />
      <i class="split" />
      <i
        class="iconfont icon-line-style"
        @click="addNode"
      />
      <i
        class="iconfont icon-line-strong"
        @click="addNode"
      />
      <i class="split" />
      <i
        class="iconfont icon-toup"
        @click="addNode"
      />
      <i
        class="iconfont icon-todown"
        @click="addNode"
      />
      <i class="split" />
      <i
        class="iconfont icon-font-size"
        @click="addNode"
      />
      <i
        class="iconfont icon-actual-size"
        @click="addNode"
      />
      <i
        class="iconfont icon-full-screen"
        @click="addNode"
      />
    </div>
    <!-- 挂载节点 -->
    <div
      id="canvasPanel"
      @dragover.prevent
    />
    <!-- 配置面板 -->
    <div
      id="configPanel"
      :class="{ hidden: !configVisible }"
    >
      <h2 class="panel-title">数据配置</h2>
      <i
        class="gb-toggle-btn"
        @click="configVisible = !configVisible"
      />
      <div class="config-data">
        {{ config }}
      </div>
    </div>
    <div
      v-if="tooltip"
      class="g6-tooltip"
      :style="`top: ${top}px; left: ${left}px;`"
    >
      label: {{ tooltip }}
    </div>
  </div>
</template>

<script>
import G6 from '../../components/graph/graph';
import ItemPanel from './ItemPanel.vue';
import data from './data.js';

export default {
  components: {
    ItemPanel,
  },
  data () {
    return {
      graph:     {},
      highLight: {
        undo: false,
        redo: false,
      },
      // 保存线条样式
      lineStyle: {
        type:  'line',
        width: 1,
      },
      headVisible:   false,
      configVisible: false,
      config:        '',
      tooltip:       '',
      top:           0,
      left:          0,
    };
  },
  mounted () {
    // 创建画布
    this.$nextTick(() => {
      this.createGraphic();
      this.initGraphEvent();
    });
  },
  beforeDestroy () {
    this.graph.destroy();
  },
  methods: {
    createGraphic () {
      const graph = new G6({
        layout: {
          type:    'dagre',
          // rankdir: 'LR',
          nodesep: 80,
          ranksep: 40,
        },
        defaultNode: {
          type:  'rect-node',
          style: {
            radius: 10,
          },
          labelCfg: {
            fontSize: 20,
          },
        },
        // 覆盖全局样式
        nodeStateStyles: {
          'nodeState:default': {
            opacity: 1,
          },
          'nodeState:hover': {
            opacity: 0.8,
          },
          'nodeState:selected': {
            opacity: 0.9,
          },
        },
        // 自定义注册行为, 事件, 交互
        registerFactory: (G6, cfg) => {
          const minimap = new G6.Minimap({
            size: [200, 100],
          });

          cfg.plugins = [minimap];
        },
        // ... 其他G6原生入参
      });

      this.graph = graph.instance;
      this.graph.read(data);
      this.graph.paint();
      // this.graph.fitView();
      // 销毁实例
      // graph.destroy();
    },
    // 复制节点
    copyNode () { },
    // 粘贴节点
    paste () { },
    // 添加节点
    addNode (e) {
      const model = {
        text: 'node',
        // id:  Util.uniqueId(),
        // 形状
        type: e.target.dataset.shape,
        // 坐标
        x:    e.clientX - 80,
        y:    e.clientY - 40,
      };

      this.graph.addItem('node', model);
    },
    // 初始化图事件
    initGraphEvent () {
      this.graph.on('on-node-mouseenter', e => {
        if (e && e.item) {
          // const model = e.item.get('model');

          // model.style.fill = 'rgba(24, 144, 255, .3)';
        }
      });

      this.graph.on('after-node-selected', e => {
        this.configVisible = !!e;

        if (e && e.item) {
          const model = e.item.get('model');

          this.config = model;

          // model.label = e.item.get('id');
          /* this.graph.updateItem(e.item, {
            x: 100,
            y: 100,
          }); */
        }
      });

      this.graph.on('after-edge-selected', e => {
        this.configVisible = !!e;

        if (e && e.item) {
          this.config = e.item.get('model').id;

          this.graph.updateItem(e.item, {
            // shape: 'line-edge',
            style: {
              radius:    10,
              lineWidth: 2,
            },
          });
        }
      });

      this.graph.on('on-edge-mousemove', e => {
        if (e && e.item) {
          this.tooltip = e.item.get('model').label;
          this.left = e.clientX + 40;
          this.top = e.clientY - 20;
        }
      });

      this.graph.on('on-node-mousemove', e => {
        if (e && e.item) {
          this.tooltip = e.item.get('model').id;
          this.left = e.clientX + 40;
          this.top = e.clientY - 20;
        }
      });

      this.graph.on('on-node-mouseleave', e => {
        if (e && e.item) {
          this.tooltip = '';
        }
      });

      this.graph.on('on-edge-mouseleave', e => {
        if (e && e.item) {
          this.tooltip = '';
        }
      });

      this.graph.on('before-node-removed', ({ target, callback }) => {
        console.log(target);
        setTimeout(() => {
          callback(true);
        }, 100);
      });

      this.graph.on('after-node-dblclick', e => {
        if (e && e.item) {
          console.log(e.item);
        }
      });

      this.graph.on('before-edge-add', ({ source, target, sourceAnchor, targetAnchor }) => {
        setTimeout(() => {
          this.graph.addItem('edge', {
            source: source.get('id'),
            target: target.get('id'),
            sourceAnchor,
            targetAnchor,
            label:  'edge label',
          });
        }, 100);
      });
    },
  },
};
</script>

<style lang="scss">
  /* 提示框的样式 */
  .g6-tooltip {
    position: fixed;
    top: 0;
    left: 0;
    font-size: 12px;
    color: #545454;
    border-radius: 4px;
    border: 1px solid #e2e2e2;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: rgb(174, 174, 174) 0 0 10px;
    padding: 10px 8px;
  }
  .g6-minimap{
    position: absolute;
    right: 0;
    bottom: 0;
  }
</style>

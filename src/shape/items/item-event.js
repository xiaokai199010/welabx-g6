/**
 * @author claude
 * @date 2018/3/24
 * @description 通通来自于 behavior 里注册的事件
 */

const events = {
    /**
     * @description 恢复节点/边/锚点默认样式
     */
    setStyle (node, text, nodeStyle, textStyle) {
        node.attr(nodeStyle);
        if(text) {
            node.attr(textStyle);
        }
    },

    /**
     * @description 锚点事件
    */
    anchorShow (value, group) {
        // 显示/隐藏锚点
        if (value) {
            group.showAnchor(group);
        } else {
            group.clearAnchor(group);
        }
    },

    /**
     * @description 锚点激活事件
     */
    anchorActived(value, group) {
        if (value) {
            const bbox = group.get('children')[0].getBBox();
            const allAnchors = this.getAnchorPoints();

            group.showAnchor(group);
            allAnchors.forEach(p => {
                const anchorBg = group.addShape('circle', {
                    attrs: {
                        x:    bbox.minX + bbox.width * p[0],
                        y:    bbox.minY + bbox.height * p[1],
                        fill: 'rgba(24, 144, 255, .5)',
                        r:    10,
                    },
                    className: 'node-anchor-bg',
                });

                group.anchorShapes.push(anchorBg);
            });

            group.getAllAnchors().forEach(item => item.toFront());
        } else {
            // 移除
            group.clearAnchor(group);
        }
    },

    /**
     * @description selected事件
     */
    selected (value, group) {
        const nodeDefault = this.options.style;
        const textDefault = this.options.nodeLabelStyles;
        const nodeHover = this.options.nodeStateStyles.selected;
        const textHover = this.options.nodeLabelStateStyles.selected;
        const node = group.getChildByIndex(0);
        const text = group.getChildByIndex(1);

        if (value) {
            events.setStyle(node, text, nodeHover, textHover);
        } else {
            events.setStyle(node, text, nodeDefault, textDefault);
        }
    },

    /**
     * @description 节点hover事件
     */
    nodeHover(value, group) {
        const node = group.getChildByIndex(0);
        const text = group.getChildByIndex(1);

        if (value) {
            node.attr('cursor', 'move');
            if(text) {
                text.attr('cursor', 'default');
            }
        } else {
            node.attr('cursor', 'default');
            if(text) {
                text.attr('cursor', 'default');
            }
        }
    },

    /**
     * @description 节点拖拽开始事件
     */
    nodeOnDragStart(value, group) {
        // console.log(value, group);

    },

    /**
     * @description 节点拖拽事件
     */
    nodeOnDrag(value, group) {

    },

    /**
     * @description 节点拖拽结束事件
     */
    nodeOnDragEnd(value, group) {

    },

    /**
     * @description 边hover事件
     */
    edgeHover(value, group) {

    },

};

export default events;
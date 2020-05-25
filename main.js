
'use strict';

module.exports = {

    // 当 package 被正确加载的时候执行
    load () { },

    // 当 package 被正确卸载的时候执行
    unload () { },

    // 插件所监听的消息
    messages: {
        'open' () {
            Editor.Panel.open('mesh-optimizer');
        },
    },
};
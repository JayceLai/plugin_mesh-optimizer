'use strict';

const { join } = require('path');
const { exec } = require('child_process');
const { readFileSync } = require("fs");
const pkg = require('./package.json');

// 加载编辑器里的 Vue
module.paths.push(join(Editor.App.path, 'node_modules'));
const Vue = require('vue/dist/vue.js');

let panel = null;
let vm = null;
let isRunning = false;

// 面板内的 css
exports.style = readFileSync(join(__dirname, './panel.css'));

// 面板 html
exports.template = readFileSync(join(__dirname, './panel.html'));

// 节点选择器
exports.$ = {
  root: '#root',
};

// 面板显示完成后触发
exports.ready = function () {
  panel = this;

  vm = new Vue({
    el: panel.$.root,
    data: {
      switchLang: 0,
    },
    methods: {
      // i18n 翻译
      t (key) {
        return Editor.I18n.t(`${pkg.name}.${key}`);
      },
      run () {
        if (isRunning) {
          return console.warn(vm.t('executeWarn'));
        }

        // basics
        if (vm.$refs.i.value.trim() === '') {
          console.error(vm.t('basics.inputTip'));
          return;
        }

        if (vm.$refs.o.value.trim() === '') {
          console.error(vm.t('basics.outputTip'));
          return;
        }

        isRunning = true;

        try {
          let cmd = 'node ' + join(__dirname, '/node_modules/gltfpack/bin/gltfpack.js'); //node

          cmd += ' -i ' + vm.$refs.i.value;
          cmd += ' -o ' + vm.$refs.o.value;

          let _cVlaue = vm.$refs.c.value;
          if (_cVlaue === '1') {
            cmd += ' -c'
          } else if (_cVlaue === '2') {
            cmd += ' -cc'
          }

          // textures
          if (vm.$refs.te.value) { cmd += ' -te'; }
          if (vm.$refs.tb.value) { cmd += ' -tb'; }
          if (vm.$refs.tc.value) { cmd += ' -tc'; }
          if (vm.$refs.tq.value !== 50) { cmd += (' -tq ' + vm.$refs.tq.value); }
          if (vm.$refs.tu.value) { cmd += ' -tu'; }

          // simplification
          if (vm.$refs.si.value !== 1) { cmd += (' -si ' + vm.$refs.si.value); }
          if (vm.$refs.sa.value) { cmd += ' -sa'; }

          // vertices
          if (vm.$refs.vp.value !== 14) { cmd += (' -vp ' + vm.$refs.vp.value); }
          if (vm.$refs.vt.value !== 12) { cmd += (' -vt ' + vm.$refs.vt.value); }
          if (vm.$refs.vn.value !== 8) { cmd += (' -vn ' + vm.$refs.vn.value); }

          // animation
          if (vm.$refs.at.value !== 16) { cmd += (' -at ' + vm.$refs.at.value); }
          if (vm.$refs.ar.value !== 12) { cmd += (' -ar ' + vm.$refs.ar.value); }
          if (vm.$refs.as.value !== 16) { cmd += (' -as ' + vm.$refs.as.value); }
          if (vm.$refs.af.value !== 30) { cmd += (' -af ' + vm.$refs.af.value); }
          if (vm.$refs.ac.value) { cmd += ' -ac'; }

          // scene
          if (vm.$refs.kn.value) { cmd += ' -kn'; }
          if (vm.$refs.ke.value) { cmd += ' -ke'; }

          // miscellaneous
          if (vm.$refs.cf.value) { cmd += ' -cf'; }
          if (vm.$refs.noq.value) { cmd += ' -noq'; }
          if (vm.$refs.v.value) { cmd += ' -v'; }
          // if (vm.$refs.h.value) { cmd += ' -h'; }

          console.log(cmd);

          exec(cmd, (error, stdout, stderr) => {
            console.log(vm.t('executeEnd'));

            if (error) { console.error(`Error: ${error}`); }

            if (stderr) { console.error(`Error: ${stderr}`); }

            if (stdout) { console.log(`${stdout}`); }
          });
        } catch (error) {
          console.error(error);
        } finally {
          isRunning = false;
        }
      }
    },
  });
};

// 面板关闭的时候会触发，如果 return false，会中断关闭流程
exports.beforeClose = function () {
  if (isRunning) {
    console.warn(vm.t('executeWarnClose'));
    return false;
  }
};

// 面板确定要关闭后，会触发这个函数，在这里需要保存面板需要存储的数据
exports.close = function () { };

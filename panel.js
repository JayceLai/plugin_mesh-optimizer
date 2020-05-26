'use strict';

const { join } = require('path');
const { exec } = require('child_process');

// 面板内的 css
exports.style = `
:host {
  display: flex;
  flex-direction: column;
  margin: 5px;
}

.top {
  height: 30px;
  text-align: center;
}

.middle {
  flex: 1;
  overflow: auto;
}

.bottom {
  height: 30px;
  text-align: center;
}
`;

// 面板 html
exports.template = `
<div class="top" center>
  <h1><b>gltfpack v0.14</b></h1>
</div>

<div class="middle layout vertical">  
  <ui-section header="Basics" expand>
      <ui-prop>
          <ui-label>input gltf</ui-label>
          <ui-input id='-i' placeholder="(必填)输入的GLTF文件路径..."></ui-input>
      </ui-prop>
      
      <ui-prop>
          <ui-label>output gltf</ui-label>
          <ui-input id='-o' placeholder="(必填)输出的GLTF文件路径..."></ui-input>
      </ui-prop>

      <ui-prop  type="string">
        <ui-label>compress level</ui-label>
        <ui-select id="-c" value="0">
          <option value="0">NONE</option>
          <option value="1">NORMAL</option>
          <option value="2">HIGHER</option>
        </ui-select>
      </ui-prop>

  </ui-section>
  <br>
  
  <ui-section header="Textures">
      <ui-prop>
        <ui-label>embed all textures into main buffer (.bin or .glb)</ui-label>
        <ui-checkbox id='-te'></ui-checkbox>
      </ui-prop>

      <ui-prop>
          <ui-label>convert all textures to Basis Universal format (with basisu executable); will be removed in the future</ui-label>
          <ui-checkbox id='-tb'></ui-checkbox>
      </ui-prop>

      <ui-prop>
        <ui-label>convert all textures to KTX2 with BasisU supercompression (using basisu executable)</ui-label>
        <ui-checkbox id='-tc'></ui-checkbox>
      </ui-prop>

      <ui-prop>
        <ui-label>set texture encoding quality</ui-label>
        <ui-slider id='-tq' value="50" min="1" max="100"></ui-slider>
      </ui-prop>

      <ui-prop>
        <ui-label>use UASTC when encoding textures (much higher quality and much larger size)</ui-label>
        <ui-checkbox id='-tu'></ui-checkbox>
      </ui-prop>
  </ui-section>
  <br>

  <ui-section header="Simplification">
      <ui-prop>
        <ui-label>simplify meshes to achieve the ratio R</ui-label>
        <ui-slider id='-si' value="1" min="0" max="1"></ui-slider>
      </ui-prop>

      <ui-prop>
        <ui-label>aggressively simplify to the target ratio disregarding quality</ui-label>
        <ui-checkbox id='-sa'></ui-checkbox>
      </ui-prop>
  </ui-section>
  <br>

  <ui-section header="Vertices">
      <ui-prop>
        <ui-label>use N-bit quantization for positions</ui-label>
        <ui-slider id='-vp' value="14" min="1" max="16"></ui-slider>
      </ui-prop>

      <ui-prop name="-vt" type="string">
        <ui-label>use N-bit quantization for texture corodinates</ui-label>
        <ui-slider id='-vt' value="12" min="1" max="16"></ui-slider>
      </ui-prop>

      <ui-prop name="-vn" type="string">
        <ui-label>use N-bit quantization for normals and tangents</ui-label>
        <ui-slider id='-vn' value="8" min="1" max="16"></ui-slider>
      </ui-prop>
  </ui-section>
  <br>

  <ui-section header="Animation">
      <ui-prop>
        <ui-label>use N-bit quantization for translations</ui-label>
        <ui-slider id='-at' value="16" min="1" max="24"></ui-slider>
      </ui-prop>

      <ui-prop>
        <ui-label>use N-bit quantization for rotations</ui-label>
        <ui-slider id='-ar' value="12" min="4" max="16"></ui-slider>
      </ui-prop>

      <ui-prop>
        <ui-label>use N-bit quantization for scale</ui-label>
        <ui-slider id='-as' value="16" min="1" max="24"></ui-slider>
      </ui-prop>

      <ui-prop>
        <ui-label>resample animations at N Hz</ui-label>
        <ui-slider id='-af' value="30" min="1" max="144"></ui-slider>
      </ui-prop>

      <ui-prop>
        <ui-label>keep constant animation tracks even if they don't modify the node transform</ui-label>
        <ui-checkbox id='-ac'></ui-checkbox>        
      </ui-prop>
  </ui-section>
  <br>

  <ui-section header="Scene">
      <ui-prop>
        <ui-label>keep named nodes and meshes attached to named nodes so that named nodes can be transformed externally</ui-label>
        <ui-checkbox id='-kn'></ui-checkbox>
      </ui-prop>
      
      <ui-prop>
        <ui-label>keep extras data</ui-label>
        <ui-checkbox id='-ke'></ui-checkbox>
      </ui-prop>
  </ui-section>
  <br>

  <ui-section header="Miscellaneous">
      <ui-prop>
        <ui-label>produce compressed gltf/glb files with fallback for loaders that don't support compression</ui-label>
        <ui-checkbox id='-cf'></ui-checkbox>
      </ui-prop>

      <ui-prop>
        <ui-label>disable quantization; produces much larger glTF files with no extensions</ui-label>
        <ui-checkbox id='-noq' checked></ui-checkbox>
      </ui-prop>

      <ui-prop>
        <ui-label>verbose output (print version when used without other options)</ui-label>
        <ui-checkbox id='-v' checked></ui-checkbox>
      </ui-prop>

      <ui-prop>
        <ui-label>display this help and exit</ui-label>
        <ui-checkbox id='-h'></ui-checkbox>
      </ui-prop>
  </ui-section>
</div>

<div class="bottom layout horizontal end-justified">
  <ui-button id="exec">执行</ui-button>
</div>
`;

// 节点选择器，this.$.title 指向 .title 元素
exports.$ = {
  //basics
  _i: '#-i',
  _o: '#-o',
  _c: '#-c',
  //textures
  _te: '#-te',
  _tb: '#-tb',
  _tc: '#-tc',
  _tq: '#-tq',
  _tu: '#-tu',
  //simplification
  _si: '#-si',
  _sa: '#-sa',
  //vertices
  _vp: '#-vp',
  _vt: '#-vt',
  _vn: '#-vn',
  //animations
  _at: '#-at',
  _ar: '#-ar',
  _as: '#-as',
  _af: '#-af',
  _ac: '#-ac',
  //scene
  _kn: '#-kn',
  _ke: '#-ke',
  //miscellaneous
  _cf: '#-cf',
  _noq: '#-noq',
  _v: '#-v',
  _h: '#-h',

  exec: '#exec',
};

// 监听发向面板的所有 html、自定义事件
exports.listeners = {
  resize () {
    // 自定义事件，面板大小变化的时候触发的事件
  },
};

// 消息监听
exports.messages = {
};

var isRunning = false;

// 面板显示完成后触发
exports.ready = function () {
  const that = this;
  this.$.exec.addEventListener('confirm', () => {
    if (isRunning) return console.warn("mesh optimizer is running.");
    isRunning = true;
    // var cmd = 'npx gltfpack'; //npx
    var cmd = 'node ' + join(__dirname, '/node_modules/gltfpack/bin/gltfpack.js'); //node
    //basics
    if (that.$._i.value == '') {
      isRunning = false;
      console.error('please enter the path to the input gltf file.');
      return;
    }
    if (that.$._o.value == '') {
      isRunning = false;
      console.error('please enter the path to the output gltf file.');
      return;
    }
    cmd += ' -i ' + that.$._i.value;
    cmd += ' -o ' + that.$._o.value;
    var _cVlaue = that.$._c.value;
    var _cCmd = '';
    if (_cVlaue == '1') { _cCmd = ' -c' } else if (_cVlaue == '2') { _cCmd = ' -cc' }
    cmd += _cCmd;
    //textures
    if (that.$._te.value) cmd += ' -te';
    if (that.$._tb.value) cmd += ' -tb';
    if (that.$._tc.value) cmd += ' -tc';
    if (that.$._tq.value != 50) cmd += (' -tq ' + that.$._tq.value);
    if (that.$._tu.value) cmd += ' -tu';
    //simplification
    if (that.$._si.value != 1) cmd += (' -si ' + that.$._si.value);
    if (that.$._sa.value) cmd += ' -sa';
    //vertices
    if (that.$._vp.value != 14) cmd += (' -vp ' + that.$._vp.value);
    if (that.$._vt.value != 12) cmd += (' -vt ' + that.$._vt.value);
    if (that.$._vn.value != 8) cmd += (' -vn ' + that.$._vn.value);
    //animation
    if (that.$._at.value != 16) cmd += (' -at ' + that.$._at.value);
    if (that.$._ar.value != 12) cmd += (' -ar ' + that.$._ar.value);
    if (that.$._as.value != 16) cmd += (' -as ' + that.$._as.value);
    if (that.$._af.value != 30) cmd += (' -af ' + that.$._af.value);
    if (that.$._ac.value) cmd += ' -ac';
    //scene
    if (that.$._kn.value) cmd += ' -kn';
    if (that.$._ke.value) cmd += ' -ke';
    //miscellaneous
    if (that.$._cf.value) cmd += ' -cf';
    if (that.$._noq.value) cmd += ' -noq';
    if (that.$._v.value) cmd += ' -v';
    if (that.$._h.value) cmd += ' -h';

    console.log(cmd);
    exec(cmd, (error, stdout, stderr) => {
      isRunning = false;
      var hasError = false;
      if (error) { hasError = true; console.error(`${error}`); }
      if (stderr) { hasError = true; console.error(`${stderr}`); }
      if (stdout) { console.log(`${stdout}`); }
      const message = 'mesh optimizer finished working' + (hasError ? ', but errors occurred.' : '.');
      console.log(message);
    });
  });
};

// 面板关闭的时候会触发，如果 return false，会中断关闭流程
exports.beforeClose = function () {
  if (isRunning) {
    console.warn("please try close the window later, the mesh optimizer is running.");
    return false;
  }
};

// 面板确定要关闭后，会触发这个函数，在这里需要保存面板需要存储的数据
exports.close = function () { };

//3D Engine, graph and camera
function graph(id, cwidth, cheight, wnd) {
    this.canvas = null;
    this.container = null;
    this.color = '#000000';
    this.strokewidth = 1;

    this.setcolor = function(color) {
        window.ctx.fillStyle = color;
        window.ctx.strokeStyle = color;
    }
    this.setstrokewidth = new Function('arg', 'this.strokewidth=arg.toLowerCase();this.desc+="setstrokewidth|"+arg.toLowerCase()+"\\n";');

    this.init = function() {
        this.container = document.getElementById(id);
        window.cnv = document.createElement('canvas');
        this.container.appendChild(cnv);
        cnv.height = innerHeight;
        cnv.width = innerWidth;
        cnv.style.position = 'absolute';
        cnv.style.top = '0px';
        cnv.style.left = '0px';
        window.ctx = cnv.getContext('2d');
    }

    this.line = function(x1, y1, x2, y2) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    }

    this.text = function(x, y, text, font, size) {
		ctx.font = size.toString()+'px';
        ctx.fillText(text, x, y);
    }

    this.polyline = function(xpoints, ypoints) {
        for (i = 0; i < xpoints.length; i++) {
            if (i != 0) {
                ctx.lineTo(xpoints[i], ypoints[i]);
            } else {
                ctx.moveTo(xpoints[i], ypoints[i]);
            }
        }
    }

    this.polyfill = function(xpoints, ypoints) {
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        for (i = 0; i < xpoints.length; i++) {
            if (i != 0) {
                ctx.lineTo(xpoints[i], ypoints[i]);
            } else {
                ctx.moveTo(xpoints[i], ypoints[i]);
            }
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
    }

    this.clear = function() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = '#000000';
    }
}

function camera() {
    this.pa = null;
    this.pb = null;
    this.pc = null;
    this.pd = null;
    this.po = null;
    this.hx = null;
    this.hy = null;
    this.hz = null;
    this.hp = null;
    this.cxx = null;
    this.cxy = null;
    this.cxz = null;
    this.cyx = null;
    this.cyy = null;
    this.cyz = null;

    this.setcameralocation = function(abcdv) {
        let pa = abcdv[0];
        let pb = abcdv[1];
        let pc = abcdv[2];
        let pd = abcdv[3];
        this.pa = pa;
        this.pb = pb;
        this.pc = pc;
        this.pd = pd;

        this.hx = pa / Math.sqrt(pa * pa + pb * pb + pc * pc);
        this.hy = pb / Math.sqrt(pa * pa + pb * pb + pc * pc);
        this.hz = pc / Math.sqrt(pa * pa + pb * pb + pc * pc);
        this.hp = pd / Math.sqrt(pa * pa + pb * pb + pc * pc);
    }

    this.setcameraorientation = function(v) {

        let icyx = -v[0];
        let icyy = -v[1];
        let icyz = -v[2];

        this.cxx = icyy * this.hz - icyz * this.hy;
        this.cxy = icyz * this.hx - icyx * this.hz;
        this.cxz = icyx * this.hy - icyy * this.hx;

        let cxn = Math.sqrt(this.cxx * this.cxx + this.cxy * this.cxy + this.cxz * this.cxz);
        this.cxx = this.cxx / cxn;
        this.cxy = this.cxy / cxn;
        this.cxz = this.cxz / cxn;
        this.cyx = this.cxy * this.hz - this.cxz * this.hy;
        this.cyy = this.cxz * this.hx - this.cxx * this.hz;
        this.cyz = this.cxx * this.hy - this.cxy * this.hx;

        this.po = this.getsmack(new Array(0, 0, 0));
    }

    this.getcameraorientation = function() {
        return new Array(this.cyx, this.cyy, this.cyz);
    }

    this.getcameraorientationorth = function() {
        return new Array(this.cxx, this.cxy, this.cxz);
    }

    this.getcameralocation = function() {
        return new Array(this.hx, this.hy, this.hz, this.hp);
    }

    this.getsmack = function(qv) {
        let u = (this.pa * qv[0] + this.pb * qv[1] + this.pc * qv[2] + this.pd) / (this.pa * this.hx + this.pb * this.hy + this.pc * this.hz);
        let ix = qv[0] - u * this.hx;
        let iy = qv[1] - u * this.hy;
        let iz = qv[2] - u * this.hz;
        return new Array(ix, iy, iz);
    }

    this.getprojection = function(qv) {
        let u = (this.pa * qv[0] + this.pb * qv[1] + this.pc * qv[2] + this.pd) / (this.pa * this.hx + this.pb * this.hy + this.pc * this.hz);
        let ix = qv[0] - u * this.hx - this.po[0];
        let iy = qv[1] - u * this.hy - this.po[1];
        let iz = qv[2] - u * this.hz - this.po[2];
        let projx = -(ix * this.cxx + iy * this.cxy + iz * this.cxz);
        let projy = ix * this.cyx + iy * this.cyy + iz * this.cyz;
        return new Array(projx, projy);
    }
}
//END 3D Engine

//Mathematical parser
let fsys=/^(sin|cos|tan|asin|acos|atan|abs|floor|ceil|exp|sqrt)$/i;
let fmy=/^(sec|csc|cot|sech|csch|coth|sinh|cosh|tanh|asinh|acosh|atanh|asec|acsc|acot|asech|acsch|acoth|ln|log|u)$/i;

function sec(x) { return 1/Math.cos(x); }
function csc(x) { return 1/Math.sin(x); }
function cot(x) { return 1/Math.tan(x); }
function asec(x) { return Math.acos(1/x); }
function acsc(x) { return Math.asin(1/x); }
function acot(x) { return Math.atan(1/x); }
function ln(x) { return Math.log(x); }
function log(x) { return Math.log(x)/Math.log(10); }
function sinh(x) { return (Math.exp(x)-Math.exp(-x))/2; }
function cosh(x) { return (Math.exp(x)+Math.exp(-x))/2; }
function tanh(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)); }
function asinh(x) { return Math.log(x+Math.sqrt(x*x+1)); }
function acosh(x) { return Math.log(x+Math.sqrt(x*x-1)); }
function atanh(x) { return 0.5*Math.log((1+x)/(1-x)); }
function sech(x) { return 2/(Math.exp(x)+Math.exp(-x)); }
function csch(x) { return 2/(Math.exp(x)-Math.exp(-x)); }
function coth(x) { return (Math.exp(x)+Math.exp(-x))/(Math.exp(x)-Math.exp(-x)); }
function asech(x) { return Math.log(1/x+Math.sqrt(1/x/x-1)); }
function acsch(x) { return Math.log(1/x+Math.sqrt(1/x/x+1)); }
function acoth(x) { return 0.5*Math.log((1+x)/(1-x)); }
function u(x) { return (x>=0); }

function haselement(v,e) {for(let i=0;i<v.length;i++) if(v[i]==e) return true;return false;}

function fixpowers(v) {
  if(v==null) { return null; }
  for(i=0;i<v.length;i++) {
    if(Array.isArray(v[i])) { v[i]=fixpowers(v[i]); if(v[i]==null) { return null; } }
  }
  for(var i=0;i<v.length;i++) {
    if(v[i]=='^') {
      if(v[i-1]==null||v[i+1]==null) { return null; }
      v.splice(i-1,3,new Array('Math.pow',new Array('(',v[i-1],',',v[i+1],')')));
      i-=2;
    }
  }
  return v;
}
function fixfunctions(v) {
  if(v==null) { return null;}
  for(i=0;i<v.length;i++) {
    if(Array.isArray(v[i])) {
      v[i]=fixfunctions(v[i]);
      if(v[i]==null) {return null;} 
    }
  }
  for(var i=0;i<v.length;i++) {
    if(!Array.isArray(v[i])) {
      if(v[i].match(fsys)) {
        if(v[i+1]==null) {return null;}
        v[i]='Math.'+v[i].toLowerCase();
        v.splice(i,2,new Array('(',v[i],v[i+1],')'));
        i--;
      } else if(!(v[i]==null) && v[i].match(fmy)) {
        if(v[i+1]==null) {return null;}
        v[i]=v[i].toLowerCase();
        v.splice(i,2,new Array('(',v[i],v[i+1],')'));
        i--;
      }
    }
  }
  return v;
}

function js(eq,vars) {
  let tokens;
  let e,i;
  let pstart=-1,pend;
  if(vars==""||vars==null) vars="x";
  if(vars=="-") vars="__NONE__";
  e=eq.replace(/ /g,"");
  e=e.replace(/([0-9])([a-df-z]|[a-z][a-z]|\()/ig,"$1*$2");
  e=e.replace(/(\))([0-9a-df-z]|[a-z][a-z]|\()/ig,"$1*$2");
  e=e.replace(/([a-z0-9\.])([^a-z0-9\.])/ig,"$1 $2");
  e=e.replace(/([^a-z0-9\.])([a-z0-9\.])/ig,"$1 $2");
  e=e.replace(/(\-|\)|\()/g," $1 ");
  tokens=e.split(/ +/);
  for(i=0;i<tokens.length;i++) {
    tokens[i]=tokens[i].replace(/ /g,"");
    tokens[i]=tokens[i].replace(/_/g,".");
    if(tokens[i]=='') { tokens.splice(i,1);i--; }
    else if(tokens[i]=='pi') { tokens[i]='3.14159265358979'; }
    else if(tokens[i]=='e') { tokens[i]='2.718281828459045'; }
    else if(tokens[i].length>0 && tokens[i].match(/^[a-z][a-z0-9]*$/i) && !tokens[i].match(new RegExp("^"+vars+"$","i")) && !tokens[i].match(fsys) && !tokens[i].match(fmy)) { return null; }
  }
  while(haselement(tokens,'(')||haselement(tokens,')')) {
    pstart=-1;
    for(i=0;i<tokens.length;i++) {
      if(tokens[i]=='(') pstart=i;
      if(tokens[i]==')'&&pstart==-1) { return null; }
      if(tokens[i]==')'&&pstart!=-1) {
        tokens.splice(pstart,i-pstart+1,tokens.slice(pstart,i+1));
        i=-1;
        pstart=-1;
      }
    }
    if(pstart!=-1) { return null; }
  }
  tokens=fixfunctions(tokens);
  tokens=fixpowers(tokens);
  if(tokens==null) { return null; }
  return joinarray(tokens);
}


function joinarray(v) {var t="";for(var i=0;i<v.length;i++){if(Array.isArray(v[i])){ t+=joinarray(v[i]);}else{t+=v[i];}}return t;}


//END Mathematical parser



function id(e){return document.getElementById(e)}
function cl(e){return document.getElementsByClassName(e)}

function mkscr() {
    id('screenshot').href = document.getElementsByTagName('canvas')[0].toDataURL();
    id('screenshot').click();
}


function setwindow(nxmin, nxmax, nymin, nymax) {
    a.xmin = parseFloat(nxmin);
    a.ymin = parseFloat(nymin);
    a.xmax = parseFloat(nxmax);
    a.ymax = parseFloat(nymax);
}



function movehandler(e) {
    let mx = e.pageX;
    let my = e.pageY;
    let dx = mx - dragx;
    let dy = my - dragy;
    if (dragging) {
        loc[0] = oloc[0] + dy * oori[0] / 200 + dx * oorio[0] / 200;
        loc[1] = oloc[1] + dy * oori[1] / 200 + dx * oorio[1] / 200;
        loc[2] = oloc[2] + dy * oori[2] / 200 + dx * oorio[2] / 200;
        loc[3] = -10;
        cam.setcameralocation(loc);
        cam.setcameraorientation(oori);

        setTimeout(redraw(), 30);

        return false;
    }
}

function movehandlertouch(e) {
    if (event.targetTouches.length == 2) {
        dx = event.targetTouches[0].pageX - event.targetTouches[1].pageX;
        dy = event.targetTouches[0].pageY - event.targetTouches[1].pageY;
        d = Math.sqrt(dx * dx + dy * dy);
        zoom(d / d0);

        d0 = d;

    } else {
        let mx = e.targetTouches[0].pageX;
        let my = e.targetTouches[0].pageY;
        let dx = mx - dragx;
        let dy = my - dragy;
        if (dragging) {
            loc[0] = oloc[0] + dy * oori[0] / 200 + dx * oorio[0] / 200;
            loc[1] = oloc[1] + dy * oori[1] / 200 + dx * oorio[1] / 200;
            loc[2] = oloc[2] + dy * oori[2] / 200 + dx * oorio[2] / 200;
            loc[3] = -10;
            cam.setcameralocation(loc);
            cam.setcameraorientation(oori);

            setTimeout(redraw(), 150);

            return false;
        }
    }
}

function draghandler(e) {
    let fobj = e.target;
    while (fobj != document.body && fobj != document) {
        fobj = fobj.parentNode;
        if (fobj == document.getElementById('graph')) {
            dragging = true;
        }
    }
    if (dragging) {
        dobj = fobj;
        dragx = e.pageX;
        dragy = e.pageY;
        oxmin = a.xmin;
        oxmax = a.xmax;
        oymin = a.ymin;
        oymax = a.ymax;
        oloc = cam.getcameralocation();
        oori = cam.getcameraorientation();
        oorio = cam.getcameraorientationorth();
        id('graph').onmousemove = movehandler;
        id('graph').ontouchmove = movehandlertouch;
        return false;
    }
}

function draghandlertouch(e) {
    if (event.targetTouches.length >= 2) {
        dx = event.targetTouches[0].pageX - event.targetTouches[1].pageX;
        dy = event.targetTouches[0].pageY - event.targetTouches[1].pageY;
        d0 = Math.sqrt(dx * dx + dy * dy);
    }
    let fobj = e.target;
    while (fobj != document.body && fobj != document) {
        fobj = fobj.parentNode;
        if (fobj == document.getElementById('graph')) {
            dragging = true;
        }
    }
    if (dragging) {
        dobj = fobj;
        dragx = e.targetTouches[0].pageX;
        dragy = e.targetTouches[0].pageY;
        oxmin = a.xmin;
        oxmax = a.xmax;
        oymin = a.ymin;
        oymax = a.ymax;
        oloc = cam.getcameralocation();
        oori = cam.getcameraorientation();
        oorio = cam.getcameraorientationorth();
        //g.clear();
        //render();
        //draw();
        redraw();
        id('graph').ontouchmove = movehandlertouch;
        return false;
    }
}

function uphandler(e) {
    let ex = e.pageX;
    let ey = e.pageY;
    if (dragging) {
        dragging = false;
        setTimeout(redraw(), 10);
    }
}

function uphandlertouch(e) {
    let ex = e.targetTouches[0].pageX;
    let ey = e.targetTouches[0].pageY;
    if (dragging) {
        dragging = false;
        setTimeout(redraw(), 10);
    }
}

function mousewheel(e) {
    let delta = 0;
    if (e.wheelDelta) { // IE/Opera. 
        delta = e.wheelDelta / 120;
    } else {
        if (e.detail) { // Mozilla case. 
            delta = -e.detail / 3;
        }
    }
    if (delta > 0) {
        zoom(1.1);
    } else {
        if (delta < 0) {
            zoom(0.9);
        } else {
            if (delta) {
                zoom(1);
            }
        }
    }
}

function redraw() {
    if (MODE == 'grapher') {
        g.clear();
        draw3daxes();
        do3d(0);
        return;
    }
    if (MODE == 'examples') {
        g.clear();
        render();
        draw();
        return;
    }
    remake();
    g.clear();
    render();
    draw();
}

function remake() {

    inp_points = cl('point');
    inp_lines = cl('line');
    inpn = cl('n'); //Name of point
    inpx = cl('x');
    inpy = cl('y');
    inpz = cl('z');
    inpfrom = cl('from');
    inpto = cl('to');
    func = 'window.render=function(){ctx.fillStyle=\'#000000\';';
    for (i = 0; i < inp_points.length; i++) {
        func += inpn[i].value + '=getscreencoords(cam.getprojection(new Array(' + inpx[i].value + ',' + inpy[i].value + ',' + inpz[i].value + ')));';
        func += 'smallpoint(' + inpn[i].value + ');';
        func += 'text(' + inpn[i].value + ',\'' + inpn[i].value + '\');';
    }
    for (i = 0; i < inp_lines.length; i++) {
        func += 'line(' + inpfrom[i].value + ',' + inpto[i].value + ');';
    }
    func += '}';
    eval(func);
}


function resetzoom() {
    cam.setcameralocation(new Array(1, 2, 1, -10));
    cam.setcameraorientation(new Array(0, 0, 1));
    g.clear();
    draw();
}

function draw() {
    ctx.font = '12pt Arial';
    ctx.beginPath();
    setwindow(a.xmin, a.xmax, a.ymin, a.ymax);
    render();
    ctx.stroke();
}

function zoom(x) {
    g.clear();
    dx = a.xmax - a.xmin;
    dy = a.ymax - a.ymin;
    a.xmin += dx * ((1 - 1 / x) / 2);
    a.xmax -= dx * ((1 - 1 / x) / 2);
    a.ymin += dy * ((1 - 1 / x) / 2);
    a.ymax -= dy * ((1 - 1 / x) / 2);

    draw();
}

function line(a, b) {
    g.line(a[0], a[1], b[0], b[1]);
}

function text(point, text) {
    g.text(point[0], point[1], text, 'Verdana', 15);
}



function point(coords) {
    ctx.stroke();
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(coords[0], coords[1], 5, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
}

function smallpoint(coords) {
    ctx.stroke();
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(coords[0], coords[1], 3, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
}

function prism3() {
    ctx.fillStyle = '#000000';

    let A = getscreencoords(cam.getprojection(new Array(-2, -2, -2)));
    let B = getscreencoords(cam.getprojection(new Array(0, 1.4, -2)));
    let C = getscreencoords(cam.getprojection(new Array(2, -2, -2)));

    let A1 = getscreencoords(cam.getprojection(new Array(-2, -2, 2)));
    let B1 = getscreencoords(cam.getprojection(new Array(0, 1.4, 2)));
    let C1 = getscreencoords(cam.getprojection(new Array(2, -2, 2)));

    line(A, B);
    line(B, C);
    line(C, A);

    line(A1, B1);
    line(B1, C1);
    line(C1, A1);

    line(A, A1);
    line(B, B1);
    line(C, C1);

    text(A, 'A');
    text(B, 'B');
    text(C, 'C');

    text(A1, 'A1');
    text(B1, 'B1');
    text(C1, 'C1');
}

function pyramide3() {
    ctx.fillStyle = '#000000';

    let A = getscreencoords(cam.getprojection(new Array(-2, -2, -2)));
    let B = getscreencoords(cam.getprojection(new Array(0, 1.4, -2)));
    let C = getscreencoords(cam.getprojection(new Array(2, -2, -2)));


    let P = getscreencoords(cam.getprojection(new Array(0, 0, 2)));

    line(A, B);
    line(B, C);
    line(C, A);

    line(P, A);
    line(P, B);
    line(P, C);

    text(A, 'A');
    text(B, 'B');
    text(C, 'C');

    text(P, 'P');
}

function pyramide4() {
    ctx.fillStyle = '#000000';

    let A = getscreencoords(cam.getprojection(new Array(-2, -2, -2)));
    let B = getscreencoords(cam.getprojection(new Array(-2, 2, -2)));
    let C = getscreencoords(cam.getprojection(new Array(2, 2, -2)));
    let D = getscreencoords(cam.getprojection(new Array(2, -2, -2)));


    let P = getscreencoords(cam.getprojection(new Array(0, 0, 2)));

    line(A, B);
    line(B, C);
    line(C, D);
    line(D, A);

    line(P, A);
    line(P, B);
    line(P, C);
    line(P, D);

    text(A, 'A');
    text(B, 'B');
    text(C, 'C');
    text(D, 'D');

    text(P, 'P');
}

function cube() {
    ctx.fillStyle = '#000000';

    let A = getscreencoords(cam.getprojection(new Array(-2, -2, -2)));
    let B = getscreencoords(cam.getprojection(new Array(-2, 2, -2)));
    let C = getscreencoords(cam.getprojection(new Array(2, 2, -2)));
    let D = getscreencoords(cam.getprojection(new Array(2, -2, -2)));

    let A1 = getscreencoords(cam.getprojection(new Array(-2, -2, 2)));
    let B1 = getscreencoords(cam.getprojection(new Array(-2, 2, 2)));
    let C1 = getscreencoords(cam.getprojection(new Array(2, 2, 2)));
    let D1 = getscreencoords(cam.getprojection(new Array(2, -2, 2)));

    smallpoint(A);
    smallpoint(B);
    smallpoint(C);
    smallpoint(D);
    smallpoint(A1);
    smallpoint(B1);
    smallpoint(C1);
    smallpoint(D1);
    line(A, B);
    line(B, C);
    line(C, D);
    line(D, A);

    line(A1, B1);
    line(B1, C1);
    line(C1, D1);
    line(D1, A1);

    line(A, A1);
    line(B, B1);
    line(C, C1);
    line(D, D1);

    text(A, 'A');
    text(B, 'B');
    text(C, 'C');
    text(D, 'D');

    text(A1, 'A1');
    text(B1, 'B1');
    text(C1, 'C1');
    text(D1, 'D1');
}

function getscreencoords(p) {
    sx = Math.floor((p[0] - a.xmin) / (a.xmax - a.xmin) * swidth);
    sy = Math.floor((1 - (p[1] - a.ymin) / (a.ymax - a.ymin)) * sheight);
    return new Array(sx, sy);
}



function removep(child) {
    div = document.getElementsByTagName('div');
    for (i = 0; i < div.length; i++) {
        if (div[i] === child.parentNode) {
            div[i].parentNode.removeChild(div[i]);
        }
    }
    redraw();
}


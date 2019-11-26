/* eslint-env browser */

'use strict';

var comb = {};

//////////////////////////////////////////////////////////////////////

comb.svg = {};

comb.math_font = 'MathJax_Math-italic';

comb.svg.node = function (t) {
 return document.createElementNS('http://www.w3.org/2000/svg', t);
};

comb.svg.group = function () {
 return this.node('g');
};

comb.svg.line = function (x1, y1, x2, y2, color, thickness) {
 var n = this.node('line');
 n.setAttribute('x1', x1);
 n.setAttribute('y1', y1);
 n.setAttribute('x2', x2);
 n.setAttribute('y2', y2);
 n.setAttribute('stroke', color);
 n.setAttribute('stroke-width', thickness);
 n.setAttribute('fill', 'none');
 return n;
};

comb.svg.hline = function (x1, x2, y, color, thickness) {
 return this.line(x1, y, x2, y, color, thickness);
};

comb.svg.vline = function (x, y1, y2, color, thickness) {
 return this.line(x, y1, x, y2, color, thickness);
};

comb.svg.rect = function(x0,y0,w,h,color,thickness) {
 var n = this.node('rect');
 n.setAttribute('x', x0);
 n.setAttribute('y', y0);
 n.setAttribute('width', w);
 n.setAttribute('height', h);
 n.setAttribute('stroke',color);
 n.setAttribute('stroke-width', thickness);
 n.setAttribute('fill', 'none');
 return n
};

comb.svg.frect = function(x0,y0,w,h,color) {
 var n = this.node('rect');
 n.setAttribute('x', x0);
 n.setAttribute('y', y0);
 n.setAttribute('width', w);
 n.setAttribute('height', h);
 n.setAttribute('stroke','none');
 n.setAttribute('fill', color);
 return n
};

comb.svg.lines = function(points,color,thickness) {
 var n,i,m,u,s,point_strings;
 n = this.node('path');
 n.setAttribute('stroke',color);
 n.setAttribute('stroke-width',thickness);
 n.setAttribute('fill','none');

 m = points.length;
 point_strings = [];
 for (i in points) {
  u = points[i];
  if (Array.isArray(u)) {
   point_strings.push('' + u[0] + ',' + u[1]);
  } else {
   point_strings.push('' + u.x + ',' + u.y);   
  }
 }

 s = 'M ' + point_strings[0] + ' L ';
 for (i = 1; i < m; i++) {
  s += point_strings[i] + ' ';
 }

 n.setAttribute('d',s);

 return n;
};

comb.svg.circle = function(x0,y0,r,color,thickness) {
 var n = this.node('circle');
 n.setAttribute('cx', x0);
 n.setAttribute('cy', y0);
 n.setAttribute('r', r);
 n.setAttribute('stroke', color);
 n.setAttribute('stroke-width',thickness);
 n.setAttribute('fill', 'none');
 return n
};

comb.svg.disc = function(x0,y0,r,color) {
 var n = this.node('circle');
 n.setAttribute('cx', x0);
 n.setAttribute('cy', y0);
 n.setAttribute('r', r);
 n.setAttribute('stroke','none');
 n.setAttribute('fill', color);
 return n
};

comb.svg.text = function(s,x,y) {
 var n = this.node('text');
 n.setAttribute('text-anchor','middle');
 n.setAttribute('alignment-baseline','middle');
 n.setAttribute('font-size','24px');
 n.setAttribute('fill','black');
 n.setAttribute('x', x);
 n.setAttribute('y', y);
 n.textContent = s;
 return n; 
};

comb.svg.math_text = function(s,x,y) {
 var n = this.node('text');
 n.setAttribute('text-anchor','middle');
 n.setAttribute('alignment-baseline','middle');
 n.setAttribute('font-size','24px');
 n.setAttribute('font-family',comb.math_font);
 n.setAttribute('fill','black');
 n.setAttribute('x', x);
 n.setAttribute('y', y);
 n.textContent = s;
 return n; 
};

comb.svg.append_tspan = function(t,s) {
 var u = this.node('tspan');
 u.textContent = s;
 t.appendChild(u);
 return u;
}

comb.svg.grid = function (rows, cols, x0, y0, w, h) {
 var g, i, j, x1, y1;

 x1 = x0 + cols * w;
 y1 = y0 + rows * h;

 g = this.group();

 for (i = 0; i <= rows; i++) {
  g.appendChild(this.hline(x0, x1, y0 + i * h, 'grey', 1));
 }

 for (j = 0; j <= cols; j++) {
  g.appendChild(this.vline(x0 + j * w, y0, y1, 'grey', 1));
 } 

 return g;
};

comb.svg.shaded_grid = function(rows, cols, x0, y0, w, h, blocks) {
 var g,i,j,k;

 g = this.grid(rows, cols, x0, y0, w, h);
 for (k in blocks) {
  i = blocks[k][0];
  j = blocks[k][1];
  g.appendChild(this.frect(x0 + (i-1) * w, y0 + (j-1) * h, w, h, 'grey'));
 }

 return g;
};

comb.svg.rook = function(x,y,w) {
 var g,dd,i,p,t;
 
 g = this.group();

 g.setAttribute('opacity','1');
 g.setAttribute('fill','#ffffff');
 g.setAttribute('fill-opacity','1');
 g.setAttribute('fill-rule','evenodd');
 g.setAttribute('stroke','#000000');
 g.setAttribute('stroke-width','1.5');
 g.setAttribute('stroke-linecap','round');
 g.setAttribute('stroke-linejoin','round');
 g.setAttribute('stroke-miterlimit','4');
 g.setAttribute('stroke-dasharray','none');
 g.setAttribute('stroke-opacity','1');

 dd = [
  "M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z ",
  "M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z ",
  "M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14",
  "M 34,14 L 31,17 L 14,17 L 11,14",
  "M 31,17 L 31,29.5 L 14,29.5 L 14,17",
  "M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5",
  "M 11,14 L 34,14",
 ];

 for (i in dd) {
  p = this.node('path');
  p.setAttribute('d',dd[i]);
  g.appendChild(p);
 }
 
 t = 'translate(' + x + ',' + y + ') ' + 
     'scale(' + (0.02 * w) + ') ' + 
     'translate(-22,-25)';
 
 g.setAttribute('transform',t);
 
 return g;
}

comb.svg.arrow_marker = function() {
 var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
 marker.setAttribute('id', 'head_b');
 marker.setAttribute('orient','auto');
 marker.setAttribute('markerUnits','strokeWidth');
 marker.setAttribute('markerWidth',10);
 marker.setAttribute('markerHeight',10);
 marker.setAttribute('refX',1);
 marker.setAttribute('refY',5);
 marker.setAttribute('viewBox','0 0 10 10');
 
 var path = document.createElementNS('http;//www.w3.org/2000/svg', 'path');
 marker.appendChild(path);
 path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
 path.setAttribute('fill','#000000');
 
 return marker;
}

comb.svg.arrow_defs = function() {
 var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
 defs.appendChild(this.arrow_marker());

 return defs;
}


//////////////////////////////////////////////////////////////////////

comb.demo = {};

comb.demo.find_ids = function(ids) {
 var i,id,ids0,x;
 
 ids0 = ids.concat(['main_div','main_svg','msg_div','youtube_button']);

 for (i in ids0) {
  id = ids0[i];

  x = document.getElementById(id);
  if (id && x) { this[id] = x; } 
 }

 this.activate_youtube_button();
}

comb.demo.activate_youtube_button = function() {
 if (! this.name) { return; }

 var key = youtube_keys[this.name];

 if (! key) { return; }

 var x = document.getElementById('youtube_button');
 if (! x) { return; }

 var me = this;

 x.onclick = function() { window.open('https://youtu.be/' + key); };
}

comb.demo.get_offset = function( el ) {
 var _x = 0;
 var _y = 0;
 while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
  _x += el.offsetLeft - el.scrollLeft;
  _y += el.offsetTop - el.scrollTop;
  el = el.offsetParent;
 }
 return { top: _y, left: _x };
}

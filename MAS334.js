/* eslint-env browser */
/* global comb */

'use strict';

var irange = function (x) {
 var n, R, i;

 n = parseInt(x);
 R = [];
 for (i = 1; i <= n; i++) { R.push(i); }
 return R;
};

//////////////////////////////////////////////////////////////////////

var dp = function (u, v) {
 var n, m, i, x;
 
 n = u.length;
 m = v.length;
 if (n !== m) { throw 'length mismatch'; }

 x = 0;
 for (i = 0; i < n; i++) { x += u[i] * v[i]; }
 return x;
};

//////////////////////////////////////////////////////////////////////

var random_element_of = function (A) {
 if (Array.isArray(A)) {
  return A[Math.floor(Math.random() * A.length)];
 } else {
  return Math.ceil(Math.random() * parseInt(A));
 }
};

//////////////////////////////////////////////////////////////////////

var random_subset_of = function(A_,size_) {
 var A,n,V,T,i,j,k,size;
 
 if (Array.isArray(A_)) {
  A = A_;
  n = A.length;
 } else {
  n = parseInt(A_);
  A = irange(n);
 }

 if (size_ === null) {
  V = [];
  for (i in A) {
   if (Math.random() >= 0.5) { V.push(A[i]); }
  }
  return V;
 } else {
  size = parseInt(size_);
  if (size > n) { return null; }
  T = {};
  for (i = 0; i < n; i++) { T[i] = 0; }
  V = [];
  for (i = 0; i < size; i++) {
   j = Math.floor(Math.random() * (n - i));
   k = 0;
   while(j) {
    k++;
    while(T[k]) { k++; }
    j--;
   }
   V.push(A[k]);
   T[k] = 1;
  }
  return V;
 }
};

//////////////////////////////////////////////////////////////////////

var permutations = function(n) {
 var P,Q,i,j,u,v;
 
 if (n <= 0) {
  return [[]];
 } else {
  P = permutations(n-1);
  Q = [];
  for (i in P) {
   for (j = n-1; j >= 0; j--) {
    u = P[i];
    v = u.slice(0,j);
    v.push(n);
    v = v.concat(u.slice(j,n-1));
    Q.push(v);
   }
  }
 }
 return Q;
}

//////////////////////////////////////////////////////////////////////

var derangements = function(n) {
 var P,D,i,j,p,is_derangement;
 
 P = permutations(n);
 D = [];
 for (i in P) {
  p = P[i];
  is_derangement = 1;
  for (j = 1; j <= n; j++) {
   if (p[j-1] == j) {
    is_derangement = 0;
    break;
   }
  }
  if (is_derangement) {
   D.push(p);
  }
 }
 
 return D;
}

//////////////////////////////////////////////////////////////////////

var rook_tree = function (A,B,E) {
 var T,i,a,b,e,A1,B1,E1,T1;
 
 T = [];
 if (E.length == 0) {
  return [];
 }
 
 for (i in E) {
  e = E[i];
  a = e[0];
  b = e[1];
  A1 = A.filter(a1 => (a1 > a));
  B1 = B.filter(b1 => (b1 != b));
  E1 = E.filter(e => ((e[0] > a) && (e[1] != b)));
  T1 = rook_tree(A1,B1,E1);
  T.push([e].concat(T1));
 }
 
 return T;
};

//////////////////////////////////////////////////////////////////////

var rook_list_from_tree = function(T) {
 var i,j,L,M,x,a,m;
 
 L = [[]];
 
 for (i in T) {
  x = T[i];
  a = x[0];
  if (x.length == 1) {
   L.push([a]);
  } else {
   M = rook_list_from_tree(x.slice(1));
   for (j in M) {
    m = M[j];
    L.push([a].concat(m));
   }
  }
 }
 return L;
};

//////////////////////////////////////////////////////////////////////

var matching_problem = {
 grid_x0 : 0,
 grid_y0 : 0,
 grid_w : 50,
 grid_h : 50,
 grid_stroke : 'grey',
 grid_fill : 'grey'
};

//////////////////////////////////////////////////////////////////////

matching_problem.setup = function(A_,B_,E) {
 var i,j,k,a,b,ab,A,nA,iA,A1,B,nB,iB,B1,AB,ET,EI,ETI,EC,ECI,BL,BR,P;
     
 if (Array.isArray(A_)) {
  nA = A_.length;
  A = A_;
 } else {
  nA = parseInt(A_);
  A = irange(nA);
 }

 A1 = {};
 iA = {};
 for (i = 0; i < nA; i++) {
  A1[i+1] = A[i];
  iA[A[i]] = i+1;
 }
 
 if (Array.isArray(B_)) {
  nB = B_.length;
  B = B_;
 } else {
  nB = parseInt(B_);
  B = irange(nB);
 }

 B1 = {};
 iB = {};
 for (i = 0; i < nB; i++) {
  B1[i+1] = B[i];
  iB[B[i]] = i+1;
 }
 
 AB = [];
 for (i in A) {
  for (j in B) {
   AB.push([A[i],B[j]]);
  }
 }

 ET = {};
 ETI = {};
 
 for (i = 1; i <= nA; i++) {
  a = A1[i];
  ET[a] = {};
  ETI[i] = {};
  for (j = 1; j <= nB; j++) {
   b = B1[j];
   ET[a][b] = 0;
   ETI[i][j] = 0;
  }
 }

 EI = [];
 
 for (k in E) {
  ab = E[k];
  a = ab[0];
  b = ab[1];
  i = iA[a];
  j = iB[b];
  ET[a][b] = 1;
  ETI[i][j] = 1;
  EI.push([i,j]);
 }

 EC = [];
 ECI = [];

 for (i = 1; i <= nA; i++) {
  a = A1[i];
  for (j = 1; j <= nB; j++) {
   b = B1[j];
   if (! ETI[i][j]) {
    EC.push([a,b]);
    ECI.push([i,j]);
   }
  }
 }
 
 BL = {};
 BR = {};
 for (i in A) { BL[A[i]] = []; }
 for (i in B) { BR[B[i]] = []; }

 for (i in E) {
  a = E[i][0];
  b = E[i][1];
  BL[a].push(b);
  BR[b].push(a);
 }
 
 P = Object.create(this);
 
 P.left_set = A;
 P.shifted_left_set = A1;
 P.left_order = nA;
 P.left_index = iA;
 P.right_set = B;
 P.shifted_right_set = B1;
 P.right_order = nB;
 P.right_index = iB;
 P.product_set = AB;
 P.relation = E;
 P.complement = EC;
 P.relation_table = ET;
 P.indexed_relation = EI;
 P.indexed_complement = ECI;
 P.indexed_relation_table = ETI;
 P.matrix = ETI;
 P.block = BL;
 P.coblock = BR;
 P.max_rooks = (nA <= nB) ? nA : nB;
 P.num_rooks = 0;
 
 P.cell = {};
 P.indexed_cell = {};
 
 P.is_filled = {};
 P.is_blocked = {};
 P.is_row_blocked = {};
 P.is_col_blocked = {};
 
 for (i in A) {
  a = A[i];
  P.cell[a] = {};
  P.indexed_cell[i] = {};
  P.is_filled[a] = {};
  P.is_blocked[a] = {};
  P.is_row_blocked[a] = {};
  P.is_col_blocked[a] = {};
  for (j in B) {
   b = B[j];
   P.cell[a][b] = {
    i : i, j : j, a : a, b : b,
    is_free : ET[a][b],
    is_filled : 0,
    is_blocked : 0,
    is_row_blocked : 0,
    is_col_blocked : 0
   };

   P.indexed_cell[i][j] = P.cell[a][b];
  }
 }
 
 return P;
};

//////////////////////////////////////////////////////////////////////

matching_problem.full_board = function(n) {
 var A,B,E,i,j;
 
 A = [];
 B = [];
 E = [];
 for (i = 1; i <= n; i++) {
  A.push(i);
  B.push(i);
  for (j = 1; j <= n; j++) {
   E.push([i,j]);
  }
 }
 
 return matching_problem.setup(A,B,E);
}

//////////////////////////////////////////////////////////////////////

matching_problem.derangement_board = function(n) {
 var A,B,E,i,j;
 
 A = [];
 B = [];
 E = [];
 for (i = 1; i <= n; i++) {
  A.push(i);
  B.push(i);
  for (j = 1; j <= n; j++) {
   if (i != j) {
    E.push([i,j]);
   }
  }
 }
 
 return matching_problem.setup(A,B,E);
}

//////////////////////////////////////////////////////////////////////

matching_problem.staircase = function(n) {
 var A,B,E,i,j;
 
 A = [];
 B = [];
 E = [];
 for (i = 1; i <= n; i++) {
  A.push(i);
  B.push(i);
  E.push([i,i]);
  if (i < n) { E.push([i+1,i]); }
 }
 
 return matching_problem.setup(A,B,E);
}

//////////////////////////////////////////////////////////////////////

matching_problem.clear = function() {
 var A,B,i,j,a,b;
 
 A = this.left_set;
 B = this.right_set;
 
 for (i in A) {
  a = A[i];
  for (j in B) {
   b = B[j];
   this.cell[a][b].is_filled = 0;
   this.cell[a][b].is_blocked = 0;
   this.cell[a][b].is_row_blocked = 0;
   this.cell[a][b].is_col_blocked = 0;
  }
 }
};

//////////////////////////////////////////////////////////////////////

matching_problem.add_rook = function(a,b) {
 this.cell[a][b].is_filled = 1;
 this.set_blocks();
}

//////////////////////////////////////////////////////////////////////

matching_problem.remove_rook = function(a,b) {
 this.cell[a][b].is_filled = 0;
 this.set_blocks();
}

//////////////////////////////////////////////////////////////////////

matching_problem.toggle_rook = function(a,b) {
 var i,a0,b0;
 
 if (this.cell[a][b].is_filled) {
  this.cell[a][b].is_filled = 0;
 } else {
  this.cell[a][b].is_filled = 1;
 }

 for (i in this.left_set) {
  a0 = this.left_set[i];
  if (a0 != a) {
   this.cell[a0][b].is_filled = 0;
  }
 }

 for (i in this.right_set) {
  b0 = this.right_set[i];
  if (b0 != b) {
   this.cell[a][b0].is_filled = 0;
  }
 }
 
 this.set_blocks();
}

//////////////////////////////////////////////////////////////////////

matching_problem.set_rooks = function(u) {
 var i;
 
 this.clear();
 for (i in u) {
  this.add_rook(u[i][0],u[i][1]);
 }
}

//////////////////////////////////////////////////////////////////////

matching_problem.set_blocks = function() {
 var A,B,E,i0,j0,i1,j1,a0,a1,b0,b1;
 
 A = this.left_set;
 B = this.right_set;
 E = this.relation_table;
 this.left_match = {};
 this.right_match = {};
 this.num_rooks = 0;
 
 for (i0 in A) { this.left_match[A[i0]] = null; }
 for (j0 in B) { this.right_match[B[j0]] = null; }

 for (i0 in A) {
  a0 = A[i0];
  for (j0 in B) {
   b0 = B[j0];
   
   if (this.cell[a0][b0].is_filled) {
    this.left_match[a0] = b0;
    this.right_match[b0] = a0;
    this.num_rooks++;
   }
   
   this.cell[a0][b0].is_blocked = 0;
   this.cell[a0][b0].is_row_blocked = 0;
   this.cell[a0][b0].is_col_blocked = 0;
   if (E[a0][b0] && ! this.cell[a0][b0].is_filled) {
    for (i1 in A) {
     a1 = A[i1];
     if (this.cell[a1][b0].is_filled) {
      this.cell[a0][b0].is_blocked = 1;
      this.cell[a0][b0].is_row_blocked = 1;
     }
    }
    for (j1 in B) {
     b1 = B[j1];
     if (this.cell[a0][b1].is_filled) {
      this.cell[a0][b0].is_blocked = 1;
      this.cell[a0][b0].is_col_blocked = 1;
     }
    }
   }
  }
 }

 this.set_solution_key();
 
 if (this.solutions_by_key && this.solutions_by_key[this.solution_key]) {
  this.solution = this.solutions_by_key[this.solution_key];
 } else {
  this.solution = null;
 }
};

//////////////////////////////////////////////////////////////////////

matching_problem.set_solution_key = function() {
 var A,B,i0,j0,a0,b0,row_filled;
 
 this.solution_key = '';
 this.solution_is_full = 1;
 this.full_solution_key = '';

 A = this.left_set;
 B = this.right_set;
 for (i0 in A) {
  a0 = A[i0];
  row_filled = 0;
  for (j0 in B) {
   b0 = B[j0];
   
   if (this.cell[a0][b0].is_filled) {
    row_filled = 1;
    this.solution_key += '' + a0 + b0;
    this.full_solution_key += b0;
   }
  }
  
  if (! row_filled) {
   this.solution_is_full = 0;
  }
 }
 
 if (! this.solution_is_full) {
  this.full_solution_key = null;
 }
};

//////////////////////////////////////////////////////////////////////

matching_problem.parse_packed_solutions = function(s) {
 var keys,i,k,key,n,u,t,c;
 
 keys = s.split('|');
 this.solutions = [];
 this.solutions_by_key = {};
 this.solutions_by_size = {};
 this.max_solution_size = 0;
 
 for(i = 0; i <= this.left_order; i++) {
  this.solutions_by_size[i] = [];
 }
 
 for(k in keys) {
  key = keys[k];
  n = key.length / 2;
  u = { key : key, size : n, slots : [] };
  for (i = 0; i < n; i++) {
   u.slots.push([key.substr(2*i,1),key.substr(2*i+1,1)]);
  }
  
  this.solutions_by_key[key] = u;
  this.solutions.push(u);
  if (! Array.isArray(this.solutions_by_size[n])) {
   this.solutions_by_size[n] = [];
  }
  
  this.solutions_by_size[n].push(u);
  this.max_solution_size = Math.max(n,this.max_solution_size);
 }
 
 if (this.solutions_by_size[0].length == 0) {
  u = {key : '', size : 0, slots:  []};
  this.solutions_by_key[''] = u;
  this.solutions.push(u);
  this.solutions_by_size[0].push(u);  
 }
 
 this.rook_polynomial_string = '1';
 for (i = 1; i <= this.max_solution_size; i++) {
  t = 'x';
  if (i > 1) {
   t = t + '^{' + i + '}';
  }
  c = this.solutions_by_size[i].length;
  if (c > 1) { t = c + t;}
  this.rook_polynomial_string += '+' + t;
 }
};

//////////////////////////////////////////////////////////////////////

matching_problem.from_eqs = function(U) {
 var A,B,BT,i,j,a,b,X,E;
 
 A = Object.keys(U);
 BT = {};
 E = [];
 
 for (i in A) {
  a = A[i];
  X = U[a];
  for (j in X) {
   b = X[j];
   BT[b] = 1;
   E.push([a,b]);
  }
 }

 B = Object.keys(BT).sort();
 return this.setup(A,B,E,true);
};

//////////////////////////////////////////////////////////////////////

matching_problem.make_grid = function() {
 var A,B,nA,nB,T,x0,y0,w,h,x,y,g,i,j,a,b,f,s,n;
 
 A = this.shifted_left_set;
 B = this.shifted_right_set;
 nA = this.left_order;
 nB = this.right_order;
 T = this.relation_table;
 
 x0 = this.grid_x0;
 y0 = this.grid_y0;
 w = this.grid_w;
 h = this.grid_h;
 
 g = {x0 : x0, y0 : y0, w : w, h : h};
 this.grid = g;
 
 g.square = {};
 g.indexed_square = {};
 g.rook_icon = {};
 g.svg = comb.svg.group();
 
 for (i = 1; i <= nA; i++) {
  a = A[i];
  g.square[a] = {};
  g.rook_icon[a] = {};
  g.indexed_square[i] = {};
  for (j = 1; j <= nB; j++) {
   b = B[j];
   f = T[a][b] ? 'white' : 'grey';
   s = comb.svg.node('rect');
   s.setAttribute('stroke','grey');
   s.setAttribute('stroke-width',1);
   s.setAttribute('fill',f);
   s.setAttribute('x',x0 + j * w);
   s.setAttribute('y',y0 + i * h);
   s.setAttribute('width',w);
   s.setAttribute('height',h);
   g.svg.appendChild(s);
   g.square[a][b] = s;
   g.indexed_square[i][j] = s;
   
   n = comb.svg.rook(x0 + (j + 0.5) * w, y0 + (i + 0.5) * h, w);
   g.rook_icon[a][b] = n;
   n.setAttribute('visibility','hidden');
   g.svg.appendChild(n);

   this.cell[a][b].square = s;
   this.cell[a][b].rook_icon = n;
  }
 }

 g.row_label = {};
 g.row_label_indexed = {};
 
 for (i = 1; i <= nA; i++) {
  a = A[i];
  x = x0 + 0.9 * w;
  y = y0 + (i + 0.5) * h;
  n = comb.svg.node('text');
  n.setAttribute('text-anchor','end');
  n.setAttribute('alignment-baseline','middle');
  n.setAttribute('font-size','24px');
  n.setAttribute('fill','black');
  n.setAttribute('x', x);
  n.setAttribute('y', y);
  n.textContent = a;
  g.svg.appendChild(n);
  g.row_label[a] = n;
  g.row_label_indexed[i] = n;
 }
 
 g.col_label = {};
 g.col_label_indexed = {};
 
 for (i = 1; i <= nB; i++) {
  b = B[i];
  x = x0 + (i + 0.5) * w;
  y = y0 + 0.7 * h;
  n = comb.svg.node('text');
  n.setAttribute('text-anchor','middle');
  n.setAttribute('alignment-baseline','middle');
  n.setAttribute('font-size','24px');
  n.setAttribute('fill','black');
  n.setAttribute('x', x);
  n.setAttribute('y', y);
  n.textContent = b;
  g.svg.appendChild(n);
  g.col_label[b] = n;
  g.col_label_indexed[i] = n;
 }
 
 return this.grid;
}

//////////////////////////////////////////////////////////////////////

matching_problem.remove_row_labels = function() {
 var A,nA,i,a;
 
 A = this.shifted_left_set;
 nA = this.left_order;

 for (i = 1; i <= nA; i++) {
  a = A[i];
  this.grid.svg.removeChild(this.grid.row_label[a]);
 }
};

//////////////////////////////////////////////////////////////////////

matching_problem.remove_col_labels = function() {
 var B,nB,i,b;
 
 B = this.shifted_right_set;
 nB = this.right_order;

 for (i = 1; i <= nB; i++) {
  b = B[i];
  this.grid.svg.removeChild(this.grid.col_label[b]);
 }
};

//////////////////////////////////////////////////////////////////////

matching_problem.remove_labels = function() {
 this.remove_row_labels();
 this.remove_col_labels();
}

//////////////////////////////////////////////////////////////////////

matching_problem.paint_grid = function() {
 var i,j,a,b,c;
 
 for (i in this.left_set) {
  a = this.left_set[i];
  for (j in this.right_set) {
   b = this.right_set[j];

   if (this.relation_table[a][b]) {
    c = this.cell[a][b];
    c.rook_icon.setAttribute('visibility','hidden');
    c.square.setAttribute('fill','#FFFFFF');
   }
  }
 }
 
 for (i in this.left_set) {
  a = this.left_set[i];
  for (j in this.right_set) {
   b = this.right_set[j];

   c = this.cell[a][b];

   if (c.is_filled) {
    c.rook_icon.setAttribute('visibility','visible');
    c.square.setAttribute('fill','orange');
   } else {
    c.rook_icon.setAttribute('visibility','hidden');
    if (c.is_blocked) {
     c.square.setAttribute('fill','#FFDDDD');
    } else if (this.relation_table[a][b]) {
     c.square.setAttribute('fill','#FFFFFF');
    }
   }
  }
 }
}

//////////////////////////////////////////////////////////////////////

matching_problem.paint_solutions = function() {
 var i,k0,k1,s;
 for (i in this.solutions) {
  s = this.solutions[i];
  k0 = s.key;
  k1 = this.solution_key;
  if (k0 == k1) {
   s.div.className = 'solution_key_selected';
  } else {
   s.div.className = 'solution_key'
  }
 }
}

//////////////////////////////////////////////////////////////////////

matching_problem.make_matrix = function() {
 var A,B,nA,nB,T,x0,y0,w,h,x,y,g,i,j,a,b,c,s,n,p;
 
 A = this.shifted_left_set;
 B = this.shifted_right_set;
 nA = this.left_order;
 nB = this.right_order;
 T = this.relation_table;
 
 x0 = this.grid_x0;
 y0 = this.grid_y0;
 w = this.grid_w;
 h = this.grid_h;
 
 g = {x0 : x0, y0 : y0, w : w, h : h};
 this.matrix = g;
 
 g.square = {};
 g.indexed_square = {};
 g.cell_text = {};
 g.indexed_cell_text = {};
 
 g.svg = comb.svg.group();
 
 for (i = 1; i <= nA; i++) {
  a = A[i];
  g.square[a] = {};
  g.indexed_square[i] = {};
  g.cell_text[a] = {};
  g.indexed_cell_text[i] = {};
  for (j = 1; j <= nB; j++) {
   b = B[j];
   s = comb.svg.node('rect');
   s.setAttribute('stroke','none');
   s.setAttribute('fill','white');
   s.setAttribute('x',x0 + (j + 0.1) * w);
   s.setAttribute('y',y0 + (i + 0.1) * h);
   s.setAttribute('width',0.8 * w);
   s.setAttribute('height',0.8 * h);
   s.setAttribute('rx',0.1 * w);
   s.setAttribute('ry',0.1 * h);
   g.svg.appendChild(s);
   g.square[a][b] = s;
   g.indexed_square[i][j] = s;
   
   n = comb.svg.text(T[a][b] ? '1' : '0',x0 + (j + 0.5) * w,y0 + (i + 0.5) * h);
   g.svg.appendChild(n);
   g.cell_text[a][b] = n;
   g.indexed_cell_text[i][j] = n;

   c = this.cell[a][b];
   c.matrix_square = s;
   c.matrix_text = n;
  }
 }

 p = comb.svg.lines([[x0 + 1.3 * w, y0 + 1.1 * h],
                     [x0 + 1.1 * w, y0 + 1.1 * h],
                     [x0 + 1.1 * w, y0 + (nA + 0.8) * h],
                     [x0 + 1.3 * w, y0 + (nA + 0.8) * h]],
                    'black',2);
 g.right_brace = p;
 g.svg.appendChild(p);
 
 p = comb.svg.lines([[x0 + (nA + 0.8) * w, y0 + 1.1 * h],
                     [x0 + (nA + 1.0) * w, y0 + 1.1 * h],
                     [x0 + (nA + 1.0) * w, y0 + (nA + 0.8) * h],
                     [x0 + (nA + 0.8) * w, y0 + (nA + 0.8) * h]],
                    'black',2);
 g.right_brace = p;
 g.svg.appendChild(p);
 
 g.row_label = {};
 g.row_label_indexed = {};
 
 for (i = 1; i <= nA; i++) {
  a = A[i];
  x = x0 + 0.8 * w;
  y = y0 + (i + 0.5) * h;
  n = comb.svg.node('text');
  n.setAttribute('text-anchor','end');
  n.setAttribute('alignment-baseline','middle');
  n.setAttribute('font-size','24px');
  n.setAttribute('fill','black');
  n.setAttribute('x', x);
  n.setAttribute('y', y);
  n.textContent = a;
  g.svg.appendChild(n);
  g.row_label[a] = n;
  g.row_label_indexed[i] = n;
 }
 
 g.col_label = {};
 g.col_label_indexed = {};
 
 for (i = 1; i <= nB; i++) {
  b = B[i];
  x = x0 + (i + 0.5) * w;
  y = y0 + 0.7 * h;
  n = comb.svg.node('text');
  n.setAttribute('text-anchor','middle');
  n.setAttribute('alignment-baseline','middle');
  n.setAttribute('font-size','24px');
  n.setAttribute('fill','black');
  n.setAttribute('x', x);
  n.setAttribute('y', y);
  n.textContent = b;
  g.svg.appendChild(n);
  g.col_label[b] = n;
  g.col_label_indexed[i] = n;
 }
 
 return this.grid;
}

//////////////////////////////////////////////////////////////////////

matching_problem.make_equations = function(use_cols) {
 var A,B,nA,nB,X,Y,nX,P,e,i,j,x,y,tr,td,s,c;
 
 A = this.shifted_left_set;
 B = this.shifted_right_set;
 nA = this.left_order;
 nB = this.right_order;
 
 if (use_cols) {
  X = B;
  nX = nB;
  P = this.coblock;
 } else {
  X = A;
  nX = nA;
  P = this.block;
 }

 e = {};
 
 e.table = document.createElement('table');
 e.table.className = use_cols ? 'col_equations' : 'row_equations';
 e.table_row = {};
 e.lhs = {};
 e.rhs = {};
 e.entry = {};
 
 for (i = 1; i <= nX; i++) {
  x = X[i];
  tr = document.createElement('tr');
  e.table_row[x] = tr;
  e.table.appendChild(tr);
  tr.className = use_cols ? 'col_equation' : 'row_equation';
  td = document.createElement('td');
  tr.appendChild(td);
  td.className = 'lhs';
  e.lhs[x] = td;
  if (use_cols) {
   td.innerHTML = '$C_{' + x + '}=$';   
  } else {
   td.innerHTML = '$R_{' + x + '}=$';
  }
  td = document.createElement('td');
  tr.appendChild(td);
  td.className = 'rhs';
  e.rhs[x] = td;
  s = document.createElement('span');
  s.innerHTML = '$\\{$';
  td.appendChild(s);
  Y = P[x];
  e.entry[x] = {};
  c = 0;
  for (j in Y) {
   y = Y[j];
   if (c) {
    s = document.createElement('span');
    s.innerHTML = ',';
    td.appendChild(s);
   }
   c = 1;
   s = document.createElement('span');
   s.innerHTML = '$' + y + '$';
   td.appendChild(s);
   e.entry[x][y] = s;
  }
  s = document.createElement('span');
  s.innerHTML = '$\\}$';
  td.appendChild(s);
 }

 if (use_cols) {
  this.col_equations = e; 
 } else {
  this.row_equations = e;
 }
 
 return e;
}

//////////////////////////////////////////////////////////////////////

matching_problem.make_graph = function() {
 var g,A,B,P,Q,T,i,j,a,b,n;
 
 A = this.shifted_left_set;
 B = this.shifted_right_set;
 
 g = {};
 this.graph = g;
 g.svg = comb.svg.group();

 P = this.left_graph_pos;
 Q = this.right_graph_pos;
 
 T = this.relation_table;
 
 g.edge = {};
 for (i in A) {
  a = A[i];
  g.edge[a] = {};
  for (j in B) {
   b = B[j];
   g.edge[a][b] = null;
   if (T[a][b]) {
    g.edge[a][b] = comb.svg.line(P[a][0],P[a][1],Q[b][0],Q[b][1],'green',6);
    g.svg.appendChild(g.edge[a][b]);
   } 
  }
 }
 
 g.left_node = {};
 g.left_label = {};
 g.right_node = {};
 g.right_label = {};
 
 for (i in A) {
  a = A[i];
  n = comb.svg.node('circle');
  n.setAttribute('stroke','red');
  n.setAttribute('stroke-width',3);
  n.setAttribute('fill','white');
  n.setAttribute('r',20);
  n.setAttribute('cx',P[a][0]);
  n.setAttribute('cy',P[a][1]);
  g.left_node[a] = n;
  g.svg.appendChild(n);
  
  n = comb.svg.text(a,P[a][0],P[a][1]);
  g.left_label[a] = n;
  g.svg.appendChild(n);
 }
 
 for (i in B) {
  b = B[i];
  n = comb.svg.node('rect');
  n.setAttribute('stroke','blue');
  n.setAttribute('stroke-width',3);
  n.setAttribute('fill','white');
  n.setAttribute('rx',5);
  n.setAttribute('ry',5);
  n.setAttribute('x',Q[b][0] - 20);
  n.setAttribute('y',Q[b][1] - 20);
  n.setAttribute('width',40);
  n.setAttribute('height',40);
  g.right_node[b] = n;
  g.svg.appendChild(n);

  n = comb.svg.text(b,Q[b][0],Q[b][1]);
  g.right_label[b] = n;
  g.svg.appendChild(n);
 }
 
 return g;
}

//////////////////////////////////////////////////////////////////////

matching_problem.make_solution_table = function() {
 var tb,tr,td,dv,ss,m,i,j,u;
 
 tb = document.createElement('table');
 tb.className = 'edged solution_table';
 this.solution_table = tb;
 m = 0;
 for (i in this.solutions_by_size) {
  m = Math.max(i,m);
 }
 this.max_solution_size = m;
 this.solution_row = {};
 for(i = 0; i <= m; i++) {
  tr = document.createElement('tr');
  this.solution_row[i] = tr;
  tr.className = 'solution_row';
  tb.appendChild(tr);
  td = document.createElement('td');
  tr.appendChild(td);
  td.className = 'solution_size';
  td.innerHTML = i;
  td = document.createElement('td');
  tr.appendChild(td);
  td.className = 'solution_keys';
  for (j in this.solutions_by_size[i]) {
   u = this.solutions_by_size[i][j];
   dv = document.createElement('div');
   td.appendChild(dv);
   u.div = dv;
   dv.className = 'solution_key';
   dv.innerHTML = u.key ? u.key : 'empty';
   td.appendChild(document.createTextNode(' '));
  }
  td = document.createElement('td');
  tr.appendChild(td);
  td.className = 'solution_count';
  ss = this.solutions_by_size[i];
  td.innerHTML = ss.length;
 }
 
 return tb;
}

//////////////////////////////////////////////////////////////////////

matching_problem.max_sols_step = {
 id : 0,
 A : {},
 B : {},
 nA : 0,
 parent : null,
 length : 0,
 entries : {},
 type : 'start',
 msg : '',
 backtrack_msg : ''
};

//////////////////////////////////////////////////////////////////////

matching_problem.max_sols_step.extend = function(js) {
 var x,i;
 
 x = Object.create(matching_problem.max_sols_step);
 x.A = this.A;
 x.B = this.B;
 x.nA = this.nA;
 x.id = this.id + 1;
 x.parent = this;
 x.entries = {};
 x.length = this.length + 1;
 for (i = 1; i <= this.length; i++) {
  x.entries[i] = this.entries[i];
 }
 
 i = x.length;
 x.entries[i] = js;
 x.type = 'extend';
 x.condense();
 x.set_label();
 
 x.msg = 
  'The first available space for a rook on the next row is at ' + 
  x.label + '.<br/> ' + 
  'We place a new rook there and enter ' + x.label + ' in the table.<br/>';
 
 if (x.entries[x.length].length == 1) {
  x.msg += 
  'As there were no other possibilities to the right of ' + 
   x.label + ', this new entry is underlined.';
 } else {
  x.msg +=
  'As there were further possibilities to the right of ' + 
   x.label + ', this new entry is not underlined.';  
 }
 return x;
}

//////////////////////////////////////////////////////////////////////

matching_problem.max_sols_step.backtrack = function(p) {
 var x,y,i,js;
 
 x = this;
 while (x.length > p) {
  x = x.parent;
 }
 
 y = Object.create(matching_problem.max_sols_step);
 y.A = this.A;
 y.B = this.B;
 y.nA = this.nA;
 y.id = this.id + 1;
 y.parent = x.parent;
 y.sibling = x;
 y.entries = {};
 y.length = p;
 for (i = 1; i < p; i++) {
  y.entries[i] = x.entries[i];
 }
 
 i = y.length;
 js = x.entries[i];
 js = js.slice(1,js.length);
 y.entries[i] = js;
 y.type = (p == this.length) ? 'nudge' : 'backtrack';
 
 y.condense();
 y.set_label();
 y.backtrack_msg =
  'Backtrack to the last entry that was not underlined, ' +
  'which is ' + y.sibling.label;
 
 y.msg = 
  'Move the rook at ' + y.sibling.label + ' to ' + y.label + ', ' +
  'and enter this in the table on a new line.<br/>';
 
 if (y.entries[y.length].length == 1) {
  y.msg += 
  'As there were no other possibilities to the right of ' + 
   y.label + ', this new entry is underlined.';
 } else {
  y.msg +=
  'As there were further possibilities to the right of ' + 
   y.label + ', this new entry is not underlined.';  
 }
 
 return y;
}

//////////////////////////////////////////////////////////////////////

matching_problem.max_sols_step.set_used_cols = function(C) {
 var i;
 
 for (i = 1; i <= this.length; i++) {
  C[this.entries[i][0]] = 1;
 }
}

//////////////////////////////////////////////////////////////////////

matching_problem.max_sols_step.last_extendable_index = function() {
 var p = this.length;
 
 while (p > 0 && this.entries[p].length <= 1) { p--; }
 
 return p;
}

//////////////////////////////////////////////////////////////////////

matching_problem.max_sols_step.condense = function() {
 var u,i;
 
 u = [];
 for (i = 1; i <= this.length; i++) {
  u.push([this.A[i],this.B[this.entries[i][0]]]);
 }
 
 this.condensed = u;
 return u;
}

//////////////////////////////////////////////////////////////////////

matching_problem.max_sols_step.set_label = function() {
 var e,a,b;
 
 e = this.entries[this.length];
 a = this.A[this.length];
 b = this.B[e[0]];
 this.label = a + b;
 return this.label;
}

//////////////////////////////////////////////////////////////////////

matching_problem.find_max_sols = function() {
 var A,B,nA,nB,P,col_used,i,j,js,p,step,steps,backtrack,finished;
 
 A = this.shifted_left_set;
 B = this.shifted_right_set;
 nA = this.left_order;
 nB = this.right_order;
 
 P = this.indexed_relation_table;

 col_used = {};
 for (j = 1; j <= nB; j++) { col_used[j] = 0; }
 
 step = Object.create(matching_problem.max_sols_step);
 step.A = A;
 step.B = B;
 step.nA = nA;
 step.msg = '';
 steps = [step];
 
 while (! finished) {
  p = step.length;
  backtrack = 0;
  
  if (p == nA) {
   step.type = 'complete';
   step.msg += '<br/>' +
    'We now have a complete matching, so we put a tick in the final column.';
   backtrack = 1;
  } else {
   i = p+1;
   js = [];
   for (j = 1; j <= nB; j++) { col_used[j] = 0; }
   step.set_used_cols(col_used);
   
   for (j = 1; j <= nB; j++) {
    if (P[i][j] && ! col_used[j]) { js.push(j); }
   }
   
   if (js.length) {
    step = step.extend(js);
    steps.push(step);
   } else {
   if (step.type)
    step.msg += '<br/>' +
    'This partial matching cannot be extended, so we put a cross in the final column.';
    backtrack = 1;
   }
  }
  
  if (backtrack) {
   p = step.last_extendable_index();
   if (p == 0) {
    finished = 1;
   } else {
    step = step.backtrack(p);
    steps.push(step);
   }
  }
 }
 
 this.max_sols_steps = steps;
 this.max_sols = [];
 for (i in steps) {
  steps[i].condense(A,B);
  if (steps[i].type == 'complete') {
   this.max_sols.push(steps[i].condensed);
  }
 }
 
 step = steps[steps.length - 1];
 step.msg += '<br/><br/>' + 
  'We have now found all the complete matchings. <br/>' +
  'There are ' + this.max_sols.length + ' of them, one for each row with a tick.';
}

//////////////////////////////////////////////////////////////////////

matching_problem.find_max_sols_table = function() {
 var A,B,nA,i,j,n,tb,tr,td,sp,step,e;
 
 A = this.shifted_left_set;
 B = this.shifted_right_set;
 nA = this.left_order;
 
 tb = document.createElement('table');
 tb.id = "max_sols";
 tb.className = 'edged';
 
 n = this.max_sols_steps.length;
 
 for (i = 0; i < n; i++) {
  step = this.max_sols_steps[i];
  
  if (step.type == 'start') {
   tr = document.createElement('tr');
   tb.appendChild(tr);
  } else {
   if (step.type == 'backtrack' || step.type == 'nudge') {
    for (j = 1; j < step.length; j++) {
     tr.appendChild(document.createElement('td'));    
    }
   }
   
   e = step.entries[step.length];
   td = document.createElement('td');
   sp = document.createElement('span');
   td.appendChild(sp);
   
   sp.innerHTML = A[step.length] + B[e[0]];
   if (e.length < 2) {
    td.style.textDecoration = 'underline';
   }
   step.label_span = sp;
   step.label_td = td;
   tr.appendChild(td);
   
   if (i == n-1 ||
       this.max_sols_steps[i+1].type == 'backtrack' ||
       this.max_sols_steps[i+1].type == 'nudge')  {
    for (j = step.length; j < nA; j++) {
     tr.appendChild(document.createElement('td'));     
    }
    td = document.createElement('td');
    tr.appendChild(td);
    sp = document.createElement('span');
    td.appendChild(sp);
    sp.innerHTML = (step.type == 'complete') ? '&#x2714;' : '&#x2718;';
    step.is_complete_span = sp;
    if (i < n-1) {
     tr = document.createElement('tr');
     tb.appendChild(tr);
    }
   }
  }
 }

 this.max_sols_table = tb;
 return tb;
};

//////////////////////////////////////////////////////////////////////

matching_problem.show_step = function(i) {
 var step,j,s;
 
 step = this.max_sols_steps[i];
 this.set_rooks(step.condensed);
 this.paint_grid();
 
 for (j in this.max_sols_steps) {
  if (j == 0) { continue; }
  s = this.max_sols_steps[j];
  s.label_span.style.visibility = (j <= i) ? 'visible' : 'hidden';
  s.label_span.style.color = '#000000';
  s.label_td.style.background = (j == i) ? '#00FF00' : '#FFFFFF';
  
  if (s.is_complete_span) {
   s.is_complete_span.style.visibility = (j <= i) ? 'visible' : 'hidden';
  }
 }
};

//////////////////////////////////////////////////////////////////////

matching_problem.show_backtrack = function(i) {
 var step,sib,j,s,a,b;
 
 step = this.max_sols_steps[i];
 if (! (step.type == 'backtrack' || step.type == 'nudge')) {
  this.show_step(i);
  return;
 }
 
 sib = step.sibling;

 this.set_rooks(sib.parent.condensed);
 this.paint_grid();
 
 a = this.shifted_left_set[sib.length];
 b = this.shifted_right_set[sib.entries[sib.length][0]];
 this.cell[a][b].rook_icon.setAttribute('visibility','visible');
 
 for (j in this.max_sols_steps) {
  s = this.max_sols_steps[j];
  if (j == 0) { 
   continue; 
  } else if (j <= sib.id) {
   s.label_span.style.visibility = 'visible';
   s.label_span.style.color = '#000000';
  } else if (j < step.id) {
   s.label_span.style.visibility = 'visible';
   s.label_span.style.color = '#BBBBBB';
  } else {
   s.label_span.style.visibility = 'hidden';
   s.label_span.style.color = '#000000';
  }
  
  s.label_td.style.background = (j == sib.id) ? '#00FF00' : '#FFFFFF';

  if (s.is_complete_span) {
   s.is_complete_span.style.visibility = 
    (j <= step.id) ? 'visible' : 'hidden';
  }
 }
};

//////////////////////////////////////////////////////////////////////

matching_problem.find_sols = function() {
 var A,B,E,T,L,i,s,t,c;
 A = irange(this.left_order);
 B = irange(this.right_order);
 E = this.indexed_relation;
 T = rook_tree(A,B,E);
 L = rook_list_from_tree(T);
 
 this.indexed_solutions = L;
 this.indexed_solutions_by_size = {};
 this.max_solution_size = 0;
 
 for(i in L) {
  s = L[i];
  this.max_solution_size = Math.max(this.max_solution_size,s.length);
 }
 
 for (i = 0; i <= this.max_solution_size; i++) {
  this.indexed_solutions_by_size[i] = [];
 }
 
 for (i in L) {
  s = L[i];
  this.indexed_solutions_by_size[s.length].push(s);
 }

 this.rook_polynomial_string = '1';
 for (i = 1; i <= this.max_solution_size; i++) {
  t = 'x';
  if (i > 1) {
   t = t + '^{' + i + '}';
  }
  c = this.indexed_solutions_by_size[i].length;
  if (c > 1) { t = c + t;}
  this.rook_polynomial_string += '+' + t;
 }
}

//////////////////////////////////////////////////////////////////////

matching_problem.clone = function() {
 var A,B,E;
 
 A = this.left_set.slice();
 B = this.right_set.slice();
 E = this.relation.slice();
 return matching_problem.setup(A,B,E);
}; 

//////////////////////////////////////////////////////////////////////

matching_problem.add_block = function(a,b) {
 var A,B,E;

 A = this.left_set.slice();
 B = this.right_set.slice();
 E = this.relation.filter(u => (u[0] != a || u[1] != b));
 return matching_problem.setup(A,B,E);
}; 

//////////////////////////////////////////////////////////////////////

matching_problem.delete_cross = function(a,b) {
 var A,B,E;

 A = this.left_set.filter(x => (x != a));
 B = this.right_set.filter(y => (y != b));
 E = this.relation.filter(u => (u[0] != a && u[1] != b));
 return matching_problem.setup(A,B,E);
}; 

//////////////////////////////////////////////////////////////////////

var tournament = {
 players : ['A','B','C','D','E'],
 grid_x0 : 0,
 grid_y0 : 0,
 grid_w : 50,
 grid_h : 50,
 grid_stroke : 'grey',
 win_bg : '#ddddff',
 lose_bg : '#ddffdd',
 col  : { '0' : {0 : '#000000', 1 : '#000000', 2 : '#000000'},
	  '1' : {0 : '#ddddff', 1 : '#bbbbff', 2 : '#9999ff'},
	 '-1' : {0 : '#ddffdd', 1 : '#bbffbb', 2 : '#99ff99'}}, 
 letter : { '0' : '', '1' : 'W', '-1' : 'L'}
} 

tournament.setup = function(wins) {
 var T,players0,i,j,k,w,a,b;
 
 T = Object.create(this);
 
 T.wins = wins;
 T.losses = [];
 
 players0 = {};
 for (i in wins) {
  players0[wins[i][0]] = 1;
  players0[wins[i][1]] = 1;
 }

 T.players = Object.keys(players0);
 T.players.sort();
 T.n = T.players.length;
 T.player_index = {};

 for (i = 0; i < T.n; i++) {
  T.player_index[T.players[i]] = i;
 }

 T.result = {};
 T.score = {};
 T.wins_for = {};
 T.losses_for = {};
 T.indexed_result = {};
 T.indexed_score = {};
 T.indexed_wins_for = {};
 T.indexed_losses_for = {};
 
 for (i = 0; i < T.n; i++) {
  a = T.players[i];
  T.result[a] = {};
  T.wins_for[a] = [];
  T.losses_for[a] = [];
  T.indexed_result[i] = {};
  T.indexed_wins_for[i] = [];
  T.indexed_losses_for[i] = [];
  
  for (j = 0; j < T.n; j++) {
   b = T.players[j];
   T.result[a][b] = 0;
   T.indexed_result[i][j] = 0;
  }
  T.score[a] = 0;
  T.indexed_score[i] = 0;
 }

 for (i in T.wins) {
  w = T.wins[i];
  a = w[0];
  b = w[1];
  j = T.player_index[a];
  k = T.player_index[b];
  T.losses.push([b,a]);
  T.wins_for[a].push(b);
  T.losses_for[b].push(a);
  T.result[a][b] =  1;
  T.result[b][a] = -1;
  T.score[a]++;
  T.indexed_wins_for[j].push(k);
  T.indexed_losses_for[k].push(j);
  T.indexed_result[j][k] =  1;
  T.indexed_result[k][j] = -1;
  T.indexed_score[j]++;
 }

 return T;
}

tournament.consistent = function(P) {
 var n,W,i,j;

 n = P.length;
 W = [];
 for (i = 0; i < n; i++) {
  for (j = i+1; j < n; j++) {
   W.push([P[i],P[j]]);
  }
 }

 return this.setup(W);
}

tournament.odd_modular = function(m) {
 var n,W,i,j;
 
 n = 2 * m + 1;
 W = [];
 for (i = 0; i < n; i++) {
  for (j = 1; j <= m; j++) {
   W.push([i, (i + j) % n]);
  }
 }

 return this.setup(W);
}

tournament.make_grid = function(with_scores) {
 var P,n,R,x0,y0,w,h,g,i,j,p,q,u,c,t;
     
 P = this.players;
 n = this.n;
 R = this.indexed_result;
 x0 = this.grid_x0;
 y0 = this.grid_y0;
 w = this.grid_w;
 h = this.grid_h;
 
 g = {x0 : x0, y0 : y0, w : w, h : h};
 this.grid = g;

 g.row_header = {};
 g.col_header = {};
 g.indexed_row_header = {};
 g.indexed_col_header = {};
 
 g.square = {};
 g.indexed_square = {};
 g.svg = comb.svg.group();

 for (i = 0; i < n; i++) {
  p = P[i];
  g.square[p] = {};
  g.indexed_square[i] = {};

  u = {};
  u.rect = comb.svg.rect(x0,y0 + (i + 1) * h,w,h,'black',1);
  u.text = comb.svg.text('' + p,x0 + 0.5 * w,y0 + (i + 1.5) * h);
  g.row_header[p] = u;
  g.indexed_row_header[i] = u;
  g.svg.appendChild(u.rect);
  g.svg.appendChild(u.text);
  
  u = {};
  u.rect = comb.svg.rect(x0 + (i + 1) * w,y0,w,h,'black',1);
  u.text = comb.svg.text('' + p,x0 + (i + 1.5) * w,y0 + 0.5 * h);
  g.col_header[p] = u;
  g.indexed_col_header[i] = u;
  g.svg.appendChild(u.rect);
  g.svg.appendChild(u.text);
  
  for (j = 0; j < n; j++) {
   q = P[j];
   u = {};
   c = this.col[R[i][j]][0];
   t = this.letter[R[i][j]];
   u.rect = comb.svg.rect(x0 + (j + 1) * w, y0 + (i + 1) * h,w,h,'black',1);
   u.text = comb.svg.text(t,x0 + (j + 1.5) * w, y0 + (i + 1.5) * h);
   u.rect.setAttribute('fill',c);
   g.square[p][q] = u;
   g.indexed_square[i][j] = u;
   g.svg.appendChild(u.rect);
   g.svg.appendChild(u.text);
  }
 }

 if (with_scores) {
  g.scores_header = comb.svg.rect(x0 + (n + 1) * w,y0,2 * w,h,'black',1);
  g.scores_text = comb.svg.text('Score',x0 + (n + 2) * w, y0 + 0.5 * h);
  g.svg.appendChild(g.scores_header);
  g.svg.appendChild(g.scores_text);

  g.score = {};
  g.indexed_score = {};
  
  for (j = 0; j < n; j++) {
   u = {};
   u.rect = comb.svg.rect(x0 + (n + 1) * w, y0 + (j + 1) * h,2 * w,h,'black',1);
   u.text = comb.svg.text(this.indexed_score[j],x0 + (n + 2) * w, y0 + (j + 1.5) * h);
   g.svg.appendChild(u.rect);
   g.svg.appendChild(u.text);
   g.indexed_score[j] = u;
   g.score[this.players[j]] = u;
  }
 }
 
 return g;
}

tournament.make_graph = function() {
 var P,R,n,x0,y0,m0,g0,g,i,j,p,xy1,s,xy2,a,u,nu,xy1a,xy2a;
     
 P = this.players;
 R = this.indexed_result;
 n = this.n;
 x0 = this.graph_x0;
 y0 = this.graph_y0;
 m0 = this.graph_scale;
 g0 = 25;
 
 g = {};
 this.graph = g;
 g.svg = comb.svg.group();
 g.node = {};
 g.indexed_node = {};
 g.arrow = {};

 for (i = 0; i < n; i++) { g.arrow[i] = {}; }

 for (i = 0; i < n; i++) {
  p = P[i];
  xy1 = this.graph_pos[i];
  xy1 = [x0 + m0 * xy1[0],y0 + m0 * xy1[1]];
  s = comb.svg.text(p,xy1[0],xy1[1]);
  g.node[p] = s;
  g.indexed_node[i] = s;
  g.svg.appendChild(s);
  for (j = 0; j < n; j++) {
   if (R[i][j] == 1) {
    xy2 = this.graph_pos[j];
    xy2 = [x0 + m0 * xy2[0],y0 + m0 * xy2[1]];

    u = [xy2[0] - xy1[0], xy2[1] - xy1[1]];
    nu = Math.sqrt(u[0] * u[0] + u[1] * u[1]);
    u = [u[0]/nu, u[1]/nu];
    xy1a = [xy1[0] + g0 * u[0], xy1[1] + g0 * u[1]];
    xy2a = [xy1[0] + (nu - g0) * u[0], xy1[1] + (nu - g0) * u[1]];
    a = comb.svg.line(xy1a[0],xy1a[1],xy2a[0],xy2a[1],'black',1);
    a.setAttribute('marker-end','url(#head)');
    g.arrow[i][j] = a;
    g.arrow[j][i] = a;
    g.svg.appendChild(a);
   }
  }
 }

 return g;
}
 
//////////////////////////////////////////////////////////////////////

var latin_rectangle = {
 grid_x0 : 0,
 grid_y0 : 0,
 grid_w : 50,
 grid_h : 50,
 grid_stroke : 'grey',
 grid_fill : 'white'
};

latin_rectangle.cell = {
 i : 0,
 j : 0,
 value : ''
};

latin_rectangle.setup = function(L0) {
 var L,i,j,k,c,t,v,e,N;

 L = Object.create(this);
 L.table = L0;
 
 N = {};

 if (! Array.isArray(L0)) {
  throw new Error('L is not an array');
 }

 L.p = L0.length;

 if (L.p == 0) { throw new Error('L is empty'); }

 if (! Array.isArray(L0[0])) {
  throw new Error('L[0] is not an array');
 }
 
 L.q = L0[0].length;

 L.cell = {};
 L.row_index = {};
 L.col_index = {};
 L.row_gap = {};
 L.col_gap = {};
 L.col_label = [];
 
 for (i = 0; i < L.p; i++) {
  L.cell[i] = {};
  L.row_index[i] = {};
  
  if (! Array.isArray(L0[i])) {
   throw new Error('L[' + i + '] is not an array');
  }

  if (L0[i].length != L.q) {
   throw new Error('Array is ragged');
  }

  for (j = 0; j < L.q; j++) {
   c = Object.create(this.cell);
   L.cell[i][j] = c;
   c.i = i;
   c.j = j;
   
   t = typeof L0[i][j];
   if (t === 'string') {
    c.value = L0[i][j];
   } else if (t === 'number') {
    c.value = '' + L0[i][j];
   } else {
    throw new Error('Bad cell content');
   }

   if (c.value in L.row_index[i]) {
    throw new Error('Row clash at (' + i + ',' + j + ')');
   }
   L.row_index[i][c.value] = j;
   
   N[c.value] = 1;
  }
 }

 L.values = Object.keys(N);
 L.values.sort();
 L.n = L.values.length;
 L.is_wide = (L.q == L.n) ? 1 : 0;
 L.is_tall = (L.p == L.n) ? 1 : 0;
 
 for (j = 0; j < L.q; j++) {
  L.col_index[j] = {};
  L.col_label.push(j);
  for (i = 0; i < L.p; i++) {
   c = L.cell[i][j];

   if (c.value in L.col_index[j]) {
    throw new Error('Column clash at (' + i + ',' + j + ')');
   }

   L.col_index[j][c.value] = i;
  }
 }

 for (i = 0; i < L.p; i++) {
  L.row_gap[i] = [];
  for (k in L.values) {
   v = L.values[k];
   if (! (v in L.row_index[i])) {
    L.row_gap[i].push(v);
   }
  }
 }

 for (j = 0; j < L.q; j++) {
  L.col_gap[j] = [];
  for (k in L.values) {
   v = L.values[k];
   if (! (v in L.col_index[j])) {
    L.col_gap[j].push(v);
   }
  }
 }

 L.multiplicity = {};
 L.excess = {};

 for (i in L.values) {
  v = L.values[i];
  L.multiplicity[v] = 0;
 }

 for (i = 0; i < L.p; i++) {
  for (j = 0; j < L.q; j++) {
   L.multiplicity[L.cell[i][j].value]++;
  }
 }

 L.excess_shift = L.p + L.q - L.n;
 L.subcritical_values   = [];
 L.critical_values      = [];
 L.supercritical_values = [];
 L.is_subcritical       = {};
 L.is_critical          = {};
 L.is_supercritical     = {};
 L.is_extendible        = 1;
 
 for (i in L.values) {
  v = L.values[i];
  e = L.multiplicity[v] - L.excess_shift;
  L.excess[v] = e;
  
  if (e < 0) {
   L.subcritical_values.push(v);
   L.is_subcritical[v]   = 1;
   L.is_critical[v]      = 0;
   L.is_supercritical[v] = 0;
   L.is_extendible       = 0;
  } else if (e == 0) {
   L.critical_values.push(v);
   L.is_subcritical[v]   = 0;
   L.is_critical[v]      = 1;
   L.is_supercritical[v] = 0;
  } else {
   L.supercritical_values.push(v);
   L.is_subcritical[v]   = 0;
   L.is_critical[v]      = 0;
   L.is_supercritical[v] = 1;
  }
 }
 
 return L;
};

latin_rectangle.make_col_extension_problem = function() {
 this.col_extension_problem =
   matching_problem.from_eqs(this.row_gap);

 return this.col_extension_problem;
}

latin_rectangle.make_row_extension_problem = function() {
 var E,i;
 
 E = {};
 for (i = 0; i < this.q; i++) {
  E[this.col_label[i]] = this.col_gap[i]
 }

 this.row_extension_problem =
  matching_problem.from_eqs(E);

 return this.row_extension_problem;
};

//////////////////////////////////////////////////////////////////////

latin_rectangle.make_grid = function() {
 var p,q,x0,y0,x1,y1,w,h,g,i,j,k,s,t;
 
 p = this.p;
 q = this.q;
 
 x0 = this.grid_x0;
 y0 = this.grid_y0;
 w = this.grid_w;
 h = this.grid_h;
 
 g = {x0 : x0, y0 : y0, w : w, h : h};
 this.grid = g;
 
 g.square = {};
 g.text = {};
 g.col_label_text = {};
 g.svg = comb.svg.group();
 
 for (i = 0; i < p; i++) {
  g.square[i] = {};
  g.text[i] = {};
  
  for (j = 0; j < q; j++) {
   x1 = x0 + j * w;
   y1 = y0 + i * h;
   s = comb.svg.node('rect');
   s.setAttribute('stroke','grey');
   s.setAttribute('fill','white');
   s.setAttribute('stroke-width',1);
   s.setAttribute('x',x1);
   s.setAttribute('y',y1);
   s.setAttribute('width',w);
   s.setAttribute('height',h);
   g.svg.appendChild(s);
   g.square[i][j] = s;
   t = comb.svg.text(this.cell[i][j].value,
                     x1 + 0.5 * w, y1 + 0.5 * h);
   g.text[i][j] = t;
   g.svg.appendChild(t);

   this.cell[i][j].square = s;
   this.cell[i][j].text = t;
  }
 }

 for (j = 0; j < q; j++) { 
  s = comb.svg.text(this.col_label[j],x0 + (j + 0.5) * w, y0 - 0.3 * h);
  g.col_label_text[j] = s;
  g.svg.appendChild(s);
 }

 return this.grid;
}

//////////////////////////////////////////////////////////////////////

latin_rectangle.make_row_extension_grid = function() {
 var p,q,g,x1,y1,i,j,k,s,t,c;

 p = this.p;
 q = this.q;
 g = this.make_grid();

 g.row_ext_square = {};
 g.row_ext_text = {};
 g.row_option_tspan = {};
 
 y1 = g.y0 + p * g.h;

 for (i = 0; i < q; i++) {
  g.row_option_tspan[i] = {};
  
  x1 = g.x0 + i * g.w;
  s = comb.svg.rect(x1,y1,g.w,g.h,'grey',1);
  g.row_ext_square[i] = s;
  g.svg.append(s);

  t = comb.svg.text('',x1 + 0.5 * g.w,y1 + 0.7 * g.h);
  g.row_ext_text[i] = t;
  
  comb.svg.append_tspan(t,'\{');
  
  for (j = 0; j < this.col_gap[i].length; j++) {
   k = this.col_gap[i][j];
   if (j > 0) { comb.svg.append_tspan(t,','); }
   g.row_option_tspan[i][k] = comb.svg.append_tspan(t,k);
  }
  comb.svg.append_tspan(t,'\}');
  
  g.svg.append(g.row_ext_text[i]);
 }

 g.divider = comb.svg.hline(g.x0,g.x0 + this.q * g.w,g.y0 + this.p * g.h,
			    'blue',3);

 g.svg.appendChild(g.divider);
 
 return g;
}

//////////////////////////////////////////////////////////////////////


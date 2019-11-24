comb.flat = function(a) {
 var b = [];
 for (i = 0; i < a.length; i++) {
  b = b.concat(a[i]);
 }

 return b;
}

comb.bab = {};

comb.bab.vect = function(v) {
 if (Array.isArray(v)) {
  return new BABYLON.Vector3(v[0],v[1],v[2]);
 }

 if (('x' in v) && ('y' in v) && ('z' in v)) {
  return new BABYLON.Vector3(v.x,v.y,v.z);
 }

 if ((0 in v) && (1 in v) && (2 in v)) {
  return new BABYLON.Vector3(v[0],v[1],v[2]);
 }

 return new BABYLON.Vector3(0,0,0);
}

comb.bab.unvect = function(v) {
 if (Array.isArray(v)) {
  return [v[0],v[1],v[2]];
 }

 if (('x' in v) && ('y' in v) && ('z' in v)) {
  return [v.x,v.y,v.z];
 }

 if ((0 in v) && (1 in v) && (2 in v)) {
  return [v[0],v[1],v[2]];
 }

 return [0,0,0];
}

comb.bab.col0 = function(c) {
 if (Array.isArray(c)) { return c; }

 if (('r' in c) && ('g' in c) && ('b' in c)) {
  if ('a' in c) {
   return [c.r,c.g,c.b,c.a];
  } else {
   return [c.r,c.g,c.b,1];
  }
 }

 if ((0 in c) && (1 in c) && (2 in c)) {
  if (3 in c) {
   return [c[0],c[1],c[2],c[3]];
  } else {
   return [c[0],c[1],c[2],1];
  }
 }

 return [0,0,0,0];
}

comb.bab.col3 = function(c) {
 var c0 = comb.bab.col0(c);
 return new BABYLON.Color3(c0[0],c0[1],c0[2]);
}

comb.bab.col4 = function(c) {
 var c0 = comb.bab.col0(c);
 return new BABYLON.Color4(c0[0],c0[1],c0[2],c0[3]);
}


comb.bab.point = function(u,c,d,scene) {
 var col = this.col4(c);
 var mesh = BABYLON.MeshBuilder.CreateSphere("point", {diameter : d}, scene);
 comb.set_colour(mesh,c[0],c[1],c[2]);
 var p = this.vect(u);
 mesh.position = p;
 var q = mesh.position;
 return mesh;
}

comb.bab.line = function(u,v,c,scene) {
 var col = this.col4(c);
 var pts = [this.vect(u), this.vect(v)];
 var mesh = 
  BABYLON.MeshBuilder.CreateLines("line",
   {points : pts, colors : [col, col]}, scene);
 mesh.points = pts;
 return mesh;
}

comb.bab.triangle = function(u,v,w,c,scene) {
 var col = this.col4(c);
 var grid = new BABYLON.VertexData();
 grid.positions = comb.flat([this.unvect(u),this.unvect(v),this.unvect(w)]);
 grid.indices = [0,1,2];
 var mesh = new BABYLON.Mesh("triangle",scene);
 grid.applyToMesh(mesh);
 comb.set_colour(mesh,c[0],c[1],c[2]);
 return mesh;
}
 
comb.surface = {};
comb.surface.n = 48;
comb.surface.m = 48;
comb.surface.colour = {r : 0.5, g : 0.5, b : 1};

//////////////////////////////////////////////////////////////////////

comb.torus = Object.create(comb.surface);
comb.torus.name = 'torus';
comb.torus.R = 2;
comb.torus.r = 1;

comb.torus.embedding = function(t,u) {
 var tau = 2 * Math.PI;
 var cu = Math.cos(tau * u);
 var su = Math.sin(tau * u);
 var ct = Math.cos(tau * t);
 var st = Math.sin(tau * t);
 return [(this.R+this.r*cu)*ct,
	 this.r*su,
	 (this.R+this.r*cu)*st];
};

comb.torus.normal = function(t,u) {
 var tau = 2 * Math.PI;
 var cu = Math.cos(tau * u);
 var su = Math.sin(tau * u);
 var ct = Math.cos(tau * t);
 var st = Math.sin(tau * t);
 return [cu*ct,su,cu*st];
};

//////////////////////////////////////////////////////////////////////
comb.cylinder = Object.create(comb.surface);
comb.cylinder.name = 'cylinder';
comb.cylinder.r = 2;
comb.cylinder.h = 4;

comb.cylinder.embedding = function(t,u) {
 return [this.r * Math.cos(2 * Math.PI * t),
	 (u - 0.5) * this.h,
	 this.r * Math.sin(2 * Math.PI * t)];
};

comb.cylinder.normal = function(t,u) {
 return [Math.cos(2 * Math.PI * t),
	 0,
	 Math.sin(2 * Math.PI * t)];
};

//////////////////////////////////////////////////////////////////////
comb.sphere = Object.create(comb.surface);
comb.sphere.name = 'sphere';
comb.sphere.r = 3;

comb.sphere.normal = function(t,u) {
 var cu = Math.cos(2 * Math.PI * u);
 var su = Math.sin(2 * Math.PI * u);
 var ct = Math.cos(Math.PI * t);
 var st = Math.sin(Math.PI * t);
 return [st*cu, ct, st*su];
};

comb.sphere.embedding = function(t,u) {
 var x = this.normal(t,u);
 return [this.r * x[0], this.r * x[1], this.r * x[2]];
};

//////////////////////////////////////////////////////////////////////

comb.thick_curve = {};

comb.thick_curve.n = 48;
comb.thick_curve.colour = new BABYLON.Color4(1,0,0,1); // red
comb.thick_curve.radius = 0.03;

//////////////////////////////////////////////////////////////////////

comb.triangle = {
 v : [[1,0,0],[0,0,1],[0,1,0]]
};

//////////////////////////////////////////////////////////////////////
comb.basic_scene = function(engine,canvas) {
 var scene = new BABYLON.Scene(engine);
 scene.clearColor = BABYLON.Color3.White();
 
 var light = new BABYLON.HemisphericLight("light0", new BABYLON.Vector3(-1, 1, 0), scene);
 light.diffuse     = new BABYLON.Color3(0.6, 0.4, 0.4);
 light.specular    = new BABYLON.Color3(0.2, 0.5, 0.4);
 light.groundColor = new BABYLON.Color3(0.6, 0.7, 0.8);

 var camera = new BABYLON.ArcRotateCamera("camera1",  0, 1.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
 camera.attachControl(canvas, true);
 camera.wheelPrecision = 50;

 scene.camera = camera;
 return scene;
};

comb.set_colour = function(mesh,r,g,b) {
 var mat = new BABYLON.StandardMaterial("mat", mesh.getScene());
 mat.backFaceCulling = false;
 mat.diffuseColor  = new BABYLON.Color3(r,g,b);
 mesh.material = mat;
 mesh.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
}

comb.make_grid_with_normal = function(n,m,f,g) {
 var i,j,t,u,x,positions,indices,normals,grid;
 
 positions = [];
 indices = [];
 normals = [];
 
 for (i = 0; i <= n; i++) {
  for (j = 0; j <= m; j++) {
   t = (i * 1.)/n;
   u = (j * 1.)/m;
   x = f(t,u);
   positions.push(x[0],x[1],x[2]);
   if (g) {
    v = g(t,u);
    normals.push(v[0],v[1],v[2]);
   }
   if (i < n && j < m) {
    i1 = (i + 1);
    j1 = (j + 1);
    k0 = (m + 1) * i  + j;
    k1 = (m + 1) * i1 + j;
    k2 = (m + 1) * i  + j1;
    k3 = (m + 1) * i1 + j1;
    indices.push(k0,k1,k3,k0,k3,k2);
//    indices.push(k0,k3,k1,k0,k2,k3);
   }
  }
 }

 if (!g) {
  BABYLON.VertexData.ComputeNormals(positions, indices, normals);
 }
 
 var grid = new BABYLON.VertexData();
 grid.positions = positions;
 grid.normals   = normals;
 grid.indices   = indices;

 return grid;
}

comb.make_grid = function(n,m,f) {
 return this.make_grid_with_normal(n,m,f,null);
}

//////////////////////////////////////////////////////////////////////

comb.surface.make_mesh = function(scene) {
 var f,g,i,j,t,u,c;
 var me = this;

 f = function(t,u) { return me.embedding(t,u); };
 if (this.normal) {
  g = function(t,u) { return me.normal(t,u); };
 } else {
  g = null;
 }

 this.scene = scene;
 this.mesh = new BABYLON.Mesh(this.name, scene);
 if (! this.normal) { this.normal = null; }
 this.grid = 
  comb.make_grid_with_normal(this.n,this.m,f,g);

 this.grid.applyToMesh(this.mesh,true);

 if (this.colour_function) {
  this.cols = [];
  for (i = 0; i <= this.n; i++) {
   for (j = 0; j <= this.m; j++) {
    t = (i * 1.)/this.n;
    u = (j * 1.)/this.m;
    c = this.colour_function(t,u);
    this.cols.push(c[0],c[1],c[2],c[3]);
   }
  }
  this.mesh.hasVertexAlpha = true;
  this.mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, this.cols);
 } else {
  comb.set_colour(this.mesh,this.colour.r,this.colour.g,this.colour.b);
 }
}

//////////////////////////////////////////////////////////////////////

comb.surface.update_mesh = function() {
 var f,g;
 var me = this;

 f = function(t,u) { return me.embedding(t,u); };
 if (this.normal) {
  g = function(t,u) { return me.normal(t,u); };
 } else {
  g = null;
 }

 this.grid = comb.make_grid_with_normal(this.n,this.m,f,g);
 this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.grid.positions);
 this.mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, this.grid.normals);
}

//////////////////////////////////////////////////////////////////////

comb.thick_curve.make_mesh = function(scene) {
 var f,i,x,y,mat,positions;
 var me = this;

 this.scene = scene;

 f = function(t) { return me.embedding(t); };

 positions = [];
 for (i = 0; i <= this.n; i++) {
  x = f((i * 1.)/this.n);
  y = new BABYLON.Vector3(x[0],x[1],x[2]);
  positions.push(y);
 }

 this.mesh = BABYLON.MeshBuilder.CreateTube(this.name, {path: positions, radius: this.radius}, scene);

 mat = new BABYLON.StandardMaterial("mat", scene);
 mat.diffuseColor  = this.colour;
 this.mesh.material = mat;
}

//////////////////////////////////////////////////////////////////////

comb.triangle.make_mesh = function(scene) {
 this.scene = scene;
 var grid = new BABYLON.VertexData();
 grid.positions = comb.flat(this.v);
 grid.indices = [0,1,2];
 this.mesh = new BABYLON.Mesh(this.name,scene);
 grid.applyToMesh(this.mesh);
}


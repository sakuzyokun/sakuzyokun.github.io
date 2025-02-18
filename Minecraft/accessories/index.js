window.onbeforeunload=function(){return "saved your stuff. if you saved then good"}

var canvas = document.getElementById("pjs-cnv");
var faceList = document.getElementById("faces")
var editFace = document.getElementById("editFace")
var result = document.getElementById("result")

var width = innerWidth * 0.7
var height = innerHeight
var size = Math.min(width, height)

function sketchProc(p) {
  window.p = p
  p.mouseDragged = mouseDragged
  p.mouseClicked = mouseClicked
  var g = p.createGraphics(width, height, p.P3D)
  window.g = g
  g.pRotateX = g.rotateX
  g.pRotateY = g.rotateY
  g.pRotateZ = g.rotateZ
  g.rotateX = function(d){g.pRotateX(g.radians(d))}
  g.rotateY = function(d){g.pRotateY(g.radians(d))}
  g.rotateZ = function(d){g.pRotateZ(g.radians(d))}
  g.translate(width/2, height/2)
  var s = size/100
  g.scale(s,s,s)

  var drawAmount = 0
  p.draw = function(){
    drawAmount ++
    draw()
    if(drawAmount >= 2)p.noLoop()
  }
}

var processingInstance = new Processing(canvas, sketchProc);
processingInstance.size(width, height)

var settings = {
  lines: true,
  selectFace:false
}

function impFaces(str){
  str = str.replace(/objectify\(([^)]*)\)/g, "[$1]")
  var arr = Object.constructor("return "+str)()

  var obj = {}
  obj.bottom = arr[0]
  obj.top = arr[1]
  obj.north = arr[2]
  obj.south = arr[3]
  obj.west = arr[5]
  obj.east = arr[4]
  faces = obj
  updateFaceLists()
}
var faces = {/*
  bottom: [[0,  0,  0, 16, 16, 0, 0]],
  top: [[0, 16, 16, 16, 16, 0, 0]],
  north: [[16, 16, 16, 16, 16, 0, 0]],
  south: [[0, 16,  0, 16, 16, 0, 0]],
  east: [[16, 16,  0, 16, 16, 0, 0]],
  west: [[0, 16, 16, 16, 16, 0, 0]]//*/
/*
  bottom: [[0,  0,  0, 16, 16, 0, 0]],
  top: [[0, 8, 16, 16, 16, 0, 0]],
  north: [[16, 8, 16, 16, 8, 0, 0]],
  south: [[0, 8,  0, 16, 8, 0, 0]],
  east: [[16, 8,  0, 16, 8, 0, 0]],
  west: [[0, 8, 16, 16, 8, 0, 0]]//*/
//*
  bottom: [[0, 0,  0, 16, 16, 0, 0]],
  top: [[0, 8,  8, 16, 8, 0, 8],[0, 16,  16, 16, 8, 0, 0]],
  north: [[16, 16, 16, 16, 16, 0, 0]],
  south: [[0, 8,  0, 16, 8, 0, 0],[0, 16,  8, 16, 8, 0, 0]],
  east: [[16, 8, 0, 8, 8, 8, 0], [16, 16, 8, 8, 16, 0, 0]],
  west: [[0, 8, 8, 8, 8, 0, 0],[0, 16, 16, 8, 16, 8, 0]]//*/
}
impFaces(`[
				[objectify(6, 0, 6, 4, 4, 0, 1),objectify(10, 12, 7, 6, 2, 0, 2),objectify(10, 6, 7, 6, 2, 0, 2)], //bottom
				[objectify(6, 16, 10, 4, 4, 0, 1),objectify(10, 15, 9, 6, 2, 0, 2),objectify(10, 9, 9, 6, 2, 0, 2)], //top
				[objectify(10, 16, 10, 4, 16, 6, 0),objectify(16, 15, 9, 6, 3, 6, 0),objectify(16, 9, 9, 6, 3, 6, 0)], //north
				[objectify(6, 16, 6, 4, 16, 6, 0),objectify(10, 15, 7, 6, 3, 6, 0),objectify(10, 9, 7, 6, 3, 6, 0)], //south
				[objectify(10, 16, 6, 4, 16, 6, 0)], //east
				[objectify(6, 16, 10, 4, 16, 6, 0)]  //west
			]`)

function updateFaceList(n){
  var str=""
  faces[n].forEach((face, i) => {
    str+="<li id='"+n+"Face"+i+"' onmousemove='hoverFace(\""+n+"\","+i+")' onclick='selectFace(\""+n+"\","+i+",this)'>"
    str += "x:"+face[0]+" y:"+face[1]+" z:"+face[2]+" "
    str += face[3]+"&times;"+face[4]
    str+="</li>"
  })
  document.getElementById(n+"Faces").innerHTML = str
}
function updateFaceLists(){
  for(var i in faces){
    updateFaceList(i)
  }
}

var selectedFace = {
  dir: "",
  idx: 0,
  face:null,
  id:"",
  hoverDir: "",
  hoverIdx: 0
}
function hoverFace(dir, i){
  if(selectedFace.hoverDir !== dir || selectedFace.hoverIdx !== i){
    selectedFace.hoverDir = dir
    selectedFace.hoverIdx = i
    draw()
  }
}
faceList.onmouseleave = function(){
  selectedFace.hoverDir = ""
  draw()
}
editFace.style.display = "none"
function selectFace(dir, i, el){
  el = el || document.getElementById(dir+"Face"+i)
  selectedFace.id = el.id
  if(selectedFace.dir !== dir || selectedFace.idx !== i){
    selectedFace.dir = dir
    selectedFace.idx = i
    selectedFace.face = faces[dir][i]
    var s = document.querySelector("#faces .selected")
    if(s)s.classList.remove("selected")
    el.classList.add("selected")

    editFace.style.display = ""
    document.getElementById("faceX").value = selectedFace.face[0]
    document.getElementById("faceY").value = selectedFace.face[1]
    document.getElementById("faceZ").value = selectedFace.face[2]
    document.getElementById("faceW").value = selectedFace.face[3]
    document.getElementById("faceH").value = selectedFace.face[4]
    document.getElementById("texX").value = selectedFace.face[5]
    document.getElementById("texY").value = selectedFace.face[6]
    draw()
  }else{
    selectedFace.dir = ""
    el.classList.remove("selected")
    editFace.style.display = "none"
  }
}
function unselectFace(dir,i){
  selectedFace.dir = ""
  document.getElementById(dir+"Face"+i).classList.remove("selected")
  editFace.style.display = "none"
}

function newFace(){
  var dir = document.getElementById("newFaceDir").value
  faces[dir].push([
    0,0,0,10,10,0,0
  ])
  updateFaceLists()
  selectFace(dir, faces[dir].length-1)
  draw()
}
function editTheFace(i, value){
  selectedFace.face[i] = parseFloat(value)
  updateFaceLists()
  document.getElementById(selectedFace.id).classList.add("selected")
  draw()
}
function deleteFace(){
  var dir = selectedFace.dir
  unselectFace(dir, selectedFace.idx)
  faces[dir].splice(selectedFace.idx, 1)
  updateFaceLists()
  draw()
}
function clearFaces(){
  if(selectedFace.dir)unselectFace(selectedFace.dir, selectedFace.idx)
  for(var i in faces){
    var arr = faces[i]
    arr.splice(0, arr.length)
  }
  updateFaceLists()
  draw()
}
function getShape(){
  var str="[\n"
  function getFaces(dir){
    var str2 = "["
    faces[dir].forEach(v => {
      str2 += "objectify("+v.join(",")+"),"
    })
    if(faces[dir].length)str2 = str2.substring(0,str2.length-1)//remove trailing comma
    str2 += "],"
    str += "\t"+str2+"\n"
  }
  getFaces("bottom")
  getFaces("top")
  getFaces("north")
  getFaces("south")
  getFaces("east")
  getFaces("west")
  str = str.substring(0,str.length-2)//remove trailing comma and line break
  str += "\n" //readd line break
  str += "]"
  result.value = str
}
function getIcon(){
  var p = isometricProject
  var str = "new Float32Array(["
  function getFaces(dir){
    var str2 = ""
    faces[dir].forEach(v => {
      var x=v[0], y=v[1], z=v[2], w=v[3], h=v[4]
      str2 += p(x,y,z).join(",")+","
      str2 += "0,0,"
      if(dir === "top"){
        str2 += p(x+w,y,z).join(",")+","
        str2 += "1,0,"
        str2 += p(x+w,y,z+h).join(",")+","
        str2 += "1,1,"
        str2 += p(x,y,z+h).join(",")+","
        str2 += "0,1,"
      }else if(dir === "south"){
        str2 += p(x+w,y,z).join(",")+","
        str2 += "1,0,"
        str2 += p(x+w,y+h,z).join(",")+","
        str2 += "1,1,"
        str2 += p(x,y+h,z).join(",")+","
        str2 += "0,1,"
      }else{
        str2 += p(x,y,z+w).join(",")+","
        str2 += "1,0,"
        str2 += p(x,y+h,z+w).join(",")+","
        str2 += "1,1,"
        str2 += p(x,y+h,z).join(",")+","
        str2 += "0,1,"
      }
    })
    str2 = str2.substring(0,str2.length-1)//remove trailing comma
    str += "\t"+str2+"\n"
  }
  getFaces("top")
  getFaces("south")
  getFaces("west")
  str += "])"
  result.value = str
}

function fillIfSelected(dir, i){
  if(selectedFace.hoverDir === dir && selectedFace.hoverIdx === i){g.fill(140,140,255)}else if(selectedFace.dir === dir && selectedFace.idx === i){g.fill(255,0,0)}else g.fill(240)
}
function drawFaces(){
  g.strokeWeight(1)
  g.stroke(0)
  var i, face
  g.translate(-8,8,-8)
  for(i=0; i<faces.bottom.length; i++){
    face = faces.bottom[i]
    fillIfSelected("bottom",i)
    g.translate(face[0], -face[1], face[2])
    g.rotateX(90)
    g.rect(0,0, face[3],face[4])
    g.rotateX(-90)
    g.translate(-face[0], face[1], -face[2])
  }
  for(i=0; i<faces.top.length; i++){
    face = faces.top[i]
    fillIfSelected("top",i)
    g.translate(face[0], -face[1], face[2])
    g.rotateX(-90)
    g.rect(0,0, face[3],face[4])
    g.rotateX(90)
    g.translate(-face[0], face[1], -face[2])
  }
  for(i=0; i<faces.north.length; i++){
    face = faces.north[i]
    fillIfSelected("north",i)
    g.translate(face[0], -face[1], face[2])
    g.rotateY(180)
    g.rect(0,0, face[3],face[4])
    g.rotateY(-180)
    g.translate(-face[0], face[1], -face[2])
  }
  for(i=0; i<faces.south.length; i++){
    face = faces.south[i]
    fillIfSelected("south",i)
    g.translate(face[0], -face[1], face[2])
    g.rect(0,0, face[3],face[4])
    g.translate(-face[0], face[1], -face[2])
  }
  for(i=0; i<faces.east.length; i++){
    face = faces.east[i]
    fillIfSelected("east",i)
    g.translate(face[0], -face[1], face[2])
    g.rotateY(-90)
    g.rect(0,0, face[3],face[4])
    g.rotateY(90)
    g.translate(-face[0], face[1], -face[2])
  }
  for(i=0; i<faces.west.length; i++){
    face = faces.west[i]
    fillIfSelected("west",i)
    g.translate(face[0], -face[1], face[2])
    g.rotateY(90)
    g.rect(0,0, face[3],face[4])
    g.rotateY(-90)
    g.translate(-face[0], face[1], -face[2])
  }
  g.translate(8,-8,8)
}
function mouseDragged(){
  rotY += p.mouseX - p.pmouseX
  rotX -= p.mouseY - p.pmouseY

  if(rotY > 360) rotY -= 360
  if(rotY < 0) rotY += 360
  if(rotX > 90) rotX = 90
  if(rotX < -90) rotX = -90

  draw()
}

var colorId
var faceObj = {}
function faceColorId(side, i){
  colorId ++
  g.fill(colorId)
  faceObj[colorId] = {side:side,i:i}
}
function mouseClicked(){
  if(settings.selectFace){
    //render all faces with color id (id represented in color)
    colorId = -1
    for(var f in faceObj) delete faceObj[f]
    var i, face
    g.background(255,255,255)
    g.strokeWeight(0)
    g.rotateX(rotX)
    g.rotateY(rotY)
    g.translate(-8,8,-8)
    for(i=0; i<faces.bottom.length; i++){
      face = faces.bottom[i]
      faceColorId("bottom",i)
      g.translate(face[0], -face[1], face[2])
      g.rotateX(90)
      g.rect(0,0, face[3],face[4])
      g.rotateX(-90)
      g.translate(-face[0], face[1], -face[2])
    }
    for(i=0; i<faces.top.length; i++){
      face = faces.top[i]
      faceColorId("top",i)
      g.translate(face[0], -face[1], face[2])
      g.rotateX(-90)
      g.rect(0,0, face[3],face[4])
      g.rotateX(90)
      g.translate(-face[0], face[1], -face[2])
    }
    for(i=0; i<faces.north.length; i++){
      face = faces.north[i]
      faceColorId("north",i)
      g.translate(face[0], -face[1], face[2])
      g.rotateY(180)
      g.rect(0,0, face[3],face[4])
      g.rotateY(-180)
      g.translate(-face[0], face[1], -face[2])
    }
    for(i=0; i<faces.south.length; i++){
      face = faces.south[i]
      faceColorId("south",i)
      g.translate(face[0], -face[1], face[2])
      g.rect(0,0, face[3],face[4])
      g.translate(-face[0], face[1], -face[2])
    }
    for(i=0; i<faces.east.length; i++){
      face = faces.east[i]
      faceColorId("east",i)
      g.translate(face[0], -face[1], face[2])
      g.rotateY(-90)
      g.rect(0,0, face[3],face[4])
      g.rotateY(90)
      g.translate(-face[0], face[1], -face[2])
    }
    for(i=0; i<faces.west.length; i++){
      face = faces.west[i]
      faceColorId("west",i)
      g.translate(face[0], -face[1], face[2])
      g.rotateY(90)
      g.rect(0,0, face[3],face[4])
      g.rotateY(-90)
      g.translate(-face[0], face[1], -face[2])
    }
    g.translate(8,-8,8)
    g.rotateY(-rotY)
    g.rotateX(-rotX)
    if(colorId >= 255) { //the background is white so 255 won't work
      alert("You need 255 or less faces to select faces")
      return
    }
    var pix = g.get(p.mouseX,g.height-p.mouseY,1,1).imageData.data
    var faceId = faceObj[pix[0]]
    if(!faceId) return
    selectFace(faceId.side,faceId.i)
  }
}

function line(x,y,z,x2,y2,z2){
  g.beginShape()
  g.vertex(x,y,z)
  g.vertex(x2,y2,z2)
  g.endShape()
}
function text(x,y,z,text, rx,ry){
  g.noFill()
  g.translate(x,y,z)
  g.rotateX(rx)
  g.rotateZ(ry)
  g.text(text,0,0,0)
  g.rotateZ(-ry)
  g.rotateX(-rx)
  g.translate(-x,-y,-z)
}
var rotX = -45
var rotY = 45
function draw(){
  g.background(255)
  g.rotateX(rotX)
  g.rotateY(rotY)

  if(settings.lines){
    g.noFill()
    g.stroke(255,0,0)
    g.strokeWeight(1)
    line(0,0,-50,0,0,50)
    line(0,-50,0,0,50,0)
    line(-50,0,0,50,0,0)
    g.stroke(0,0,255)
    g.box(16)
  }
  
  g.strokeWeight(4)
  drawFaces()

  g.fill(0,0,0)
  text(0,0,50,"North", 90, 180)

  g.rotateY(-rotY)
  g.rotateX(-rotX)
  p.externals.context.drawImage(g.externals.canvas, 0, 0)
}

//isometric porjection below is from https://stackoverflow.com/a/44850035
//it's also trimmed down by me
const P3 = (x = 0, y = 0, z = 0) => ({x,y,z});
const P2 = (x = 0, y = 0) => ({ x, y});
const D2R = (ang) => (ang-90) * (Math.PI/180 );
const Ang2Vec = (ang,len = 1) => P2(Math.cos(D2R(ang)) * len,Math.sin(D2R(ang)) * len);
const isometric = {
  xAxis : Ang2Vec(120) ,
  yAxis : Ang2Vec(-120) ,
  zAxis : Ang2Vec(0) ,
}

const axoProjMat = {
  xAxis : P2(1 , 0.5) ,
  yAxis :  P2(-1 , 0.5) ,
  zAxis :  P2(0 , -1) ,
  depth :  P3(0.5,0.5,1) , // projections have z as depth
  origin : P2(0,0), // (0,0) default 2D point
  setProjection(p){
    Object.keys(p).forEach(key => {
      this[key]=p[key];
    })
    if(!p.depth){
      this.depth = P3(
        this.xAxis.y,
        this.yAxis.y,
        -this.zAxis.y
      );
    }
  },
  project (p, retP = P3()) {
    p.x -= 8
    p.y -= 8
    p.z -= 8
    p.x /= 8
    p.y /= 8
    p.z /= 8
    retP.x = p.x * this.xAxis.x + p.y * this.yAxis.x + p.z * this.zAxis.x + this.origin.x;
    retP.y = p.x * this.xAxis.y + p.y * this.yAxis.y + p.z * this.zAxis.y + this.origin.y;
    retP.z = p.x * this.depth.x + p.y * this.depth.y + p.z * this.depth.z; 
    return [retP.x,retP.y,retP.z];
  }
}
axoProjMat.setProjection(isometric);

function isometricProject(x,y,z){
  return axoProjMat.project({x,y,z})
}
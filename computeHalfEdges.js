const edgeLoop = require('./edgeLoop.js')

function computeHalfEdges(faces) {
  var halfEdges = [];

  faces.forEach(function(face, faceIndex) {
    face.halfEdges = [];
    face.forEach(function(vertexIndex, i) {
      var v0 = vertexIndex;
      var v1 = face[(i + 1) % face.length];
      var halfEdge = {
        edgeIndex: halfEdges.length,
        face: face,
        faceIndex: faceIndex,
        //vertexIndex: vertexIndex,
        slot: i,
        opposite: null,
        v0: Math.min(v0, v1),
        v1: Math.max(v0, v1)
      };
      face.halfEdges.push(halfEdge);
      halfEdges.push(halfEdge);
    });
  });

  halfEdges.sort(function(a, b) {
    if (a.v0 > b.v0) return 1;
    else if (a.v0 < b.v0) return -1;
    else if (a.v1 > b.v1) return 1;
    else if (a.v1 < b.v1) return -1;
    else return 0;
  });

  for(var i=1; i<halfEdges.length; i++) {
    var prev = halfEdges[i-1];
    var curr = halfEdges[i];
    if (prev.v0 == curr.v0 && prev.v1 == curr.v1) {
      prev.opposite = curr;
      curr.opposite = prev;
    }
  }

  //fix edge vertex order by starting first edge
  //with the same vertex as face itself which is quaranteed to be CCW
  //this might have changed as we assign min/max indices for sorting above
  halfEdges.forEach((e, i) => { e.visited = false })

  faces.forEach((face) => {
    var firstEdge = face.halfEdges[0]
    if (firstEdge.v0 !== face[0]) {
    	var tmp = firstEdge.v0
      firstEdge.v0 = firstEdge.v1
      firstEdge.v1 = tmp
    }
    var edge = firstEdge
    var prevE = edge
    edgeLoop(edge, (e, i) => {
     if (i > 0 && prevE.v1 !== e.v0) {
       var tmp = e.v0
       e.v0 = e.v1
       e.v1 = tmp
     }
     prevE = e
   })
  })
  halfEdges.forEach((e, i) => { e.visited = false })

  return halfEdges;
}

module.exports = computeHalfEdges;

import * as THREE from 'three';
// import 'three';
class Utils {

  constructor ( dimDiv ) {
    this.dimDiv = dimDiv;
  }

  static scaleParams( args, dimDiv ) {
      for (var i = 0; i < args.length; i++ ) {
        if ( args[i] instanceof Array ) {
            for (let j = 0; j < args[i].length; j++ )
              [args[i][j]] = VesselUtils.scaleParams( [args[i][j]], dimDiv );
        } else if ( args[i] instanceof Object ) {
          for ( var property in args[i] )
            if ( args[i].hasOwnProperty(property) && !( args[i][property] instanceof Boolean ) && !( property.search('num') != -1 || property.search('Angle') != -1 || property.search('Type') != -1 ) )
              [args[i][property]] = VesselUtils.scaleParams( [args[i][property]], dimDiv );//= dimDiv;
        } else {
          args[i] /= dimDiv;
        }
      }
      return args;
  }

  static printInfo( args ) {
    var string = '';
    for (var property in args) {
      string += property + ' : '
      if ( args[property] instanceof Array ) {
          string += ' [ ';
          for (let i = 0; i < args[property].length; i++ ) {
            string += args[property][i] + (i < args[property].length - 1 ? ',' : '') + ' ';
          }
          string += ']\n';
      } else if ( args[property] instanceof Object ) {
        string += ''
        for (var property2 in args[property])
          if (args[property].hasOwnProperty(property2)) {
            string += '\n\t' + property2 + ' : ' + args[property][property2];
          }
        string += '\n';
      } else {
        string += args[property] + '\n';
      }
    }
    return string;
  }

  static mergeGroupChildren( array, aGroup, matArray ) {
    // console.log('aGroup', aGroup);
    if (!aGroup.children) {
        // console.log('isGeometry');
            var tempGeo = aGroup.clone();
            for (var j = 0; j < matArray.length; j++) {
                var str = matArray[j][6].split('');
                for (var k = 0; k < 3; k++) {
                    switch (str[k]) {
                    case 'X':
                        tempGeo.rotateX(matArray[j][0]);
                        break;
                    case 'Y':
                        tempGeo.rotateY(matArray[j][1]);
                        break;
                    case 'Z':
                        tempGeo.rotateZ(matArray[j][2]);
                    }
                }
                tempGeo.translate(matArray[j][3], matArray[j][4], matArray[j][5]);
            }
        array.push(tempGeo.clone().toNonIndexed());
        return;
    }
    for (var i = 0; i < aGroup.children.length;i++) {
        // console.log('aGroup', aGroup.children[i]);
        if ( aGroup.children[i].isMesh ) {
            // console.log('isMesh', aGroup.children[i].geometry, aGroup.children[i].children);
            matArray.unshift([aGroup.children[i].rotation.x, aGroup.children[i].rotation.y, aGroup.children[i].rotation.z,
                aGroup.children[i].position.x, aGroup.children[i].position.y, aGroup.children[i].position.z ,aGroup.children[i].rotation.order]);
            Utils.mergeGroupChildren( array, aGroup.children[i].geometry, matArray );
        } else {
            // Save the children's transform
            matArray.unshift([aGroup.children[i].rotation.x, aGroup.children[i].rotation.y, aGroup.children[i].rotation.z,
                            aGroup.children[i].position.x, aGroup.children[i].position.y, aGroup.children[i].position.z ,aGroup.children[i].rotation.order]);
            // Recursive Call	on Group's children
            Utils.mergeGroupChildren( array, aGroup.children[i], matArray );

        }
    }
}

}

export default {Utils};

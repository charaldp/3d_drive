import * as THREE from 'three';
import {mergeBufferGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils';

class Construction
{
    static road(rotation_point, road_width, sign, angle, line_width, road_material, line_material)
    {
        // rotation_point = 0 means that the road's curvature will be made around a point right at the side of the road (e.g. for a direct turn)
        let numberOfPoints = Math.ceil(128 * angle / Math.PI);
        let radiusToCenter = rotation_point + road_width / 2;
        let points = [new THREE.Vector2(sign * (rotation_point + road_width), 0), new THREE.Vector2(sign * rotation_point, 0)];
        let roadLathe = new THREE.LatheGeometry(points, numberOfPoints, 0, angle)
        let pointsLineIn = [new THREE.Vector2(sign * (radiusToCenter - 1.5  * line_width + line_width / 2), 0), new THREE.Vector2(sign * (radiusToCenter - 1.5  * line_width - line_width / 2), 0)];
        let lineInLathe = new THREE.LatheGeometry(pointsLineIn, numberOfPoints, 0, angle);
        let pointsLineOut = [new THREE.Vector2(sign * (radiusToCenter + 1.5  * line_width + line_width / 2), 0), new THREE.Vector2(sign * (radiusToCenter + 1.5  * line_width - line_width / 2), 0)];
        let lineOutLathe = new THREE.LatheGeometry(pointsLineOut, numberOfPoints, 0, angle);
        let lineCurves = mergeBufferGeometries([
            lineInLathe,
            lineOutLathe,
        ])
        let transformationNext = new THREE.Matrix4();
        transformationNext.setPosition( new THREE.Vector3(0, 0, - sign * radiusToCenter) );
        transformationNext.multiply((new THREE.Matrix4()).makeRotationY( sign * angle ));
        if (sign == -1) {
            roadLathe.rotateY( - angle);
            lineCurves.rotateY( - angle);
        }
        roadLathe.translate(0, 0.05 * line_width, - sign * radiusToCenter);
        lineCurves.translate(0, 0.1 * line_width, - sign * radiusToCenter);
        transformationNext.multiply((new THREE.Matrix4()).setPosition( new THREE.Vector3(0, 0, sign * radiusToCenter)));
        return {
            roadCurve: roadLathe,
            lineCurves: lineCurves,
            transformationNext: transformationNext,
        };
    }
}

export default {Construction};


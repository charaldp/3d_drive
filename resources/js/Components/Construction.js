import * as THREE from 'three';

class Construction
{
    static road(rotation_point, road_width, sign, angle, line_width, road_material, line_material)
    {
        // rotation_point = 0 means that the road's curvature will be made around a point right at the side of the road (for a direct turn)
        let points = [new THREE.Vector2(sign * (rotation_point + road_width), 0), new THREE.Vector2(sign * rotation_point, 0)];
        let roadLathe = new THREE.LatheGeometry(points, 64, 0, angle).translate(0, 0, - sign * (road_width / 2 + rotation_point));
        let pointsLineIn = [new THREE.Vector2(sign * (rotation_point + road_width / 2  - 1.5  * line_width + line_width / 2), 0), new THREE.Vector2(sign * (rotation_point + road_width / 2  - 1.5  * line_width - line_width / 2), 0)];
        let lineInLathe = new THREE.LatheGeometry(pointsLineIn, 64, 0, angle).translate(0, 0, - sign * (road_width / 2 + rotation_point));
        let pointsLineOut = [new THREE.Vector2(sign * (rotation_point + road_width / 2  + 1.5  * line_width + line_width / 2), 0), new THREE.Vector2(sign * (rotation_point + road_width / 2  + 1.5  * line_width - line_width / 2), 0)];
        let lineOutLathe = new THREE.LatheGeometry(pointsLineOut, 64, 0, angle).translate(0, 0, - sign * (road_width / 2 + rotation_point));
        return [roadLathe, lineInLathe, lineOutLathe];
    }
}

export default {Construction};


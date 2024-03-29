<?php
namespace App\Models\Vehicle;

use App\Models\Vehicle\Vehicle;

class Motorbike extends Vehicle
{

    protected $table = 'motorbikes';

    protected $fillable = [
        'bounding_box',
    ];

    protected $spatialFields = [
        'body_points',
        'wheel_center_positions'
    ];



    public static $vehicle_example = "{
        \"vehicles\" : [{
          \"type\" : \"Motorbike\",
          \"components\" : {
            \"wheel\" : [{
              \"DO\" : 0.5,
              \"DI\" : 0.43,
              \"t\" : 0.15,
              \"tireType\" : \"Round\",
              \"tireDims\" : {
                \"DI\" : 0.43,
                \"intrWidth\" : 0.15,
                \"numPoints\" : 16
              },
              \"rimType\" : \"Ribs\",
              \"rimDims\" : {
                \"DO\": 0.43,
                \"DI\": 0.4,
                \"t\": 0.15,
                \"intrWidth\":  0.022,
                \"numRibs\": 12,
                \"tRib\": 0.015,
                        \"dRib\": 0.030,
                \"ribsPosition\": 0.12,
                \"axleIntrWidth\": -0.01,
                \"axleDI\": 0.01 ,
                \"axleDO\": 0.08,
                \"tAxle\": 0.02
              },
              \"pressure\" : 0.04,
              \"frictionOptions\" : {
                \"static\" : 1,
                \"sliding\" : 0.8,
                \"rolling\" : 0.01
              },
              \"meshMaterial\" : {
                \"rimMaterialType\" : \"MeshPhysicalMaterial\",
                \"tire\" : {
                  \"colour\": \"0xd7d7d7\",
                  \"roughness\": 0.17,
                  \"metalness\": 0.47,
                  \"reflectivity\": 1,
                  \"clearCoat\": 0.64,
                  \"clearCoatRoughness\": 0.22
                },
                \"tireMaterialType\" : \"MeshPhongMaterial\",
                \"rim\" : {
                  \"shininess\": 50,
                  \"colour\" : \"0x1b1b1b\"
                }
              }
            }],
            \"engine\" : {
              \"shaft_inertia\" : 50,
              \"rev_limit\" : 116.66,
              \"idle_rot\" : 17.5,
              \"maximum_hp\" : 390
            },
            \"clutch\" : {
              \"clutchFrictionCoeff\" : 0
            },
            \"transmission\" : {
              \"gearbox\" : [ -0.15, 0.163, 0.262, 0.38, 0.52, 0.68, 0.87 ]
            }
          },
          \"mass\" : 2000,
          \"geometry\" : {
            \"creationType\" : \"points2D\",
            \"pointArray\" : [
                [0.958, 0],
                [0.958, 0.03],
                [0.951, 0.08],
                [0.94, 0.12],
                [0.928, 0.15],
                [0.912, 0.18],
                [0.894, 0.202],
                [0.84, 0.25],
                [0.8, 0.275],
                [0.72, 0.308],
                [0.67, 0.321],
                [0.5, 0.7],
                [0.49, 0.696],
                [0.577, 0.48],
                [0.43, 0.37],
                [0.34, 0.43],
                [0.26, 0.46],
                [0.19, 0.47],
                [0.09, 0.465],
                [0.01, 0.45],
                [-0.05, 0.43],
                [-0.1, 0.4],
                [-0.81, 0.4],
                [-0.81, 0.32],
                [-0.83, 0.29],
                [-0.87, 0.25],
                [-0.903, 0.21],
                [-0.918, 0.18],
                [-0.931, 0.15],
                [-0.94, 0.12],
                [-0.951, 0.08],
                [-0.958, 0.03],
                [-0.958, 0]
            ],
            \"wheelsCentersPositions\" :  [ [ -0.675, -0.075 ], [ 0.675, -0.075 ] ],
            \"radius\" : 0.27,
            \"width\" : 0.2,
            \"bevelThickness\" : 0.005
          },
          \"spawnPosition\" : {
            \"position\" : [ 0, 0, 0 ],
            \"rotation\" : 0
          }
        }]
      }
      ";
}

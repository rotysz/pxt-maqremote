/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */
const INIT_GROUP = 2

namespace RobotImp {
    export function MotorLeft(SpeedVal: number) {
        if (SpeedVal >= 0) maqueen.MotorRun(maqueen.aMotors.M1, maqueen.Dir.CW, SpeedVal)
        else maqueen.MotorRun(maqueen.aMotors.M1, maqueen.Dir.CCW, -SpeedVal)
    }

    export function MotorRight(SpeedVal: number) {
        if (SpeedVal >= 0) maqueen.MotorRun(maqueen.aMotors.M2, maqueen.Dir.CW, SpeedVal)
        else maqueen.MotorRun(maqueen.aMotors.M2, maqueen.Dir.CCW, -SpeedVal)
    }

    export function GetDistance(): number {
        return maqueen.sensor(PingUnit.Centimeters);
    }
    
    export function LineSensorStatus(): number {
        let Line1Sensor = maqueen.readPatrol(maqueen.Patrol.PatrolLeft)
        let Line2Sensor = maqueen.readPatrol(maqueen.Patrol.PatrolRight)
        return Line1Sensor + Line2Sensor * 10
    }
   
   export function Init() {
     basic.pause(1000)
   }

   export function FollowTheLine() {
       let Sens = RobotImp.LineSensorStatus()
       do {
           Sens = RobotImp.LineSensorStatus()
           if (Sens == 11) {
               RobotImp.MotorLeft(30)
               RobotImp.MotorRight(30)
           } else if (Sens == 10) {
               RobotImp.MotorLeft(0)
               RobotImp.MotorRight(20)
           } else if (Sens == 1) {
               RobotImp.MotorLeft(20)
               RobotImp.MotorRight(0)
           } else {
               RobotImp.MotorLeft(20)
               RobotImp.MotorRight(20)
           }
           basic.pause(10)
       } while (!input.buttonIsPressed(Button.A))
       RobotImp.MotorLeft(0)
       RobotImp.MotorRight(0)
    
   }
}
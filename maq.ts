/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */
const INIT_GROUP = 2

let BLUE = 0
let GREEN = 0
let RED = 0
let rgb_leds: neopixel.Strip = null
rgb_leds = neopixel.create(DigitalPin.P15, 4, NeoPixelMode.RGB)

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

    export function LEDBlink(NumberVal: number) {
        for (let i = 0; i < NumberVal; i++) {
            maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
            maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOff)
            basic.pause(100)
            maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOff)
            maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
            basic.pause(100)
        }
        maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOff)
        maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOff)
    }

    export function LEDOnL() {
        maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
        //maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOff)
    }

    export function LEDOnR() {
        maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
    }

    export function LEDOffL() {
        maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOff)
    }

    export function LEDOffR() {
        maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOff)
    }

    export function RGBLEDBlink(NumberVal: number) {
        rgb_leds.showRainbow(1, 260)
        rgb_leds.show()
        for (let i = 0; i < NumberVal; i++) {
            rgb_leds.rotate(1)
            rgb_leds.show()
            basic.pause(100)
        }
        rgb_leds.showColor(0)
        rgb_leds.clear()
    }

    export function RGBOn(LedNumber: number, ColorNum: number) {
        rgb_leds.setPixelColor(LedNumber, ColorNum)
        rgb_leds.show()
    }

    export function RGBAllOn(ColorNum: number) {
        rgb_leds.showColor(ColorNum)
        rgb_leds.setPixelColor(0, ColorNum)
        rgb_leds.setPixelColor(1, ColorNum)
        rgb_leds.setPixelColor(2, ColorNum)
        rgb_leds.setPixelColor(3, ColorNum)
        rgb_leds.show()
    }

    export function RGBOff(LedNumber: number) {
        rgb_leds.setPixelColor(LedNumber, 0)
        rgb_leds.show()
    }

    export function RGBAllOff() {
        rgb_leds.showColor(0)
        rgb_leds.clear()
    }

}
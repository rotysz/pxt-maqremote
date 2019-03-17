const CMD_FWD = "do_przod"
const CMD_LEFT = "w_lewo"
const CMD_RIGHT = "w_prawo"
const CMD_STOP = "stop"
const CMD_EMPTY = "empty"
const CMD_SETSPEED = "predkosc"
const CMD_SETSPEEDL = "p_prawy"
const CMD_SETSPEEDR = "p_lewy"
const CMD_CHGMTRSPEED = "zmienszy"
const CMD_CHGGROUP = "grupa"
const CMD_GETDIST = "odl"
const CMD_GETLINE = "lsensor"
const CMD_SETOPT = "set_opt"
const CMD_GETDURATION = "dczas"
const CMD_MRUG = "mrugaj"

const CMD_DISPSTR = "#ST#"
const CMD_DSPLED = "#LD#"
const CMD_DSPICON = "w_iko"

const ON = true
const OFF = false

const MSG_DIST = "odleg"
const MSG_LINESENSORS = "czlini"

const RET_DIST = "rodl"
const RET_LINESENSORS = "rlsens"
const RET_DURATION = "pczas"
const RET_END_TIME = "kczas"



let SpeedLeft: number = 0
let SpeedRight: number = 0
let LastCmd: string = CMD_EMPTY
let LastCmdTime: number = input.runningTime()
let MotorOffTime: number = 0
let RGrpEndTime: number = 0
let DebugMode = false

let EnableMsgDist = false
let EnableMsgLine = false

let DspVal = ''

let RadioCh = INIT_GROUP
if (input.buttonIsPressed(Button.A)) RadioCh = INIT_GROUP + 10
else if (input.buttonIsPressed(Button.B)) RadioCh = INIT_GROUP + 20
radio.setGroup(RadioCh)
basic.showString("CH=" + RadioCh)

input.onButtonPressed(Button.AB, function () {
    DebugMode = !DebugMode
    basic.showString(' D=' + DebugMode)
})

input.onButtonPressed(Button.A, function () {
    if (DebugMode) {
        basic.showString('C')
        RobotImp.Init()
        basic.clearScreen()
    }
})

input.onButtonPressed(Button.B, function () {
    RobotImp.FollowTheLine()
})

function CmdForward(On: boolean, Duration: number, SpeedL: number, SpeedR: number) {
    if (On) {
        LastCmd = CMD_FWD
        LastCmdTime = input.runningTime()
        MotorOffTime = LastCmdTime + Duration
        RobotImp.MotorLeft(SpeedL)
        RobotImp.MotorRight(SpeedR)

    } else {
        RobotImp.MotorLeft(SpeedL)
        RobotImp.MotorRight(SpeedR)
        MotorOffTime = 0
    }
}

function CmdLeft(Duriation: number) {
    CmdForward(ON, Duriation, -SpeedLeft, SpeedRight)
    LastCmd = CMD_LEFT
}

function CmdRight(Duriation: number) {
    CmdForward(ON, Duriation, SpeedLeft, -SpeedRight)
    LastCmd = CMD_RIGHT
}

function CmdStop() {
    CmdForward(OFF, 0, 0, 0)
    LastCmd = CMD_STOP
}

function CmdSetSpeed(SpeedVal: number) {
    SpeedLeft = SpeedVal
    SpeedRight = SpeedVal
}

function CmdSetSpeedL(SpeedVal: number) {
    SpeedLeft = SpeedVal
}

function CmdSetSpeedR(SpeedVal: number) {
    SpeedRight = SpeedVal
}

function CmdChangeMotorSpeed(EncodedValue: number) {

    let TmpSpeedL = ((EncodedValue / 512) - ((EncodedValue / 512) % 1)) - 256
    let TmpSpeedR = EncodedValue % 512 - 256
    if (MotorOffTime != 0) {
        RobotImp.MotorLeft(TmpSpeedL)
        RobotImp.MotorRight(TmpSpeedR)
    }
    SpeedLeft = TmpSpeedL
    SpeedRight = TmpSpeedR
}

function CmdChangeRadioGroup(On: boolean, NewRadioGroup: number) {
    if (On) {
        RGrpEndTime = input.runningTime() + 60000
        radio.setGroup(NewRadioGroup)
    } else {
        RGrpEndTime = 0
        radio.setGroup(INIT_GROUP)
    }
}

function CmdGetDist(Value: number) {
    radio.sendValue(RET_DIST, RobotImp.GetDistance())
}

function CmdGetLSensors(Value: number) {
    radio.sendValue(RET_LINESENSORS, RobotImp.LineSensorStatus())
}

function CmdGetDuration() {
    radio.sendValue(RET_DURATION, MotorOffTime - input.runningTime())
}

function CmdEndMotorTime() {
    radio.sendValue(RET_END_TIME, input.runningTime())
}

function CmdSetOpt(Value: number) {
    EnableMsgDist = (Value % 10) != 0
    EnableMsgLine = (Math.idiv(Value, 10) % 10) != 0
}

function ShowEncodedImg(EImg: string) {
    let len = EImg.length
    let pos = 0
    while (pos < len) {
        let digits = EImg.substr(pos, 2)
        let val = parseInt(digits)
        for (let i = 0; i < 5; i++) {
            if ((val % 2) == 1) led.plot(4 - i, Math.idiv(pos, 2))
            else led.unplot(4 - i, Math.idiv(pos, 2))
            val = Math.idiv(val, 2)
        }
        pos = pos + 2
    }
}
function CmdDisplay(receivedString: string) {

    let len = receivedString.length
    if (len > 4) {
        let Cmd = receivedString.substr(0, 4)
        let DspVal = receivedString.substr(4, len - 4)
        if (DebugMode) {
            basic.showString(Cmd + ">>" + DspVal)
        }
        if (Cmd == CMD_DISPSTR) {
            control.inBackground(function () {
                basic.showString(DspVal)
            })
        }
        if (Cmd == CMD_DSPLED) {
            ShowEncodedImg(DspVal)
        }
    }
}

function CmdDspIcon(Icon: IconNames) {
    basic.showIcon(Icon)
}

function CmdMrugaj(IleRazy: number) {
    RobotImp.Mrugaj(IleRazy)
}

radio.onReceivedValue(function (Cmd: string, CmdValue: number) {
    if (DebugMode) {
        basic.showString(Cmd)
        basic.showNumber(CmdValue)
    }
    if (Cmd.charAt(0) == '#') CmdDisplay(Cmd)
    if (Cmd == CMD_SETSPEED) CmdSetSpeed(CmdValue)
    if (Cmd == CMD_SETSPEEDL) CmdSetSpeedL(CmdValue)
    if (Cmd == CMD_SETSPEEDR) CmdSetSpeedR(CmdValue)
    if (Cmd == CMD_FWD) CmdForward(ON, CmdValue, SpeedLeft, SpeedRight)
    if (Cmd == CMD_LEFT) CmdLeft(CmdValue)
    if (Cmd == CMD_RIGHT) CmdRight(CmdValue)
    if (Cmd == CMD_CHGMTRSPEED) CmdChangeMotorSpeed(CmdValue)
    if (Cmd == CMD_STOP) CmdStop()
    if (Cmd == CMD_CHGGROUP) CmdChangeRadioGroup(ON, CmdValue)
    if (Cmd == CMD_GETDIST) CmdGetDist(CmdValue)
    if (Cmd == CMD_GETLINE) CmdGetLSensors(CmdValue)
    if (Cmd == CMD_SETOPT) CmdSetOpt(CmdValue)
    if (Cmd == CMD_GETDURATION) CmdGetDuration()
    if (Cmd == CMD_DSPICON) CmdDspIcon(CmdValue)
    if (Cmd == CMD_MRUG) CmdMrugaj(CmdValue)
})


basic.forever(function () {
    if (MotorOffTime != 0) {
        if ((MotorOffTime <= input.runningTime())) {
            CmdForward(OFF, 0, 0, 0)
            CmdEndMotorTime()
        }
    }
    if (RGrpEndTime != 0) {
        if (RGrpEndTime <= input.runningTime()) {
            CmdChangeRadioGroup(OFF, INIT_GROUP)
        }
    }
    if (EnableMsgDist) radio.sendValue(MSG_DIST, RobotImp.GetDistance())
    if (EnableMsgLine) radio.sendValue(MSG_LINESENSORS, RobotImp.LineSensorStatus())
    basic.pause(2)
})
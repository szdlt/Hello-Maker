enum Colors {
    //% blockId="Red" block="红色"
    Red = 0x01,
    //% blockId="Green" block="绿色"
    Green = 0x02,
    //% blockId="Blue" block="蓝色"
    Blue = 0x03,
    //% blockId="White" block="白色"
    White = 0x04,
    //% blockId="Black" block="黑色"
    Black = 0x05
}

//% color="#C814B8" weight=25 icon="\uf1d4"
namespace HelloMaker_显示类 {

    let lhRGBLight: DlbitRGBLight.LHDlbitRGBLight;
    let lhRGBLight_: DlbitRGBLight.LHDlbitRGBLight;

    export enum RGB {
        //% block="彩灯1"
        RGB1 = 0,
        //% block="彩灯2"
        RGB2 = 1
    }

    //% blockId="initRGBLight" block="初始化 %rgb_id| %dataPin"
    //% weight=94
    export function initRGBLight(rgb_id: RGB, dataPin: DigitalPin) {

        if (rgb_id == RGB.RGB1) {

            if (!lhRGBLight) {
                lhRGBLight = DlbitRGBLight.create(dataPin, 1, DlbitRGBPixelMode.RGB);

                lhRGBLight.clear();

            }
        }
        else if (rgb_id == RGB.RGB2) {

            if (!lhRGBLight_) {
                lhRGBLight_ = DlbitRGBLight.create(dataPin, 1, DlbitRGBPixelMode.RGB);
                lhRGBLight_.clear();
            }
        }

    }

    //% blockId="setBrightness" block="set brightness %brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=92
    export function setBrightness(brightness: number): void {
        lhRGBLight.setBrightness(brightness);
        lhRGBLight_.setBrightness(brightness);
    }

    //% weight=91 blockId=setPixelRGB block="Set|%lightoffset|color to %rgb"
    export function setPixelRGB(lightoffset: Lights, rgb: DlbitRGBColors) {
        if (lightoffset == 0) {
            lhRGBLight.setPixelColor(0, rgb, false);

        }
        else if (lightoffset == 1) {
            lhRGBLight_.setPixelColor(0, rgb, false);

        }
    }


    //% weight=90 blockId=setPixelRGBArgs block="Set|%lightoffset|color to %rgb"
    export function setPixelRGBArgs(lightoffset: Lights, rgb: number) {

        if (lightoffset == 0) {
            lhRGBLight.setPixelColor(0, rgb, false);

        }
        else if (lightoffset == 1) {
            lhRGBLight_.setPixelColor(0, rgb, false);

        }
    }
    //% weight=88 blockId=showLight block="Show light"
    export function showLight() {
        lhRGBLight.show();
        lhRGBLight_.show();
    }

    //% weight=86 blockGap=50 blockId=clearLight block="Clear light"
    export function clearLight() {
        lhRGBLight.clear();
        lhRGBLight_.clear();
    }

}

//% color="#87CEEB" weight=24 icon="\uf1b6"
namespace HelloMaker_传感器类 {

    export enum enVoice {
        //% blockId="Voice" block="有声音"
        Voice = 0,
        //% blockId="NoVoice" block="无声音"
        NoVoice = 1
    }
    export enum enIR {
        //% blockId="Get" block="检测到"
        Get = 0,
        //% blockId="NoVoice" block="未检测到"
        NoGet = 1
    }
    export enum enOK {
        //% blockId="NotOK" block="异常"
        NotOK = 0,
        //% blockId="OK" block="正常"
        OK = 1
    }
    export enum dataType {
        //% blockId="humidity" block="湿度"
        humidity,
        //% blockId="temperature" block="温度"
        temperature
    }

    let _temperature: number = -999.0
    let _humidity: number = -999.0
    let _readSuccessful: boolean = false
    const APDS9960_I2C_ADDR = 0x39;
    const APDS9960_ID_1 = 0xA8;
    const APDS9960_ID_2 = 0x9C;
    /* APDS-9960 register addresses */
    const APDS9960_ENABLE = 0x80;
    const APDS9960_ATIME = 0x81;
    const APDS9960_WTIME = 0x83;
    const APDS9960_AILTL = 0x84;
    const APDS9960_AILTH = 0x85;
    const APDS9960_AIHTL = 0x86;
    const APDS9960_AIHTH = 0x87;
    const APDS9960_PILT = 0x89;
    const APDS9960_PIHT = 0x8B;
    const APDS9960_PERS = 0x8C;
    const APDS9960_CONFIG1 = 0x8D;
    const APDS9960_PPULSE = 0x8E;
    const APDS9960_CONTROL = 0x8F;
    const APDS9960_CONFIG2 = 0x90;
    const APDS9960_ID = 0x92;
    const APDS9960_STATUS = 0x93;
    const APDS9960_CDATAL = 0x94;
    const APDS9960_CDATAH = 0x95;
    const APDS9960_RDATAL = 0x96;
    const APDS9960_RDATAH = 0x97;
    const APDS9960_GDATAL = 0x98;
    const APDS9960_GDATAH = 0x99;
    const APDS9960_BDATAL = 0x9A;
    const APDS9960_BDATAH = 0x9B;
    const APDS9960_PDATA = 0x9C;
    const APDS9960_POFFSET_UR = 0x9D;
    const APDS9960_POFFSET_DL = 0x9E;
    const APDS9960_CONFIG3 = 0x9F;

    const LED_DRIVE_100MA = 0;
    const LED_DRIVE_50MA = 1;
    const LED_DRIVE_25MA = 2;
    const LED_DRIVE_12_5MA = 3;

    /* ALS Gain (AGAIN) values */
    const AGAIN_1X = 0;
    const AGAIN_4X = 1;
    const AGAIN_16X = 2;
    const AGAIN_64X = 3;

    /* Default values */
    const DEFAULT_ATIME = 219;    // 103ms
    const DEFAULT_WTIME = 246;    // 27ms
    const DEFAULT_PROX_PPULSE = 0x87;    // 16us, 8 pulses
    const DEFAULT_GESTURE_PPULSE = 0x89;    // 16us, 10 pulses
    const DEFAULT_POFFSET_UR = 0;       // 0 offset
    const DEFAULT_POFFSET_DL = 0;       // 0 offset      
    const DEFAULT_CONFIG1 = 0x60;    // No 12x wait (WTIME) factor
    const DEFAULT_PILT = 0;       // Low proximity threshold
    const DEFAULT_PIHT = 50;      // High proximity threshold
    const DEFAULT_AILT = 0xFFFF;  // Force interrupt for calibration
    const DEFAULT_AIHT = 0;
    const DEFAULT_PERS = 0x11;    // 2 consecutive prox or ALS for int.
    const DEFAULT_CONFIG2 = 0x01;    // No saturation interrupts or LED boost  
    const DEFAULT_CONFIG3 = 0;       // Enable all photodiodes, no SAI
    const DEFAULT_GPENTH = 40;      // Threshold for entering gesture mode
    const DEFAULT_GEXTH = 30;      // Threshold for exiting gesture mode    
    const DEFAULT_GCONF1 = 0x40;    // 4 gesture events for int., 1 for exit
    const DEFAULT_GOFFSET = 0;       // No offset scaling for gesture mode
    const DEFAULT_GPULSE = 0xC9;    // 32us, 10 pulses
    const DEFAULT_GCONF3 = 0;       // All photodiodes active during gesture
    const DEFAULT_GIEN = 0;       // Disable gesture interrupts
    const DEFAULT_LDRIVE = LED_DRIVE_100MA;
    const DEFAULT_AGAIN = AGAIN_4X;


    const OFF = 0;
    const ON = 1;
    const POWER = 0;
    const AMBIENT_LIGHT = 1;
    const PROXIMITY = 2;
    const WAIT = 3;
    const AMBIENT_LIGHT_INT = 4;
    const PROXIMITY_INT = 5;
    const GESTURE = 6;
    const ALL = 7;


    function i2cwrite(reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(APDS9960_I2C_ADDR, buf);
    }

    function i2cread(reg: number): number {
        pins.i2cWriteNumber(APDS9960_I2C_ADDR, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(APDS9960_I2C_ADDR, NumberFormat.UInt8BE);
        return val;
    }

    function InitColor(): boolean {
        let id = i2cread(APDS9960_ID);
        //  serial.writeLine("id:")
        //  serial.writeNumber(id); 
        if (!(id == APDS9960_ID_1 || id == APDS9960_ID_2)) {
            return false;
        }
        //  serial.writeLine("set mode:")
        setMode(ALL, OFF);
        i2cwrite(APDS9960_ATIME, DEFAULT_ATIME);
        i2cwrite(APDS9960_WTIME, DEFAULT_WTIME);
        i2cwrite(APDS9960_PPULSE, DEFAULT_PROX_PPULSE);
        i2cwrite(APDS9960_POFFSET_UR, DEFAULT_POFFSET_UR);
        i2cwrite(APDS9960_POFFSET_DL, DEFAULT_POFFSET_DL);
        i2cwrite(APDS9960_CONFIG1, DEFAULT_CONFIG1);
        setLEDDrive(DEFAULT_LDRIVE);
        setAmbientLightGain(DEFAULT_AGAIN);
        setLightIntLowThreshold(DEFAULT_AILT);
        setLightIntHighThreshold(DEFAULT_AIHT);
        i2cwrite(APDS9960_PERS, DEFAULT_PERS);
        i2cwrite(APDS9960_CONFIG2, DEFAULT_CONFIG2);
        i2cwrite(APDS9960_CONFIG3, DEFAULT_CONFIG3);
        return true;
    }

    function setMode(mode: number, enable: number) {
        let reg_val = getMode();
        /* Change bit(s) in ENABLE register */
        enable = enable & 0x01;
        if (mode >= 0 && mode <= 6) {
            if (enable > 0) {
                reg_val |= (1 << mode);
            }
            else {
                //reg_val &= ~(1 << mode);
                reg_val &= (0xff - (1 << mode));
            }
        }
        else if (mode == ALL) {
            if (enable > 0) {
                reg_val = 0x7F;
            }
            else {
                reg_val = 0x00;
            }
        }
        i2cwrite(APDS9960_ENABLE, reg_val);
    }

    function getMode(): number {
        let enable_value = i2cread(APDS9960_ENABLE);
        return enable_value;
    }

    function setLEDDrive(drive: number) {
        let val = i2cread(APDS9960_CONTROL);
        /* Set bits in register to given value */
        drive &= 0b00000011;
        drive = drive << 6;
        val &= 0b00111111;
        val |= drive;
        i2cwrite(APDS9960_CONTROL, val);
    }

    function setLightIntLowThreshold(threshold: number) {
        let val_low = threshold & 0x00FF;
        let val_high = (threshold & 0xFF00) >> 8;
        i2cwrite(APDS9960_AILTL, val_low);
        i2cwrite(APDS9960_AILTH, val_high);
    }

    function setLightIntHighThreshold(threshold: number) {
        let val_low = threshold & 0x00FF;
        let val_high = (threshold & 0xFF00) >> 8;
        i2cwrite(APDS9960_AIHTL, val_low);
        i2cwrite(APDS9960_AIHTH, val_high);
    }


    function enableLightSensor(interrupts: boolean) {
        setAmbientLightGain(DEFAULT_AGAIN);
        if (interrupts) {
            setAmbientLightIntEnable(1);
        }
        else {
            setAmbientLightIntEnable(0);
        }
        enablePower();
        setMode(AMBIENT_LIGHT, 1);
    }

    function setAmbientLightGain(drive: number) {
        let val = i2cread(APDS9960_CONTROL);
        /* Set bits in register to given value */
        drive &= 0b00000011;
        val &= 0b11111100;
        val |= drive;
        i2cwrite(APDS9960_CONTROL, val);
    }

    function getAmbientLightGain(): number {
        let val = i2cread(APDS9960_CONTROL);
        val &= 0b00000011;
        return val;
    }

    function enablePower() {
        setMode(POWER, 1);
    }

    function setAmbientLightIntEnable(enable: number) {
        let val = i2cread(APDS9960_ENABLE);
        /* Set bits in register to given value */
        enable &= 0b00000001;
        enable = enable << 4;
        val &= 0b11101111;
        val |= enable;
        i2cwrite(APDS9960_ENABLE, val);
    }

    function readAmbientLight(): number {
        let val_byte = i2cread(APDS9960_CDATAL);
        let val = val_byte;
        val_byte = i2cread(APDS9960_CDATAH);
        val = val + val_byte << 8;
        return val;
    }

    function readRedLight(): number {

        let val_byte = i2cread(APDS9960_RDATAL);
        let val = val_byte;
        val_byte = i2cread(APDS9960_RDATAH);
        val = val + val_byte << 8;
        return val;
    }

    function readGreenLight(): number {

        let val_byte = i2cread(APDS9960_GDATAL);
        let val = val_byte;
        val_byte = i2cread(APDS9960_GDATAH);
        val = val + val_byte << 8;
        return val;
    }

    function readBlueLight(): number {

        let val_byte = i2cread(APDS9960_BDATAL);
        let val = val_byte;
        val_byte = i2cread(APDS9960_BDATAH);
        val = val + val_byte << 8;
        return val;
    }

    //% blockId=HelloMaker_initColorSensor block="initColorSensor|value %value"
    //% weight=95
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function initColorSensor() {
        InitColor();
        enableLightSensor(false);
        control.waitMicros(100);
    }

    /*
 *  Color sensor to obtain color value.
 */
    //% weight=84 blockId=HelloMaker_checkCurrentColor block="checkCurrentColor|color %color" 
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function checkCurrentColor(color: Colors): boolean {
        //       setBrightness(150);     
        //       setPixelRGB(Lights.Light1, DlbitRGBColors.White);
        //       setPixelRGB(Lights.Light2, DlbitRGBColors.White);
        //       showLight(); 
        let r = readRedLight();
        let g = readGreenLight();
        let b = readBlueLight();
        let t = Colors.Red;

        if (r > g) {
            t = Colors.Red;
        }
        else {
            t = Colors.Green;
        }

        if (t == Colors.Green && g < b) {
            if (b - g > 1000)
                t = Colors.Blue;
        }
        if (t == Colors.Red && r < b) {
            t = Colors.Blue;
        }

        if (r > 6800 && g > 8000 && b > 12000) {
            t = Colors.White;
        }
        else if (r < 800 && g < 1100 && b < 1300) {
            t = Colors.Black;
        }
        else if (t == Colors.Blue && b > 2800) {
            //        serial.writeLine("blue");

        }
        else if (t == Colors.Green && g > 1500) {
            // serial.writeLine("green");
        }
        else if (t == Colors.Red && r > 3000) {
            //serial.writeLine("red");
        }
        else {
            //serial.writeLine("none");
            return false;
        }
        return (color == t);
    }

    //% block="温湿度传感器：%dataPin"
    //% pullUp.defl=true
    //% blockExternalInputs=true
    export function queryData(dataPin: DigitalPin) {

        //initialize
        let startTime: number = 0
        let endTime: number = 0
        let checksum: number = 0
        let checksumTmp: number = 0
        let dataArray: boolean[] = []
        let resultArray: number[] = []
        for (let index = 0; index < 40; index++) dataArray.push(false)
        for (let index = 0; index < 5; index++) resultArray.push(0)
        _humidity = -999.0
        _temperature = -999.0
        _readSuccessful = false

        startTime = input.runningTimeMicros()

        //request data
        pins.digitalWritePin(dataPin, 0) //begin protocol
        basic.pause(18)
        pins.setPull(dataPin, PinPullMode.PullUp) //pull up data pin if needed
        pins.digitalReadPin(dataPin)
        control.waitMicros(20)
        while (pins.digitalReadPin(dataPin) == 1);
        while (pins.digitalReadPin(dataPin) == 0); //sensor response
        while (pins.digitalReadPin(dataPin) == 1); //sensor response

        //read data (5 bytes)
        for (let index = 0; index < 40; index++) {
            while (pins.digitalReadPin(dataPin) == 1);
            while (pins.digitalReadPin(dataPin) == 0);
            control.waitMicros(28)
            //if sensor pull up data pin for more than 28 us it means 1, otherwise 0
            if (pins.digitalReadPin(dataPin) == 1) dataArray[index] = true
        }

        endTime = input.runningTimeMicros()

        //convert byte number array to integer
        for (let index = 0; index < 5; index++)
            for (let index2 = 0; index2 < 8; index2++)
                if (dataArray[8 * index + index2]) resultArray[index] += 2 ** (7 - index2)

        //verify checksum
        checksumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3]
        checksum = resultArray[4]
        if (checksumTmp >= 512) checksumTmp -= 512
        if (checksumTmp >= 256) checksumTmp -= 256
        if (checksum == checksumTmp) _readSuccessful = true

        //read data if checksum ok
        if (_readSuccessful) {

            //DHT11
            _humidity = resultArray[0] + resultArray[1] / 100
            _temperature = resultArray[2] + resultArray[3] / 100

        }

    }

    //% block="读取温湿度传感器%Measuredata测量结果"
    export function readData(Measuredata: dataType): number {
        return Measuredata == dataType.humidity ? _humidity : _temperature
    }

    /**
    * Determind if last query is successful (checksum ok)
    */
    //% block="温湿度传感器测量成功"
    export function readDataSuccessful(): boolean {
        return _readSuccessful
    }



    //% block="声音传感器：%dataPin|%value|声音"
    export function Voice_Sensor(dataPin: DigitalPin, value: enVoice): boolean {

        pins.setPull(dataPin, PinPullMode.PullUp);
        if (pins.digitalReadPin(dataPin) == value) {
            return true;
        }
        else {
            return false;
        }

    }
    //% block="倾斜传感器：%dataPin|%value|倾斜"

    export function Incline_Sensor(dataPin: DigitalPin, value: enIR): boolean {

        pins.setPull(dataPin, PinPullMode.PullUp);
        if (pins.digitalReadPin(dataPin) == value) {
            return true;
        }
        else {
            return false;
        }

    }

    //% block="烟雾传感器：%dataPin|%value|烟雾"
    export function Smog_Sensor(dataPin: DigitalPin, value: enIR): boolean {

        pins.setPull(dataPin, PinPullMode.PullUp);
        if (pins.digitalReadPin(dataPin) == value) {
            return true;
        }
        else {
            return false;
        }

    }

    //% block="触摸传感器：%dataPin|%value|触摸"
    export function Touch_Sensor(dataPin: DigitalPin, value: enIR): boolean {

        pins.setPull(dataPin, PinPullMode.PullUp);
        if (pins.digitalReadPin(dataPin) == value) {
            return false;
        }
        else {
            return true;
        }

    }
    //% block="烟雾传感器：%dataPin|%value|光照"

    export function Photosensitive_Sensor(dataPin: DigitalPin, value: enIR): boolean {

        pins.setPull(dataPin, PinPullMode.PullUp);
        if (pins.digitalReadPin(dataPin) == value) {
            return true;
        }
        else {
            return false;
        }

    }
    //% blockId=HelloMaker_Potentiometer block="电位器数值"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Potentiometer(dataPin: AnalogPin): number {

        return pins.analogReadPin(dataPin) * 10 / 102

    }

    //% block="按键模块：%dataPin|%value|按下"
    export function KeyDetect(dataPin: DigitalPin, value: enIR): boolean {

        pins.setPull(dataPin, PinPullMode.PullUp);
        if (pins.digitalReadPin(dataPin) == value) {
            return true;
        }
        else {
            return false;
        }

    }

    //% block="火焰传感器：%dataPin|%value|火焰"

    export function Flame_Sensor(dataPin: DigitalPin, value: enIR): boolean {

        pins.setPull(dataPin, PinPullMode.PullUp);
        if (pins.digitalReadPin(dataPin) == value) {
            return true;
        }
        else {
            return false;
        }
    }
}

//% color="#006400" weight=20 icon="\uf1b9"
namespace HelloMaker_小车类 {

    const PCA9685_ADD = 0x41
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04

    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09

    const ALL_LED_ON_L = 0xFA
    const ALL_LED_ON_H = 0xFB
    const ALL_LED_OFF_L = 0xFC
    const ALL_LED_OFF_H = 0xFD

    const PRESCALE = 0xFE
    let initialized = false
    let g_mode = 0
    let value_past = 0
    let value1_past = -1
    let value2_past = -1
    let value3_past = -1
    let value4_past = -1
    let value5_past = -1
    let value6_past = -1
    let car_speed = 200
    let startAvoid = false
    let CarDirState = -1
    let arr = [0, 0, 0, 0, 0]
    export enum enPos {
        //% blockId="Sensor1" block="传感器1"
        Sensor1 = 0,
        //% blockId="Sensor2" block="传感器2"
        Sensor2 = 1,
        //% blockId="Sensor3" block="传感器3"
        Sensor3 = 2,
        //% blockId="Sensor4" block="传感器4"
        Sensor4 = 3
    }
    export enum enLineState {
        //% blockId="White" block="白线"
        White = 0,
        //% blockId="Black" block="黑线"
        Black = 1
    }
    export enum enAvoidState {
        //% blockId="OBSTACLE" block="有"
        OBSTACLE = 0,
        //% blockId="NOOBSTACLE" block="无"
        NOOBSTACLE = 1
    }
    export enum NumAvoidSensor {
        //% blockId="Sensor1" block="1"
        Sensor1 = 0,
        //% blockId="Sensor2" block="2"
        Sensor2 = 1
    }
    export enum enServo {
        //% blockId="S1" block="舵机1"
        S1 = 1,
        //% blockId="S2" block="舵机2"
        S2,
        //% blockId="S3" block="舵机3"
        S3,
        //% blockId="S4" block="舵机4"
        S4
    }
    export enum CarRunState {
        //% blockId="Car_Normal" block="正常"
        Car_Normal = 0,
        //% blockId="Car_XunJi" block="寻迹"
        Car_XunJi = 1,
        //% blockId="Car_BiZhang" block="避障"  
        Car_BiZhang = 2

    }
    export enum MotorNum {
        //% blockId="Motor0" block="电机1"
        Motor0 = 0,
        //% blockId="Motor1"  block="电机2"
        Motor1 = 1,
        //% blockId="Motor2" block="电机3"
        Motor2 = 2,
        //% blockId="Motor3"  block="电机4"
        Motor3 = 3

    }
    export enum MotorDir {
        //% blockId="clockwise" block="正转"
        clockwise = 0,
        //% blockId="anticlockwise" block="反转"
        anticlockwise = 1
    }
    export enum CarState {
        //% blockId="Car_Run" block="前行"
        Car_Run = 1,
        //% blockId="Car_Back" block="后退"
        Car_Back = 2,
        //% blockId="Car_Left" block="左转"
        Car_Left = 3,
        //% blockId="Car_Right" block="右转"
        Car_Right = 4,
        //% blockId="Car_Stop" block="停止"
        Car_Stop = 5,
        //% blockId="Car_SpinLeft" block="原地左旋"
        Car_SpinLeft = 6,
        //% blockId="Car_SpinRight" block="原地右旋"
        Car_SpinRight = 7,
        //% blockId="Car_SpeedUp" block="加速"
        Car_SpeedUp = 8,
        //% blockId="Car_SpeedDown" block="减速"
        Car_SpeedDown = 9
    }
    export enum BalanceCarState {
        //% blockId="Balance_Run" block="前行"
        Balance_Run = 1,
        //% blockId="Balance_Back" block="后退"
        Balance_Back = 2,
        //% blockId="Balance_Left" block="左转"
        Balance_Left = 3,
        //% blockId="Balance_Right" block="右转"
        Balance_Right = 4,
        //% blockId="Balance_Stop" block="停止"
        Balance_Stop = 5

    }

    function i2cwrite_(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }
    function initPCA9685(): void {
        i2cwrite_(PCA9685_ADD, MODE1, 0x00)
        setFreq(50);
        initialized = true
    }
    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADD, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite_(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite_(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite_(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite_(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }
    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }


    function Car_run(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350) {
            speed = 350
        }
        /*
            setPwm(12 - 4, 0, speed);
            setPwm(13 - 4, 0, 0);
            setPwm(15 - 4, 0, speed);
            setPwm(14 - 4, 0, 0);
        */
        setPwm(12, 0, speed);
        setPwm(13, 0, 0);
        setPwm(15, 0, speed);
        setPwm(14, 0, 0);

        //pins.digitalWritePin(DigitalPin.P16, 1);
        // pins.analogWritePin(AnalogPin.P1, 1023-speed); //速度控制

        // pins.analogWritePin(AnalogPin.P0, speed);//速度控制
        // pins.digitalWritePin(DigitalPin.P8, 0);
    }
    function Car_back(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350 && speed != 0) {
            speed = 350
        }
        /*
            setPwm(12 - 4, 0, 0);
            setPwm(13 - 4, 0, speed);
            setPwm(15 - 4, 0, 0);
            setPwm(14 - 4, 0, speed);
        */
        setPwm(12, 0, 0);
        setPwm(13, 0, speed);
        setPwm(15, 0, 0);
        setPwm(14, 0, speed);
        //pins.digitalWritePin(DigitalPin.P16, 0);
        //pins.analogWritePin(AnalogPin.P1, speed); //速度控制
        //pins.analogWritePin(AnalogPin.P0, 1023 - speed);//速度控制
        //pins.digitalWritePin(DigitalPin.P8, 1);
    }
    function Car_left(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350 && speed != 0) {
            speed = 350
        }
        /*
            setPwm(8, 0, 0);
            setPwm(9, 0, 0);
            setPwm(11, 0, speed);
            setPwm(10, 0, 0);
            */
        setPwm(12, 0, 0);
        setPwm(13, 0, 0);
        setPwm(15, 0, speed);
        setPwm(14, 0, 0);
        //pins.analogWritePin(AnalogPin.P0, speed);
        //pins.digitalWritePin(DigitalPin.P8, 0);
        //pins.digitalWritePin(DigitalPin.P16, 0);
        //pins.digitalWritePin(DigitalPin.P1, 0);
    }
    function Car_right(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350 && speed != 0) {
            speed = 350
        }
        /*
            setPwm(12 - 4, 0, speed);
            setPwm(13 - 4, 0, 0);
    
            setPwm(15 - 4, 0, 0);
            setPwm(14 - 4, 0, 0);
            */
        setPwm(12, 0, speed);
        setPwm(13, 0, 0);

        setPwm(15, 0, 0);
        setPwm(14, 0, 0);
        //pins.digitalWritePin(DigitalPin.P0, 0);
        //pins.digitalWritePin(DigitalPin.P8, 0);
        //pins.digitalWritePin(DigitalPin.P16, 1);
        // pins.analogWritePin(AnalogPin.P1, 1023 - speed);
    }
    function Car_stop() {
        /*
            setPwm(12 - 4, 0, 0);
            setPwm(13 - 4, 0, 0);
            setPwm(15 - 4, 0, 0);
            setPwm(14 - 4, 0, 0);
        */
        setPwm(12, 0, 0);
        setPwm(13, 0, 0);
        setPwm(15, 0, 0);
        setPwm(14, 0, 0);
        //pins.digitalWritePin(DigitalPin.P0, 0);
        //pins.digitalWritePin(DigitalPin.P8, 0);
        //pins.digitalWritePin(DigitalPin.P16, 0);
        //pins.digitalWritePin(DigitalPin.P1, 0);
    }
    function Car_spinleft(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350 && speed != 0) {
            speed = 350
        }
        /*
            setPwm(12 - 4, 0, 0);
            setPwm(13 - 4, 0, speed);
            setPwm(15 - 4, 0, speed);
            setPwm(14 - 4, 0, 0);
        */
        setPwm(12, 0, 0);
        setPwm(13, 0, speed);
        setPwm(15, 0, speed);
        setPwm(14, 0, 0);
        //pins.analogWritePin(AnalogPin.P0, speed);
        //pins.digitalWritePin(DigitalPin.P8, 0);
        //pins.digitalWritePin(DigitalPin.P16, 0);
        //pins.analogWritePin(AnalogPin.P1, speed);
    }
    function Car_spinright(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350 && speed != 0) {
            speed = 350
        }
        /*
            setPwm(12 - 4, 0, speed);
            setPwm(13 - 4, 0, 0);
            setPwm(15 - 4, 0, 0);
            setPwm(14 - 4, 0, speed);
        */
        setPwm(12, 0, speed);
        setPwm(13, 0, 0);
        setPwm(15, 0, 0);
        setPwm(14, 0, speed);
        //pins.analogWritePin(AnalogPin.P0, 1023-speed);
        //pins.digitalWritePin(DigitalPin.P8, 1);
        //pins.digitalWritePin(DigitalPin.P16, 1);
        //pins.analogWritePin(AnalogPin.P1, 1023-speed);
    }
    function Car_SpeedUp() {
        if (car_speed <= 240)
            car_speed += 10;
    }
    function Car_SpeedDown() {
        if (car_speed >= 50)
            car_speed -= 10;
    }

    //% blockId=HelloMaker_ultrasonic_car block="超声波快速测距得到的结果为(cm)"
    //% color="#006400"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic_Car(): number {
        let echoPin: DigitalPin = DigitalPin.P15;
        let trigPin: DigitalPin = DigitalPin.P14;
        pins.setPull(echoPin, PinPullMode.PullNone);
        pins.setPull(trigPin, PinPullMode.PullNone);
        // send pulse
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(5);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(5);
        // read pulse
        let d = pins.pulseIn(echoPin, PulseValue.High, 11600);
        basic.pause(10);
        return Math.floor(d / 40);

    }
    //% blockId=PreciseUltrasonic block="超声波精准测距得到结果为（cm）"
    export function PreciseUltrasonic(): number {
        let distance = 0
        for (let i = 0; i < 5; i++) {
            arr[i] = HelloMaker_小车类.Ultrasonic_Car()
        }
        arr.sort(function (a, b) {
            return a - b
        })

        for (let i = 1; i < 4; i++) {
            distance += arr[i]
        }
        distance /= 3
        return Math.round(distance)

    }


    //% blockId=HelloMaker_Servo_Car block="Servo_Car|num %num|%value |速度 %speed"
    //% weight=96
    //% blockGap=10
    //% speed.min=1 speed.max=10
    //% color="#006400"
    //% num.min=1 num.max=6 value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function Servo_Car(num: enServo, value: number, speed: number): void {
        // 50hz: 20,000 us
        if (num == 1) { value_past = value1_past; }
        else if (num == 2) { value_past = value2_past; }


        else if (num == 3) { value_past = value3_past; }
        else if (num == 4) { value_past = value4_past; }



        //    else if (num == 5) { value_past = value5_past; }
        //    else if (num == 6) { value_past = value6_past; }


        while (value_past != value) {
            if (speed == 0 || value_past == -1) {
                value_past = value;
                let us = (value_past * 1800 / 180 + 600); // 0.6 ~ 2.4
                let pwm = us * 4096 / 20000;
                setPwm(num + 2, 0, pwm);
            }
            else {
                if (value_past > value) {

                    value_past - speed > value ? value_past -= speed : value_past--;
                    let us = (value_past * 1800 / 180 + 600); // 0.6 ~ 2.4
                    let pwm = us * 4096 / 20000;
                    setPwm(num + 2, 0, pwm);
                    basic.pause(20);

                }
                else if (value_past < value) {

                    value_past + speed < value ? value_past += speed : value_past++;
                    let us = (value_past * 1800 / 180 + 600); // 0.6 ~ 2.4
                    let pwm = us * 4096 / 20000;
                    setPwm(num + 2, 0, pwm);
                    basic.pause(20);
                }
                {
                    let us = (value_past * 1800 / 180 + 600); // 0.6 ~ 2.4
                    let pwm = us * 4096 / 20000;
                    setPwm(num + 2, 0, pwm);
                }

            }
        }
        if (num == 1) { value1_past = value; }
        else if (num == 2) { value2_past = value; }
        else if (num == 3) { value3_past = value; }
        else if (num == 4) { value4_past = value; }
        //    else if (num == 5) { value5_past = value; }
        //    else if (num == 6) { value6_past = value; }
    }

    //% blockId=HelloMaker_Avoid_Sensor block="红外避障传感器| %num| %dataPin|%value检测到障碍物" 
    //% weight=95
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Avoid_Sensor(num: NumAvoidSensor, dataPin: DigitalPin, value: enAvoidState): boolean {
        let temp: boolean = false;
        pins.setPull(dataPin, PinPullMode.PullUp);
        switch (value) {
            case enAvoidState.OBSTACLE: {
                if (num == NumAvoidSensor.Sensor1) {
                    if (pins.digitalReadPin(dataPin) == 0) {
                        temp = true;
                    }
                    else {
                        temp = false;
                    }
                }
                else if (num == NumAvoidSensor.Sensor2) {
                    if (pins.digitalReadPin(dataPin) == 0) {
                        temp = true;
                    }
                    else {
                        temp = false;
                    }
                }
                break;
            }
            case enAvoidState.NOOBSTACLE: {
                if (num == NumAvoidSensor.Sensor1) {
                    if (pins.digitalReadPin(dataPin) == 1) {
                        temp = true;
                    }
                    else {
                        temp = false;
                    }
                }
                else if (num == NumAvoidSensor.Sensor2) {
                    if (pins.digitalReadPin(dataPin) == 1) {
                        temp = true;
                    }
                    else {
                        temp = false;
                    }
                }
                break;
            }
        }
        return temp;
    }
    //% blockId=HelloMaker_Line_Sensor block="Line_Sensor|direct %direct|%value"
    //% weight=94
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Line_Sensor(direct: enPos, value: enLineState): boolean {
        let temp: boolean = false;
        let IIC_data = 0
        IIC_data = pins.i2cReadNumber(45, NumberFormat.UInt8LE, false)
        switch (direct) {
            case enPos.Sensor1: {
                if (IIC_data & 0x1) {
                    if (value == enLineState.Black) {
                        temp = true;
                    }
                }
                else {
                    if (value == enLineState.White) {
                        temp = true;
                    }
                }
                break;
            }
            case enPos.Sensor2: {
                if (IIC_data & 0x2) {
                    if (value == enLineState.Black) {
                        temp = true;
                    }
                }
                else {
                    if (value == enLineState.White) {
                        temp = true;
                    }
                }
                break;
            }

            case enPos.Sensor3: {
                if (IIC_data & 0x4) {
                    if (value == enLineState.Black) {
                        temp = true;
                    }
                }
                else {
                    if (value == enLineState.White) {
                        temp = true;
                    }
                }
                break;
            }
            case enPos.Sensor4: {
                if (IIC_data & 0x8) {
                    if (value == enLineState.Black) {
                        temp = true;
                    }
                }
                else {
                    if (value == enLineState.White) {
                        temp = true;
                    }
                }
                break;
            }
        }
        return temp;
    }
    //% blockId=HelloMaker_CarCtrl block="CarCtrl|%index"
    //% weight=93
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrl(index: CarState): void {
        switch (index) {
            case CarState.Car_Run: Car_run(car_speed); break;
            case CarState.Car_Back: Car_back(car_speed); break;
            case CarState.Car_Left: Car_left(car_speed); break;
            case CarState.Car_Right: Car_right(car_speed); break;
            case CarState.Car_Stop: Car_stop(); break;
            case CarState.Car_SpinLeft: Car_spinleft(car_speed); break;
            case CarState.Car_SpinRight: Car_spinright(car_speed); break;
            case CarState.Car_SpeedUp: Car_SpeedUp(); break;
            case CarState.Car_SpeedDown: Car_SpeedDown(); break;
        }
    }
    //% blockId=HelloMaker_CarCtrlSpeed block="CarCtrlSpeed|%index|speed %speed"
    //% weight=92
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrlSpeed(index: CarState, speed: number): void {
        switch (index) {
            case CarState.Car_Run: Car_run(speed); break;
            case CarState.Car_Back: Car_back(speed); break;
            case CarState.Car_Left: Car_left(speed); break;
            case CarState.Car_Right: Car_right(speed); break;
            case CarState.Car_Stop: Car_stop(); break;
            case CarState.Car_SpinLeft: Car_spinleft(speed); break;
            case CarState.Car_SpinRight: Car_spinright(speed); break;
        }
    }

    //% blockId=HelloMaker_BalanceMode block="BalanceMode|%direction"
    //% weight=93
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    //  export function BalanceMode(index: BalanceCarState): void {
    export function BalanceMode(direction: number): void {
        switch (direction) {
            case 1:     //BalanceCarState.Balance_Run: 
                HelloMaker_积木类.SendMoveTypeToMcu(9)
                break;
            case 2: //BalanceCarState.Balance_Back: 
                HelloMaker_积木类.SendMoveTypeToMcu(10)
                break;
            case 3://BalanceCarState.Balance_Left: 
                HelloMaker_积木类.SendMoveTypeToMcu(11)
                break;
            case 4://BalanceCarState.Balance_Right: 
                HelloMaker_积木类.SendMoveTypeToMcu(12)
                break;
            case 0://BalanceCarState.Balance_Stop: 
                HelloMaker_积木类.SendMoveTypeToMcu(17)

                break;

        }
    }

    //% blockId=HelloMaker_BluetoothCarControl block="机器人接收蓝牙命令|%uartData"
    export function BluetoothCarControl(UartData: string): void {
        let start_num = UartData.indexOf("*@")
        if (UartData.indexOf("l-Z") != -1) {
            startAvoid = true
        } else {
            startAvoid = false
            if (UartData.indexOf("-S") != -1) {
                CarDirState = 1
            } else if (UartData.indexOf("l-B") != -1) {
                CarDirState = 2
            } else if (UartData.indexOf("l-L") != -1) {
                CarDirState = 3
            } else if (UartData.indexOf("l-R") != -1) {
                CarDirState = 4
            } else if (UartData.indexOf("l-0") != -1) {
                CarDirState = 0
            }
            else if (UartData.indexOf("lig") != -1) {
                let rgb_id = parseInt(UartData.substr(start_num + 6, 1))
                let rgb_color = parseInt(UartData.substr(start_num + 8, 1))
                let rgb_bright = parseInt(UartData.substr(start_num + 10, 3))
                if (rgb_id != 0) {
                    if (rgb_color == 5) {
                        rgb_color = 6
                    } else if (rgb_color == 6) {
                        rgb_color = 5
                    } else if (rgb_color == 8) {
                        rgb_color = 9
                    }
                    if (rgb_id == 1) {
                        HelloMaker_显示类.setPixelRGB(0, rgb_color)
                    }
                    else if (rgb_id == 2) {
                        HelloMaker_显示类.setPixelRGB(1, rgb_color)
                    }

                    HelloMaker_显示类.setBrightness(rgb_bright * 2.5)
                    HelloMaker_显示类.showLight()

                }
                else {
                    HelloMaker_显示类.clearLight()
                }


            }



        }
    }
    //% blockId=CarModeState block="当前为避障模式"
    export function CarModeState(): boolean {

        return startAvoid
    }

    //% blockId=DirectionState block="机器人运动方向"
    export function DirectionState(): number {

        return CarDirState
    }



    //% blockId=HelloMaker_MotorRun block="MotorRun|%index0|%index1|speed%speed"
    //% weight=93
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function MotorRun(index0: MotorNum, index1: MotorDir, speed: number) {
        if (index0 == MotorNum.Motor0) {
            if (index1 == MotorDir.clockwise) {
                setPwm(12, 0, speed * 16);
                setPwm(13, 0, 0);

            }
            else if (index1 == MotorDir.anticlockwise) {
                setPwm(12, 0, 0);
                setPwm(13, 0, speed * 16);

            }
        }
        else if (index0 == MotorNum.Motor1) {
            if (index1 == MotorDir.clockwise) {
                setPwm(14, 0, speed * 16);
                setPwm(15, 0, 0);

            }
            else if (index1 == MotorDir.anticlockwise) {
                setPwm(15, 0, speed * 16);
                setPwm(14, 0, 0);

            }

        }
        else if (index0 == MotorNum.Motor2) {
            if (index1 == MotorDir.clockwise) {
                setPwm(10, 0, speed * 16);
                setPwm(11, 0, 0);

            }
            else if (index1 == MotorDir.anticlockwise) {
                setPwm(11, 0, speed * 16);
                setPwm(10, 0, 0);

            }

        }
        else if (index0 == MotorNum.Motor3) {
            if (index1 == MotorDir.clockwise) {
                setPwm(8, 0, speed * 16);
                setPwm(9, 0, 0);

            }
            else if (index1 == MotorDir.anticlockwise) {
                setPwm(9, 0, speed * 16);
                setPwm(8, 0, 0);

            }

        }

    }
}

//% color="#0000C8" weight=24 icon="\uf085"
namespace HelloMaker_积木类 {

    let StrAt = -1
    let MoveType = -1
    let dlbot_pos = -1
    let dlbot_id = -1
    let dlbot_speed = -1
    let rgb_id = -1
    let rgb_color = -1
    let rgb_bright = -1
    let color_id = -1
    let tone = -1
    let dlbot_beat = -1
    let show_number = -1
    let time = -1
    let move = -1
    let speed = -1
    let direction = -1
    let Stm32_POS = -1
    let Stm32_ID = -1
    let Stm32_GROUP = -1
    let Robot_Mode = -1
    export let Move_T = -1
    let stringReceive = ""
    let dl_CarSpeed = 80
    let Tone = [65, 73, 82, 87, 98, 110, 123，
				131, 147, 165, 175, 196, 220, 247,
				262, 294, 330, 349, 392, 440, 494,
				523, 587, 659, 698, 784, 880, 988,
				1047, 1175, 1319, 1397, 1568, 1760, 1976,
				2093, 2349, 2637, 2794, 3136, 3520, 3951,
                4186, 4699]
    
   // let Beat = [16, 16, 8, 4, 2, 1, 32, 64]
   
 //  let Beat = [2, 2, 4, 8, 1, 32, 64]
   let Beat = [8, 8, 4, 2, 1, 32, 64]
   
   

    export enum CMD_TYPE {
        //% block="手机编程-直行"
        MST,
        //% block="手机编程-转弯"
        DST,
        //% block="手机编程-RGB彩灯"
        LIG,
        //% block="手机编程-颜色识别"
        COL,
        //% block="手机编程-音调"
        TON,
        //% block="手机编程-版本号"
        VER,
		/*
        //% block="手机编程-数字显示"
        POS,
        //% block="显示屏-字符显示"
        SEN,
		*/
        //% block="手机编程-温度"
        TEM,
        //% block="寻迹传感器状态"
        STA,
        //% block="手机编程-PWM舵机""
        SERVO_MOVE,
        //% block="控制单舵机"
        SERVO_ONE,
        //% block="运行舵机动作组"
        SERVO_GROUP,
        //% block="机器人运动模式"
        STM32_MOVE,
        //% block="机器人避障模式"
        ROBOT_MODE_BIZHANG,
        //% block="机器人寻迹模式"
        ROBOT_MODE_XUNJI,
        //% block="机器人速度调整"
        ROBOT_SPEED_ADJUST,
        //% block="手机编程-总线舵机"
        GP_BUSSERVO

    }
    let CMD_MULT_SERVO_MOVE = 3
    let CMD_FULL_ACTION_RUN = 6
    let CMD_TANK_FRONT = 9
    let CMD_TANK_BACK = 10
    let CMD_TANK_LEFT = 11
    let CMD_TANK_RIGHT = 12
    let CMD_TANK_STOP = 17
    let CMD_SR04_DISTANCE = 33
    let CMD_SERVO_SPD = 34
    let CMD_RGB_DETECT = 35


    let cmdType = -1

    function UartSend4data(num: number) {
        if (num < 10) {
            serial.writeNumber(0)
            serial.writeNumber(0)
            serial.writeNumber(0)
            serial.writeNumber(num)
        }
        else if (num < 100) {
            serial.writeNumber(0)
            serial.writeNumber(0)
            serial.writeNumber(num)
        }
        else if (num < 1000) {
            serial.writeNumber(0)
            serial.writeNumber(num)
        }
        else {
            serial.writeNumber(num)
        }
    }

    function UartSend3data(num: number) {
        if (num < 10) {
            serial.writeNumber(0)
            serial.writeNumber(0)
            serial.writeNumber(num)
        }
        else if (num < 100) {
            serial.writeNumber(0)
            serial.writeNumber(num)
        }
        else {
            serial.writeNumber(num)
        }
    }

    function UartSend2data(num: number) {
        if (num < 10) {
            serial.writeNumber(0)
            serial.writeNumber(num)
        }

        else {
            serial.writeNumber(num)
        }
    }

    function SendOneServoToMcu(time: number, id: number, pos: number) {

        serial.writeNumber(2)
        serial.writeNumber(2)
        serial.writeNumber(1)
        serial.writeNumber(3)
        serial.writeNumber(0)
        serial.writeNumber(3)
        UartSend4data(time)
        serial.writeNumber(id)
        UartSend4data(pos)
    }

    function SendServoGroupToMcu(group: number, times: number) {

        serial.writeNumber(2)
        serial.writeNumber(2)
        serial.writeNumber(1)
        serial.writeNumber(0)
        serial.writeNumber(0)
        serial.writeNumber(6)
        UartSend3data(group)
        UartSend3data(times)
    }

    export function SendMoveTypeToMcu(type: number) {

        serial.writeNumber(2)
        serial.writeNumber(2)
        serial.writeNumber(0)
        serial.writeNumber(4)
        UartSend2data(type)
    }

    //% blockId=HelloMaker_SendRGBColor block="SendRGBColor"
    //% weight=96
    //% blockGap=10
    //% objColor.min=1 objColor.max=3
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function SendRGBColor(objColor: Colors) {

        serial.writeNumber(2)
        serial.writeNumber(2)
        serial.writeNumber(0)
        serial.writeNumber(5)
        UartSend2data(CMD_RGB_DETECT)
        serial.writeNumber(objColor)
    }
    //% blockId=HelloMaker_SendBarrierDistance block="SendBarrierDistance"
    //% weight=96
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function SendBarrierDistance(distance: number) {

        serial.writeNumber(2)
        serial.writeNumber(2)
        serial.writeNumber(0)
        serial.writeNumber(7)
        UartSend2data(CMD_SR04_DISTANCE)
        UartSend3data(distance)
    }

    //% blockId=HelloMaker_BuildingBlocksInit block="BuildingBlocksInit"
    //% weight=96
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function BuildingBlocksInit() {

        serial.redirect(
            SerialPin.P13,
            SerialPin.P12,
            BaudRate.BaudRate9600)
        HelloMaker_小车类.CarCtrl(HelloMaker_小车类.CarState.Car_Stop)
        HelloMaker_小车类.Servo_Car(HelloMaker_小车类.enServo.S1, 90, 0)
        HelloMaker_小车类.Servo_Car(HelloMaker_小车类.enServo.S2, 90, 0)
        HelloMaker_小车类.Servo_Car(HelloMaker_小车类.enServo.S3, 90, 0)
        HelloMaker_小车类.Servo_Car(HelloMaker_小车类.enServo.S4, 90, 0)

    }

    //% blockId=RobotMove block="蓝牙控制小车运动"
    export function RobotMove() {

        switch (Move_T) {
            case 9:
                HelloMaker_小车类.CarCtrlSpeed(HelloMaker_小车类.CarState.Car_Run, dl_CarSpeed * 2.5)
                break

            case 10:
                HelloMaker_小车类.CarCtrlSpeed(HelloMaker_小车类.CarState.Car_Back, dl_CarSpeed * 2.5)
                break

            case 11:
                HelloMaker_小车类.CarCtrlSpeed(HelloMaker_小车类.CarState.Car_SpinLeft, dl_CarSpeed * 2.5)
                break

            case 12:
                HelloMaker_小车类.CarCtrlSpeed(HelloMaker_小车类.CarState.Car_SpinRight, dl_CarSpeed * 2.5)
                break

            case 17:
                HelloMaker_小车类.CarCtrl(HelloMaker_小车类.CarState.Car_Stop)
                break

            default:
                HelloMaker_小车类.CarCtrl(HelloMaker_小车类.CarState.Car_Stop)
                break

        }

      //  SendMoveTypeToMcu(Move_T)

    }
    //% blockId=ServoOne block="蓝牙-单舵机运动"
    export function ServoOne() {
        let Angle = 0
        SendOneServoToMcu(100, Stm32_ID, Stm32_POS)
        Angle = Math.map(Stm32_POS, 0, 1000, 0, 180)
        HelloMaker_小车类.Servo_Car(Stm32_ID, Angle, 0)

    }
    //% blockId=ServoGroup block="蓝牙-舵机动作组"
    export function ServoGroup() {
        SendServoGroupToMcu(Stm32_GROUP, 1)

    }
    //% blockId=AppProgramMove block="手机编程-机器人直行"
    export function AppProgramMove() {
        if (move == 1) {
            HelloMaker_小车类.CarCtrlSpeed(HelloMaker_小车类.CarState.Car_Run, speed * 2.5)
            basic.pause(time * 1000)
            if (time != 0) {
                HelloMaker_小车类.CarCtrl(HelloMaker_小车类.CarState.Car_Stop)
            }
        }
        else if (move == 2) {
            HelloMaker_小车类.CarCtrlSpeed(HelloMaker_小车类.CarState.Car_Back, speed * 2.5)
            basic.pause(time * 1000)
            if (time != 0) {
                HelloMaker_小车类.CarCtrl(HelloMaker_小车类.CarState.Car_Stop)
            }
        }
    }

    //% blockId=AppProgramRotate block="手机编程-机器人旋转"
    export function AppProgramRotate() {

        if (direction == 1) {  // right
            HelloMaker_小车类.CarCtrlSpeed(HelloMaker_小车类.CarState.Car_SpinRight, speed * 2.5) // 
            basic.pause(time * 1000)
            if (time != 0) {
                HelloMaker_小车类.CarCtrl(HelloMaker_小车类.CarState.Car_Stop)
            }
        }
        else if (direction == 2) {  // left
            HelloMaker_小车类.CarCtrlSpeed(HelloMaker_小车类.CarState.Car_SpinLeft, speed * 2.5)
            basic.pause(time * 1000)
            if (time != 0) {
                HelloMaker_小车类.CarCtrl(HelloMaker_小车类.CarState.Car_Stop)
            }
        }
    }

    //% blockId=AppProgramRGB block="手机编程-RGB彩灯"
    export function AppProgramRGB() {
        if (rgb_id != 0) {
            if (rgb_color == 5) {
                rgb_color = 6
            } else if (rgb_color == 6) {
                rgb_color = 5
            } else if (rgb_color == 8) {
                rgb_color = 9
            }
            if (rgb_id == 1) {
                HelloMaker_显示类.setPixelRGB(0, rgb_color)
            }
            else if (rgb_id == 2) {
                HelloMaker_显示类.setPixelRGB(1, rgb_color)
            }

            HelloMaker_显示类.setBrightness(rgb_bright * 2.5)
            HelloMaker_显示类.showLight()

        }
        else {
            HelloMaker_显示类.clearLight()
        }

    }
    //% blockId=AppProgramColorDetect block="手机编程-颜色识别"
    export function AppProgramColorDetect() {

        if (HelloMaker_传感器类.checkCurrentColor(color_id) == true) {

            bluetooth.uartWriteString("*@col-1#")
        }
        else {

            bluetooth.uartWriteString("*@col-0#")
        }
    }
    //% blockId=AppProgramPwmServo block="手机编程-PWM舵机运动"
    export function AppProgramPwmServo() {

        HelloMaker_小车类.Servo_Car(dlbot_id, dlbot_pos, dlbot_speed)

    }
	
    //% blockId=AppProgramBusServo block="手机编程-总线舵机运动"
    export function AppProgramBusServo() {


        SendOneServoToMcu(dlbot_speed, dlbot_id, dlbot_pos)

    }
    
    //% blockId=AppProgramVersion block="手机编程-软件版本号"
    export function AppProgramVersion() {
        bluetooth.uartWriteString("*@HelloMakerbit_V0#")

    }
	/*
    //% blockId=AppProgramShowNumber block="手机编程-数字显示"
    export function AppProgramShowNumber() {
        basic.showNumber(show_number)
    }
    //% blockId=AppProgramShowString block="手机编程-字符串显示"
    export function AppProgramShowString() {
        basic.showString(stringReceive)
    }
	*/
	//% blockId=AppProgramTone block="音调"
    export function AppProgramTone():number {

		 return  Tone[tone]
		 
    }
	
	//% blockId=AppProgramBeat block="节拍"
    export function AppProgramBeat():number {

		  return music.beat(Beat[dlbot_beat])
	  
    }
	

    //% blockId=AppProgramxunjiState block="手机编程-寻迹传感器状态"
    export function AppProgramxunjiState() {

        bluetooth.uartWriteString("*@sta" + pins.i2cReadNumber(45, NumberFormat.UInt8LE, false) + "#")
    }
    //% blockId=AppProgramTemper block="手机编程-温度传感器数据"
    export function AppProgramTemper() {
        let wendu = input.temperature()
        bluetooth.uartWriteString("*@tem-" + wendu + "#")
    }

    //% blockId=APPCmd block="手机APP命令类型为 %type"

    export function APPCmd(type: CMD_TYPE): boolean {

        if (type == cmdType) {
            if (cmdType != CMD_TYPE.ROBOT_MODE_BIZHANG && cmdType != CMD_TYPE.ROBOT_MODE_XUNJI) {
                cmdType = -1
            }
            return true

        }
        else {

            return false

        }

    }

    //% blockId=HelloMaker_BuildingBlocks block="BuildingBlocks|%uartData"
    //% weight=96
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9

    export function BuildingBlocks(uartData: string) {

        let start_num = uartData.indexOf("*@")
        if (start_num != -1) {

            let sum3 = uartData.charAt(start_num + 2) + uartData.charAt(start_num + 3) + uartData.charAt(start_num + 4);
            switch (sum3) {
                case 'S' + 'e' + 'r':

                    if (uartData.charAt(start_num + 5) == 'c') {
                        if (uartData.charAt(start_num + 13) == 'S') {
                            Move_T = 9
                            cmdType = CMD_TYPE.STM32_MOVE
                        }
                        else if (uartData.charAt(start_num + 13) == 'B') {
                            Move_T = 10
                            cmdType = CMD_TYPE.STM32_MOVE
                        }
                        else if (uartData.charAt(start_num + 13) == 'L') {
                            Move_T = 11
                            cmdType = CMD_TYPE.STM32_MOVE
                        }
                        else if (uartData.charAt(start_num + 13) == 'R') {
                            Move_T = 12
                            cmdType = CMD_TYPE.STM32_MOVE
                        }
                        else if (uartData.charAt(start_num + 13) == 'Z') {
                            cmdType = CMD_TYPE.ROBOT_MODE_BIZHANG
                            Move_T = 13
                        }
                        else if (uartData.charAt(start_num + 13) == 'X') {
                            cmdType = CMD_TYPE.ROBOT_MODE_XUNJI
                            Move_T = 14
                        }
                        else if (uartData.charAt(start_num + 13) == '0') {
                            Move_T = 17
                            cmdType = CMD_TYPE.STM32_MOVE
                        }
                        else {
                            Move_T = 17
                        }
                        SendMoveTypeToMcu(Move_T)

                    }
                    else if (uartData.charAt(start_num + 5) == 'o') {
                        let Angle = 0
                        Stm32_POS = parseInt(uartData.substr(start_num + 9, 4))
                        Stm32_ID = parseInt(uartData.substr(start_num + 14, 1))
                        cmdType = CMD_TYPE.SERVO_ONE
                    }
                    else if (uartData.charAt(5) == 'g') {
                        Stm32_GROUP = parseInt(uartData.substr(start_num + 11, 3))
                        cmdType = CMD_TYPE.SERVO_GROUP
                    }

                    break;

                case 'm' + 's' + 't':
                    move = parseInt(uartData.substr(start_num + 6, 1))
                    speed = parseInt(uartData.substr(start_num + 8, 3))
                    time = parseInt(uartData.substr(start_num + 12, 2))
                    cmdType = CMD_TYPE.MST;
                    break

                case 's' + 'p' + 'e':
                    dl_CarSpeed = parseInt(uartData.substr(start_num + 8, 3))
                    cmdType = CMD_TYPE.ROBOT_SPEED_ADJUST
                    break

                case 'd' + 's' + 't':
                    direction = parseInt(uartData.substr(start_num + 6, 1))
                    speed = parseInt(uartData.substr(start_num + 8, 3))
                    time = parseInt(uartData.substr(start_num + 12, 2))

                    cmdType = CMD_TYPE.DST;
                    break


                case 'l' + 'i' + 'g':
                    rgb_id = parseInt(uartData.substr(start_num + 6, 1))
                    rgb_color = parseInt(uartData.substr(start_num + 8, 1))
                    rgb_bright = parseInt(uartData.substr(start_num + 10, 3))

                    cmdType = CMD_TYPE.LIG;

                    break

                case 'c' + 'o' + 'l':
                    {
                        color_id = parseInt(uartData.substr(start_num + 6, 1))
                        cmdType = CMD_TYPE.COL;

                    }

                    break
                case 's' + 'e' + 'r':


                    dlbot_pos = parseInt(uartData.substr(start_num + 6, 3))
                    dlbot_id = parseInt(uartData.substr(start_num + 10, 1))
                    dlbot_speed = parseInt(uartData.substr(start_num + 12, 2))

                    if (uartData.charAt(start_num + 4) == 'r') {

                        cmdType = CMD_TYPE.SERVO_MOVE
                    }
                    else if (uartData.charAt(start_num + 4) == 's') {
                        dlbot_speed = Math.map(10 - dlbot_speed, 0, 10, 100, 1000);
                        cmdType = CMD_TYPE.GP_BUSSERVO;

                    }
                    break

                case 't' + 'o' + 'n':

                    tone = parseInt(uartData.substr(start_num + 6, 2)) -1
				//	tone = (tone -1)%7
                    dlbot_beat = parseInt(uartData.substr(start_num + 9, 1))
                    cmdType = CMD_TYPE.TON

                    break

                case 'v' + 'e' + 'r':

                    Math.map(0, 0, 1023, 0, 4)
                    cmdType = CMD_TYPE.VER;

                    break

                case 'p' + 'o' + 's':
                     show_number = parseInt(uartData.substr(start_num + 9, uartData.length - 9))  /// mark 
               //    cmdType = CMD_TYPE.POS;

                    break

                case 's' + 'e' + 'n':
                      stringReceive = uartData.substr(start_num + 6, uartData.length - 6)  /// mark							
              //      cmdType = CMD_TYPE.SEN;
                    break

                case 't' + 'e' + 'm':

                    cmdType = CMD_TYPE.TEM
                    break

                case 's' + 't' + 'a':

                    cmdType = CMD_TYPE.STA;
                    break

                default:
                    cmdType = -1
                    break
            }

        }
      
    }


}


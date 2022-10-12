
//Library

#include <Keypad.h>
#include <AccelStepper.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const int rijNum = 4; //4 rijen
const int kolomNum = 3; //3 kolommen

char keys[rijNum][kolomNum] = {
  {'1','2','3'},
  {'4','5','6'},
  {'7','8','9'},
  {'*','0','#'}
};

byte rijPin[rijNum] = {13, 12, 11, 10}; //connect to the row pinouts of the keypad
byte kolomPin[kolomNum] = {9, 8, 7}; //connect to the column pinouts of the keypad

Keypad keypad = Keypad( makeKeymap(keys), rijPin, kolomPin, rijNum, kolomNum );

char key;
int password[10];
String input_password, oldInput_password;
int lastIndex;

int stepsPerRevolution = 64;
float degreePerRevolution = 5.625;


#define motorPin1  3                // IN1 pin on the ULN2003A driver
#define motorPin2  4                // IN2 pin on the ULN2003A driver
#define motorPin3  5               // IN3 pin on the ULN2003A driver
#define motorPin4  6               // IN4 pin on the ULN2003A driver

AccelStepper myStepper(AccelStepper::HALF4WIRE, motorPin1, motorPin3, motorPin2, motorPin4);


LiquidCrystal_I2C lcd(0x27,16,2);

boolean cursorState = false;

unsigned long currentMillis = 0;
int period = 500;

void setup() {
  // put your setup code here, to run once:
  // join i2c bus with address #4
  Wire.begin(4);                
  // register event
  Wire.onReceive(receiveEvent); 
  Serial.begin(9600);
  keypad.setDebounceTime(70);
  
  myStepper.setMaxSpeed(1500);
  myStepper.setAcceleration(400);
  myStepper.setSpeed(500);

  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.cursor();
  currentMillis = millis();
  
  lcd.setCursor(0,0);
  lcd.print("type password");
  lcd.setCursor(0, 1);
}

void loop() {
  // put your main code here, to run repeatedly:
  key = keypad.getKey();

  if(input_password != oldInput_password){
    oldInput_password = input_password;
    lcd.setCursor(0, 1);
    lcd.print(input_password);
  }

  if (millis() >= currentMillis + period){
    currentMillis = millis();
    if(!cursorState){
      lcd.cursor();
      cursorState = !cursorState;
    } else if (cursorState){
      lcd.noCursor();
      cursorState = !cursorState;
    }
  }

  if (key != NO_KEY && keypad.getState() == PRESSED){
    if (key == '*') {
      lastIndex = input_password.length()-1;
      input_password.remove(lastIndex);
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.setCursor(0, 1);
      lcd.print(input_password);
    } else if (key == '#') {
      lcd.noCursor();
      if (passwordChecking(input_password.toInt())) {
        lcd.setCursor(0, 0);
        lcd.print("password correct");
        lcd.setCursor(0, 1);
        lcd.print("unlocking locker");
        myStepper.moveTo(degToSteps(90));
        while (myStepper.distanceToGo() != 0){
          myStepper.run();
        }

        delay(500);
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("close door and");
        lcd.setCursor(0, 1);
        lcd.print("press *");

        while(key != '*'){
          key = keypad.getKey();
          }
        if (key == '*'){
          myStepper.moveTo(degToSteps(-90));
          while (myStepper.distanceToGo() != 0){
            myStepper.run();
          }
        }

        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("closed");
        delay(1500);
        lcd.clear();
        rmOldPassword(input_password.toInt());
        
      } else {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("password is");
        lcd.setCursor(0, 1);
        lcd.print("incorrect");
        delay(1500);
        lcd.clear();
      }
      
      lcd.setCursor(0,0);
      lcd.print("type password");
      lcd.setCursor(0, 1);
      oldInput_password = ""; // reset the input password
      input_password = ""; // reset the input password
    } else {
      input_password += key; // append new character to input password string
      
    }
  }
}

float degToSteps(float deg){
  return (stepsPerRevolution / degreePerRevolution) * deg;
}

int arraySize(int array[]){
  
}

boolean passwordChecking(int passw){
  int Size = int(sizeof(password)) / 2;
  if (passw == 0){
    return false;
  }
  for (int x = 0; x< Size ; x++){
    if (password[x] == passw){
      return true;
    }
  }
  return false;        
}

void rmOldPassword(int passw){
  int Size = int(sizeof(password)) / 2;
  for (int x = 0; x< Size ; x++){
    if (password[x] == passw){
      password[x] = 0;
    }
  }
}

// function that executes whenever data is received from master
// this function is registered as an event, see setup()
void receiveEvent(int howMany){
  String convert;
  int wachtwoord;

  while (Wire.available()) { // loop through all but the last
    char c = Wire.read(); // receive byte as a character
    convert += c;
  }

  wachtwoord = convert.toInt();
  convert = "";
  if (!passwordChecking(wachtwoord)){
    newPassword(wachtwoord);
  }
}

void newPassword(int passw){
  int Size = int(sizeof(password))/2;
  boolean test = false;
  for ( int x = 0 ;x < Size ; x++){
    if (password[x] == 0){
      password[x] = passw;
      break;
    }
  } 
}

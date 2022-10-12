#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <Wire.h>
 
ESP8266WebServer server(3000);
 
const char* ssid = "WiFi-2.4-90F0";
const char* password =  "R97pCnGgS7d2";

int recPassword;
 
void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);                   //Connect to the WiFi network
 
    while (WiFi.status() != WL_CONNECTED) {       //Wait for connection
 
        delay(500);
        Serial.println("Waiting to connect...");
        Wire.begin();                             // join i2c bus (address optional for master)
    }
 
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());               //Print the local IP
 
    server.on("/body", handleBody);               //Associate the handler function to the path
    server.enableCORS(true); 
    server.begin(); //Start the server
    Serial.println("Server listening");

    
 
}
 
void loop() {
 
    server.handleClient(); //Handling of incoming requests
 
}
 
void handleBody() { //Handler for the body path
 
      if (server.hasArg("plain")== false){ //Check if body received
 
            server.send(200, "text/plain", "Body not received");
            return;
 
      }
 
      String message = "Body received:\n";
             message += server.arg("plain");
             message += "\n";
 
      server.send(200, "text/plain", message);
      recPassword = server.arg("plain").toInt();
      sending(recPassword);
      //Serial.println(recPassword);
      //Serial.println(message);
      
}

void sending(int passw){
  String data = String(passw);
  Wire.beginTransmission(4); // transmit to device #4
  Wire.write(data.c_str());
  Wire.endTransmission();    // stop transmitting
}

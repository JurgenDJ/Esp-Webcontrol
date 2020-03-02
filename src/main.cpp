#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESPAsyncWebServer.h>

#include "../webcontent/dist/index.html.gz.h"
#include "wifi_credentials.h"

#include "handler.h"


AsyncWebServer server = AsyncWebServer(80);

// Callback for the index page
void onIndex(AsyncWebServerRequest *request)
{
  // Check if the client already has the same version and respond with a 304 (Not modified)
  if (request->header("If-Modified-Since").equals(index_last_update))
  {
    request->send(304);
  }
  else
  {
    // Dump the byte array in PROGMEM with a 200 HTTP code (OK)
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/html", index_html_gz, index_html_gz_len);
    response->addHeader("Content-Encoding", "gzip");
    response->addHeader("Last-Modified", index_last_update);
    request->send(response);
  }
}
void setup()
{
  Serial.begin(9600);
  pinMode(LED_BUILTIN,OUTPUT);
  Serial.println("starting ...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(wifi_ssid, wifi_pass);
  while (WiFi.status() != WL_CONNECTED){
    Serial.print('.');
    delay(500);
  }
  Serial.print("wifi address: ");
  // Serial.println(WiFi.localIP);
  Serial.printf("IP:%d.%d.%d.%d", WiFi.localIP()[0], WiFi.localIP()[1], WiFi.localIP()[2], WiFi.localIP()[3] );

  // Configure the webserver
  server.rewrite("/", "/index.html");
  server.on("/index.html", HTTP_GET, onIndex);
  server.on("/data.json", HTTP_GET, onData);
  server.on("/action", HTTP_POST, onAction);
  server.onNotFound([](AsyncWebServerRequest *request) { request->send(404); });
  server.begin();
}

void loop()
{
  digitalWrite(LED_BUILTIN,handlerLedStatus);
}

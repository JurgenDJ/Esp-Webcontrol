#include <handler.h>
#include <ArduinoJson.h>



void onData(AsyncWebServerRequest *request)
{
  // Sending Dummy data
  const char *dummy_data =
      "{"
      "    \"floor0Heating\" : true,"
      "    \"floor1Heating\": true,"
      "    \"PrioSanitary\" : false,"
      "    \"rooms\" : ["
      "        {"
      "            \"id\": \"liv\","
      "            \"temp\": 20,"
      "            \"tempSet\": 22.5,"
      "            \"timer\": 0,"
      "            \"onOff\": true"
      "        },"
      "        {"
      "            \"id\": \"bath\","
      "            \"temp\": 20.5,"
      "            \"tempSet\": 22.5,"
      "            \"timer\": 1800,"
      "            \"onOff\": true"
      "        },"
      "        {"
      "            \"id\": \"room1\","
      "            \"temp\": 19.5,"
      "            \"tempSet\": 21.5,"
      "            \"timer\": 0,"
      "            \"onOff\": true"
      "        },"
      "        {"
      "            \"id\": \"room2\","
      "            \"temp\": 19.8,"
      "            \"tempSet\": 20.0,"
      "            \"timer\": 0,"
      "            \"onOff\": true"
      "        },"
      "        {"
      "            \"id\": \"room3\","
      "            \"temp\": 17.5,"
      "            \"tempSet\": 16.5,"
      "            \"timer\": 0,"
      "            \"onOff\": false"
      "        }"
      "    ]"
      "}";
  request->send(200, "data/json", dummy_data);
}

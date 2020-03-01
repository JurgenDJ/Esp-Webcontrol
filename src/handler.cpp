#include <handler.h>
#include <ArduinoJson.h>

float randomTemp()
{
  return round(random(140, 250)) / 10;
}
int randomTimer()
{
  int result = round(random(1, 4000)); // timer should be 0 in 50% of the cases, otherwise between 1 and 2000
  return result > 2000 ? 0 : result;
}
bool randomBool()
{
  return random(50)>25;
}

JsonObject addRoomObject(JsonArray parent, const char *id, float temp, float tempSet, int timer, bool onOff)
{
  JsonObject room = parent.createNestedObject();
  room["id"] = id;
  room["temp"] = temp;
  room["tempSet"] = tempSet;
  room["timer"] = timer;
  room["onOff"] = onOff;
  return room;
}

JsonObject addRoomObject_random(JsonArray parent, const char *id)
{
  JsonObject room = parent.createNestedObject();
  room["id"] = id;
  float temp = randomTemp();
  float tempSet = randomTemp();
  room["temp"] = temp;
  room["tempSet"] = tempSet;
  room["timer"] = randomTimer();
  room["onOff"] = temp < tempSet;
  return room;
}

void onData(AsyncWebServerRequest *request)
{
  const int capacity = JSON_OBJECT_SIZE(3) + JSON_ARRAY_SIZE(5) + 5 * JSON_OBJECT_SIZE(5);
  StaticJsonDocument<capacity> doc;
  bool bPrioSanitary = randomBool();
  doc["PrioSanitary"] = bPrioSanitary;
  doc["floor0Heating"] = bPrioSanitary?false:randomBool();
  doc["floor1Heating"] = bPrioSanitary?false:randomBool();
  JsonArray roomsList = doc.createNestedArray("rooms");
  addRoomObject_random(roomsList, "liv"  );
  addRoomObject_random(roomsList, "bath" );
  addRoomObject_random(roomsList, "room1");
  addRoomObject_random(roomsList, "room2");
  addRoomObject_random(roomsList, "room3");

  AsyncResponseStream *response = request->beginResponseStream("application/json");
  serializeJson(doc, *response);
  request->send(response);
}

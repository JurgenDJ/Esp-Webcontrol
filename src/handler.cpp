#include <handler.h>
#include <ArduinoJson.h>

JsonObject addRoomObject(JsonArray parent, const char* id, float temp, float tempSet, int timer, bool onOff){
  JsonObject room = parent.createNestedObject();
  room["id"] = id;
  room["temp"] = temp;
  room["tempSet"] = tempSet;
  room["timer"] = timer;
  room["onOff"] = onOff;
  return room;
}

void onData(AsyncWebServerRequest *request)
{
  const int capacity = JSON_OBJECT_SIZE(3)+JSON_ARRAY_SIZE(5)+5*JSON_OBJECT_SIZE(5);
  StaticJsonDocument<capacity> doc;
  doc["floor0Heating"] = true;
  doc["floor1Heating"] = true;
  doc["PrioSanitary"] = false;
  JsonArray roomsList = doc.createNestedArray("rooms");
  addRoomObject(roomsList, "liv", 20, 22.5, 0, true);
  addRoomObject(roomsList, "bath", 20.5, 22.5, 1800, true);
  addRoomObject(roomsList, "room1", 19.5, 21.5, 0, true);
  addRoomObject(roomsList, "room2", 19.8, 20.0, 0, true);
  addRoomObject(roomsList, "room3", 17.5, 16.5, 0, false);

  AsyncResponseStream *response = request->beginResponseStream("application/json");
  serializeJson(doc,*response);
  request->send(response);
}

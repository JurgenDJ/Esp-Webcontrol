#ifndef HANDLER_H_
#define HANDLER_H_

#include <ESPAsyncWebServer.h>


void onData(AsyncWebServerRequest *request);
void onAction(AsyncWebServerRequest *request);

bool handlerLedStatus = false;

#endif /* !HANDLER_H_ */

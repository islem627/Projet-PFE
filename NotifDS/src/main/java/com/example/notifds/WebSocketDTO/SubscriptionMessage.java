package com.example.notifds.WebSocketDTO;

import java.util.Map;

public class SubscriptionMessage {
    private String event;
    private Map<String, String> data;

    // Getters et setters
    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public Map<String, String> getData() {
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }
}


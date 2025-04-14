package com.example.websocket.Controller;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WsChatMessage {

    private String sender;
    private String content;
    private WsChatMessageType type;

}
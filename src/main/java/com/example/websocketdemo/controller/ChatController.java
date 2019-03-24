package com.example.websocketdemo.controller;

import com.example.websocketdemo.model.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

/**
 *.
 */
@Controller
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        logger.info("Got new Message" + chatMessage.toString());
        if(chatMessage.getContent().equals("e.which === 37 && snake.dx === 0")){
            //if (e.which === 37 && snake.dx === 0) {


            chatMessage.setContent("left matched");
            chatMessage.setDx(-16);
            chatMessage.setDy(0);

        }else if(chatMessage.getContent().equals("Up Arrow")){
            chatMessage.setContent("up matched");




        }else if(chatMessage.getContent().equals("right arrow")){
            chatMessage.setContent("right matched");



        }else if(chatMessage.getContent().equals("Down Arrow")){
            chatMessage.setContent("Down matched");
        }
        else {
            chatMessage.setContent("did not match");
        }
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session

        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        logger.info("Added new User to chat" + chatMessage.toString());
        return chatMessage;
    }
    public ChatMessage sendkeys(@Payload ChatMessage chatMessage) {
        logger.info("Got new Message" + chatMessage.toString());
        return chatMessage;
    }


}

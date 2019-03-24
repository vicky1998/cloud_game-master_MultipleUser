package com.example.websocketdemo.model;

/**
 * Created by rajeevkumarsingh on 24/07/17.
 */
public class ChatMessage {
    private MessageType type;
    private String content;
    private int dx,dy;

    private String sender;

//    @Override
//    public String toString() {
//        return "ChatMessage{" +
//                "type=" + type +
//                "dx=" +dx+
//                "dy= "+ dy+
//                ", content='" + content + '\'' +
//                ", sender='" + sender + '\'' +
//                '}';
//    }

    public void setDy(int i) {
        this.dy=i;
    }
    public void setDx(int i) {
        this.dx=i;
    }


    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getDx() {
        return dx;
    }

    public int getDy() {
        return dy;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
}

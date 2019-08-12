package com.datatroniq.iottask.collector.generate;

import com.datatroniq.iottask.collector.broadcast.BroadcastMessageProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataGenerator implements CommandLineRunner {

    private BroadcastMessageProducer broadcastMessageProducer;

    @Autowired
    public DataGenerator(BroadcastMessageProducer broadcastMessageProducer) {
        this.broadcastMessageProducer = broadcastMessageProducer;
    }

    @Override
    public void run(String... args) throws Exception {
        Thread.sleep(500);
        while(true) {
            this.broadcastMessageProducer.send();
            Thread.sleep(50);
        }
    }
}
